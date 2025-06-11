const User = require("../Models/UserModel"); // Import the User model
const bcrypt = require("bcrypt"); // Library for hashing passwords
const jwt = require("jsonwebtoken"); // Library for creating JSON Web Tokens

const register = async (req, res) => {
  const { name, email, password } = req.body; // Extract user details from request body
  try {
    // Check if all required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser  = await User.create({ name, email, password: hashedPassword });
    
    // Send success message
    res.status(201).json({ message: "User  registered successfully", user: newUser  });
  } catch (err) {
    // Log the error to the terminal
    console.error("Registration error:", err); // Log the error details
    res.status(400).json({ error: err.message }); // Send error response
  }
};

// Login a user
const login = async (req, res) => {
  const { email, password } = req.body; // Extract login details from request body
  try {
    const user = await User.findOne({ email }); // Find user by email
    if (!user) return res.status(404).json({ error: "User  not found" }); // Handle not found

    const isMatch = await bcrypt.compare(password, user.password); // Compare passwords
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" }); // Handle invalid credentials

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" }); // Create JWT
    res.status(200).json({ message: "Login successful", token }); // Send success message and token
  } catch (err) {
    res.status(500).json({ error: err.message }); // Handle errors
  }
};

module.exports = { register, login }; // Export controller functions
