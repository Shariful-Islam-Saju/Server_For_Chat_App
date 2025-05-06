import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export async function protectedRoute(req, res, next) {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.status(404).json({ message: "Token not found!" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const isExistingUser = await User.findById(decoded.id).select("-password");
    if (!isExistingUser)
      return res.status(404).json({ message: "Account not found!" });
    req.user = isExistingUser;
    next();
  } catch (error) {
    console.log("Error in protected route", error);
    return res.status(401).json({ message: "Server Problem" });
  }
}
