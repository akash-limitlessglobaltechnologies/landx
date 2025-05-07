const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  rawJson: {
    type: Object,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  accessCode: {
    type: String,
 // Assuming every property needs an access code
  },
  secure: {
    type: Boolean,
    default: false, // Default value set to false
  }
}, {
  timestamps: true,
});

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
