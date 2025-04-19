import express from "express";
import {
  register,
  login,
  logout,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/protectedRoute.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.put("/updateProfile", protectedRoute, updateProfile);

export default router;
