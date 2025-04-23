import express from "express";
import { register, login, logout } from "../controllers/auth.controller.js";
import upload from "../lib/multer.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", upload.single("avatar"), register);
router.post("/logout", logout);

export default router;
