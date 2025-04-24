import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { findUserByEmail, generateToken } from "../lib/utils.js";

//login route
export async function login(req, res) {
  const token = req.cookies;
  console.log("this is jwt token", token);
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(500).json({ message: "All fields are required." });
    }
    const existingUser = await findUserByEmail(email);
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
      username: existingUser.username,
      profilePic: existingUser.profilePic,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Problem" });
  }
}

// register
export async function register(req, res) {
  try {
    const { name: username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(500).json({ message: "All fields are required." });
    }
    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be 6 charecters." });

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(500).json({ message: "Email already exits." });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const profilePic = req.file ? req.file.path : "";
    const newUser = new User({
      email,
      password: hashPassword,
      username,
      profilePic,
    });
    await newUser.save();
    return res.status(201).json({ message: "Account created successfully." });
  } catch (error) {
    console.log("Error in register auth controller", error);
    return res.status(500).json({ message: "Server Problem" });
  }
}

// logout
export async function logout(req, res) {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  res.status(200).json({ message: "Logout Successfully." });
}
