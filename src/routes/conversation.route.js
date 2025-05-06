import { Router } from "express";
import {
  createConversation,
  getAllConversationByUserId,
} from "../controllers/conversation.controller.js";

const router = Router();

router.get("/conversations", getAllConversationByUserId);

router.post("/:id", createConversation);

export default router;
