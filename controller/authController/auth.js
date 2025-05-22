const mongoose = require("mongoose");
const userModel = require("../../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
require("dotenv").config();




async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(409).json({ message: "Email or password is incorrect." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email or password is incorrect." });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    // ✅ Return token and user data (excluding password)
    const { password: _, ...userData } = user.toObject(); // remove password

    res.status(200).json({
      message: "Login successful",
      token,
      user: userData
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function signUp(req, res) {
  try {
    const { username, email, password, cpassword, termcheck } = req.body;

    // Basic field check
    if (!username  ) {
      return res.status(400).json({ message: "username fields are requried." });
    }
   
    if (!email ) {
      return res.status(400).json({ message: "email fields are requried." });
    }
    if ( !password || !cpassword ) {
      return res.status(400).json({ message: "password fields are requried." });
    }
   
   

    // Check if passwords match
    if (password !== cpassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

   if (!termcheck) {
  return res.status(400).json({ message: "You must agree to the terms and conditions." });
}

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already registered. Try a different email." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });

    // Respond with success
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
// Route: POST /api/logout

const logout = async (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    })
    .status(200)
    .json({ message: "Logged out successfully" });
};




module.exports = {signUp,login,logout};


