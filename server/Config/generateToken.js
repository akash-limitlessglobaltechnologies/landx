const jwt = require("jsonwebtoken");

const generateToken = (phoneNumber) => {
    return jwt.sign({ phoneNumber }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET); // Adjusted to accept the token for verification
};

module.exports = { generateToken, verifyToken };
