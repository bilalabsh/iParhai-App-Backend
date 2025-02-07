const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { v4: uuidv4 } = require("uuid");
const generateToken = require("../config/generateToken");
const { generateOTP, sendOTP } = require("../config/generateOTP");

const validatePassword = (password) => {
  const passwordRegex = /^(?=.*\d)(?=.*[A-Z]).{8,}$/;
  return passwordRegex.test(password);
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  if (!validatePassword(password)) {
    res.status(400);
    throw new Error(
      "Password must be at least 8 characters long, contain at least one numerical character, and at least one uppercase character"
    );
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

  // Log OTP to ensure it's being generated
  console.log("Generated OTP:", otp);

  await sendOTP(email, otp);

  // Create user with OTP and expiry
  const user = await User.create({
    name,
    email,
    password,
    otp,
    otpExpires,
  });

  // Log user data before sending response
  console.log("User created with OTP:", user);

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password, // Password is hashed by the pre-save hook
      token: generateToken(user._id),
      otp: user.otp, // Include OTP in response for confirmation
      message: "OTP sent to your email. Please verify.",
    });
  } else {
    res.status(400);
    throw new Error("Failed to create user");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  // Validate email and OTP are provided
  if (!email || !otp) {
    res.status(400);
    throw new Error("Please provide both email and OTP");
  }

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  // Check if OTP is valid and not expired
  if (user.otp === otp && user.otpExpires > Date.now()) {
    const sessionId = uuidv4();

     user.sessionId = sessionId;
     await user.save();
    // OTP is valid, generate token and return user data
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      otp: user.otp,
      sessionId,
    });
  } else {
    // Invalid OTP or OTP expired
    res.status(400);
    throw new Error("Invalid or expired OTP");
  }
});

module.exports = { registerUser, authUser };
