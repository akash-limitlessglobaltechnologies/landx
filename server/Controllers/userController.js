const asyncHandler = require("express-async-handler");
const { generateToken } = require("../Config/generateToken");
const User = require("../Models/userModel");
const Property = require("../Models/propertyModel");
const twilio = require("twilio");
const jwt = require('jsonwebtoken');

const accountSid = process.env.TWILIO_ACCOUNT_SID; 
const authToken = process.env.TWILIO_AUTH_TOKEN; 
const serviceSid = process.env.TWILIO_SERVICE_SID; 
const client = twilio(accountSid, authToken);
const bcrypt = require("bcryptjs"); // Import bcrypt for hashing

const signinController = asyncHandler(async (req, res) => {
    const { phoneNumber, pin } = req.body;

    // Validate the pin is 4 digits
    if (!/^\d{4}$/.test(pin)) {
        return res.status(400).json({ message: "Pin must be a 4-digit number." });
    }

    // Check if the user exists
    const user = await User.findOne({ phoneNumber });

    if (!user) {
        return res.status(404).json({ message: "User not found." });
    }

    // Compare the provided pin with the hashed pin in the database
    const isMatch = await bcrypt.compare(pin, user.pin);
    if (!isMatch) {
        return res.status(400).json({ message: "Incorrect pin." });
    }

    // Generate JWT token for the user with phone number
    const token = generateToken(user.phoneNumber);

    // Fetch properties associated with the user
    const properties = await Property.find({ createdBy: user._id }).populate("createdBy", "phoneNumber");

    // Return token, user details, and properties
    res.json({
        message: "Login successful!",
        token,
        phoneNumber: user.phoneNumber,
        username: user.username,
        properties,
    });
});


const signupController = asyncHandler(async (req, res) => {
    const { username, phoneNumber, code, pin } = req.body;

    // Phase 1: Send OTP
    if (!code && !pin) {
        // Check if the user is already signed up
        const existingUser = await User.findOne({ phoneNumber });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this phone number." });
        }

        // Send OTP to the provided phone number
        const verification = await client.verify.v2.services(serviceSid)
            .verifications
            .create({ to: phoneNumber, channel: 'sms' });

        return res.json({ message: "OTP sent successfully. Please check your SMS." });
    }

    // Phase 2: Verify OTP
    if (code && !pin) {
        const verificationCheck = await client.verify.v2.services(serviceSid)
            .verificationChecks
            .create({ to: phoneNumber, code });

        if (verificationCheck.status !== 'approved') {
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }

        return res.json({ message: "OTP verified. Please provide your 4-digit pin." });
    }

    // Phase 3: Save user with 4-digit password (PIN)
    if (pin) {
        // Validate pin is numeric and 4 digits
        if (!/^\d{4}$/.test(pin)) {
            return res.status(400).json({ message: "Pin must be a 4-digit number." });
        }

        // Check if the user already exists
        let user = await User.findOne({ phoneNumber });
        if (user) {
            return res.status(400).json({ message: "User already exists." });
        }

        // Hash the 4-digit pin with salt
        const salt = await bcrypt.genSalt(10);
        const hashedPin = await bcrypt.hash(pin, salt);

        // Create a new user with username, phoneNumber, and hashed pin
        user = await User.create({ username, phoneNumber, pin: hashedPin });

        // Generate JWT token for the user with phone number
        const token = generateToken(user.phoneNumber);

        return res.json({
            message: "Signup successful!",
            token,
            phoneNumber: user.phoneNumber,
            username: user.username,
        });
    }
});


const loginController = asyncHandler(async (req, res) => {
    const { phoneNumber, code } = req.body; 

    // If no code is provided, send the OTP
    if (!code) {
        const verification = await client.verify.v2.services(serviceSid)
            .verifications
            .create({ to: phoneNumber, channel: 'sms' });
        return res.json({ message: "OTP sent successfully. Please check your SMS." });
    }

    // If a code is provided, verify the OTP
    const verificationCheck = await client.verify.v2.services(serviceSid)
        .verificationChecks
        .create({ to: phoneNumber, code });

    // Check if OTP verification was successful
    if (verificationCheck.status !== 'approved') {
        return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    // Check if the user exists in the database
    let user = await User.findOne({ phoneNumber });

    // Create a new user if not found after OTP verification
    if (!user) {
        user = await User.create({ phoneNumber });
    }

    // Generate JWT token for the user with phone number
    const token = generateToken(user.phoneNumber);

    // Fetch properties associated with the user
    const properties = await Property.find({ createdBy: user._id }).populate("createdBy", "phoneNumber");

    // Respond with token, user details, and properties
    res.json({
        message: "Login successful!",
        token,
        phoneNumber: user.phoneNumber,
        properties, // Include the user's properties
    });
});

// Create property controller
const createPropertyController = asyncHandler(async (req, res) => {
    const { title, rawJson } = req.body;
    const phoneNumber = req.user.phoneNumber; // Get the phone number from the authenticated user

    // Check if the user exists in the database by phone number
    const user = await User.findOne({ phoneNumber });

    if (!user) {
        return res.status(404).json({ message: "User not found." });
    }

    // Create the new property
    const property = await Property.create({
        title,
        rawJson,
        createdBy: user._id, // Associate the property with the user ID
    });

    // Push the property ID into the user's properties array
    await User.findByIdAndUpdate(user._id, {
        $push: { properties: property._id },
    });

    res.status(201).json(property);
});

// Fetch all properties controller
const fetchPropertiesController = asyncHandler(async (req, res) => {
    const properties = await Property.find().populate("createdBy", "phoneNumber"); // Optionally populate createdBy field with user details
    res.json(properties);
});

// Fetch property by ID controller
const fetchPropertyByIdController = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the ID from the URL parameters

    // Find the property by ID
    const property = await Property.findById(id).populate("createdBy", "phoneNumber");

    // If the property is not found, return a 404 error
    if (!property) {
        return res.status(404).json({ message: "Property not found." });
    }

    // Return the property as a JSON response
    res.json(property);
});

const fetchUserPropertiesController = asyncHandler(async (req, res) => {
    try {
        // Get token from header
        const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN format
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        // Verify token and extract phone number
        let phoneNumber;
        try {
            // Make sure to use the same JWT_SECRET that you used to generate the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            phoneNumber = decoded.phoneNumber; // Assuming your token contains phoneNumber
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }

        // Find the user by phone number
        const user = await User.findOne({ phoneNumber });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Find all properties created by this user
        const properties = await Property.find({ createdBy: user._id })
            .populate("createdBy", "phoneNumber")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: properties.length,
            properties
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching user properties",
            error: error.message
        });
    }
});

const updatePropertyAccessController = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the property ID from the URL
    const { accessCode, secure } = req.body; // Get accessCode and secure from request body
  
    // Find the property by ID
    const property = await Property.findById(id);
  
    if (!property) {
      return res.status(404).json({ message: "Property not found." });
    }
  
    // Update the accessCode and secure fields
    property.accessCode = accessCode || property.accessCode; // Keep old value if no accessCode is provided
    property.secure = typeof secure === 'boolean' ? secure : property.secure; // Update only if secure is boolean
  
    // Save the updated property
    const updatedProperty = await property.save();
  
    res.json({
      message: "Property updated successfully",
      property: updatedProperty,
    });
  });
  


module.exports = {
    loginController,
    createPropertyController,
    fetchUserPropertiesController,
    fetchPropertyByIdController, // Export the new controller
    signinController,
    signupController,
    updatePropertyAccessController
};
