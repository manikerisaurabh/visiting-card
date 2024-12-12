const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model.js");
const { connectToMongoDB } = require("../db/connectToDb.js");
const JWT_SECRET = process.env.JWT_SECRET;

// Sign-up Function
const signUpController = async (req, res) => {
  try {
    console.log("req hit");
    await connectToMongoDB();
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();

    // Generate a JWT token for the new user
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error("Error in signUp controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Sign-in Function
const signInController = async (req, res) => {
  try {
    await connectToMongoDB();
    const { username, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({ user, token });
  } catch (error) {
    console.error("Error in signIn controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  signUpController,
  signInController,
};
