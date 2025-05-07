const mongoose = require("mongoose");
const Property = require("./propertyModel");

const userSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
    },
    pin: {
        type: String, // This will store the hashed pin
        required: true,
    },
    properties: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
    }],
});


// Specify the collection name as 'landxuser'
const User = mongoose.model("User", userSchema, "landxuser");

module.exports = User;
