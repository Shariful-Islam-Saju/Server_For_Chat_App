import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { connectDB } from "../lib/db.js";

export async function protectedRoute(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) return res.status(404).json({ message: "Token not found!" });
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  connectDB();
  const isExistingUser = await User.findById(decoded.id).select("-password");
  if (!isExistingUser)  return res.status(404).json({ message: "Account not found!" });
  next();
}
