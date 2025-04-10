import { connectDB } from "../lib/db.js";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";

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

    return res.status(202).json({ message: "Login successfully." });
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

    generateToken({ id: newUser._id }, res);

    await newUser.save();
    return res.status(201).json({ message: "Account created successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Problem" });
  }
}
export async function logout(req, res) {}
