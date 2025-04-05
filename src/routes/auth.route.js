import express from "express";
import { signup, register, signout } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", signup);
router.post("/register", register);
router.post("/logout", signout);

export default router;
