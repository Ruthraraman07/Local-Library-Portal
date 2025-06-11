const express = require("express");  //for backend server setup
const { register, login } = require("../Controllers/AuthController"); // Import authentication controller functions
const router = express.Router(); // Create a router for authentication-related routes

// Define routes for user registration and login
router.post("/register", register); // Register a new user
router.post("/login", login);       // Login an existing user

module.exports = router; // Export the router
