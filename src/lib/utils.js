import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1day",
  });
  res.cookie("jwt_auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // false in dev
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });

  return token;
};

export async function findUserById(id) {
  const user = await User.findById(id);

  if (user) return user;
  return null;
}

export async function findUserByEmail(email) {
  const user = await User.findOne({ email });

  if (user) return user;
  return null;
}
