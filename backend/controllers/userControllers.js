const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.SECRET_KEY || "your_secret_key";

const signUpUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({ message: "Email already associated with an account" });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const newUser = new User({ username, password: hashedPassword, email });
    await newUser.save();
    // Respond with a success message
    res.status(201).json({ message: "Signup successful! Please log in." });
  } catch (e) {
    console.error(e); // Log the error for debugging
    res.status(500).json({ error: e.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const userValidation = await User.findOne({ username });

    if (!userValidation) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare the received password with the stored hashed password
    const isMatch = await bcrypt.compare(password, userValidation.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    // JWT logic to return a token
    const token = jwt.sign(
      { id: userValidation._id }, // Use user ID or any unique identifier
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    // Send the token back to the client
    res.json({
      _id: userValidation._id,
      username: userValidation.username,
      email: userValidation.email,
      isAdmin: userValidation.isAdmin,
      token, // This is your JWT token
    });
    console.log("token sucessfully sent");
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};

module.exports = { signUpUser, loginUser };
