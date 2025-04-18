import { connectDB } from "../lib/db.js";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
import path from "path";
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(500).json({ message: "All fields are required." });
    }
    await connectDB();
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "Email Not found" });
    }
    const isCorrectPassword = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isCorrectPassword) {
      return res.status(402).json({ message: "Password didn't match." });
    }
    generateToken(existingUser._id, res);
    return res.status(200).json({
      id: existingUser._id,
      email: existingUser.email,
      fullName: existingUser.fullName,
      profilePic: existingUser.profilePic,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Problem" });
  }
}

export async function register(req, res) {
  try {
    const { fullName, email, password, profilePic } = req.body;
    if (!fullName || !email || !password) {
      return res.status(500).json({ message: "All fields are required." });
    }
    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be 6 charecters." });
    await connectDB();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(500).json({ message: "Email already exits." });
    }
    const hashpassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashpassword,
      fullName,
      profilePic,
    });

    newUser._id, res;

    await newUser.save();
    return res.status(201).json({ message: "Account created successfully." });
  } catch (error) {
    console.log("Error in register auth controller", error);
    return res.status(500).json({ message: "Server Problem" });
  }
}
export async function logout(req, res) {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  res.status(200).json({ message: "Logout Successfully." });
}

export async function updateProfile(req, res) {
  try {
    const { profilePic } = req.body;
    if (!profilePic)
      return res.status(400).json({ message: "Profile Pic is required!" });

    const uploadProfilePic = await cloudinary.uploader.upload();
    console.log(uploadProfilePic);
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        profilePic: uploadProfilePic.secure_url,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in UpdateProfile", error);
    return res.status(500).json({ message: "Server Problem" });
  }
}
