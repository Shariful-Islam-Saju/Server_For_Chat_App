import express from "express";
import { register, login, logout, checkAuth } from "../controllers/auth.controller.js";
import upload from "../lib/multer.js";
import { protectedRoute } from "../middleware/protectedRoute.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", upload.single("avatar"), register);
router.get("/logout", logout);
router.get("/check-auth", protectedRoute, checkAuth);
export default router;
