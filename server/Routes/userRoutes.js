const express = require("express");
const Router = express.Router();
const {
  signupController,
  signinController,
  createPropertyController,
  fetchPropertyByIdController,
  fetchUserPropertiesController,
  updatePropertyAccessController,
  forgetPinController     // Import the new controller
} = require("../Controllers/userController");
const authMiddleware = require("../Middleware/authMiddleware");

// Signup and Signin routes
Router.post("/signup", signupController);
Router.post("/signin", signinController);

// Password reset route
Router.post("/forget-pin", forgetPinController);

// Property-related routes
Router.post("/create-property", authMiddleware, createPropertyController);
Router.get("/fetch-properties/:id", fetchPropertyByIdController);
Router.get("/user-properties", fetchUserPropertiesController);

// Update access code and secure fields
Router.put("/update-property", authMiddleware, updatePropertyAccessController);

module.exports = Router;