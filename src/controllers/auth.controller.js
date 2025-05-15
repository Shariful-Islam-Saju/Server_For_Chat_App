import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { findUserByEmail, generateToken } from "../lib/utils.js";

//login route
export async function login(req, res) {
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
      user: {
        id: existingUser._id,
        email: existingUser.email,
        username: existingUser.username,
        profilePic: existingUser.profilePic,
      },
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
    generateToken(newUser._id, res);
    return res.status(201).json({
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        profilePic: newUser.profilePic,
      },
    });
  } catch (error) {
    console.log("Error in register auth controller", error);
    return res.status(500).json({ message: "Server Problem" });
  }
}

export async function checkAuth(req, res) {
  const user = req.user;
  res.status(200).json({
    user: {
      id: user._id,
      email: user.email,
      username: user.username,
      profilePic: user.profilePic,
    },
  });
}

// logout
export async function logout(req, res) {
  res.clearCookie("jwt_auth_token", {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  res.status(200).json({ message: "Logout Successfully." });
}
