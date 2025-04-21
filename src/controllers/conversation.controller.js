import { findUserById } from "../lib/utils.js";
import Conversation from "../models/conversation.model.js";
import { isValidObjectId } from "mongoose";

export async function getAllConversationByUserId(req, res) {}

export async function createConversation(req, res) {
  try {
    const { id:participantId } = req.params; // Use req.body for consistency
    const userId = req.user._id;

    // Validate ObjectId
    if (!isValidObjectId(participantId)) {
      return res.status(400).json({ message: "Invalid participant ID" });
    }

    const isExistingParticipant = await findUserById(participantId);
    const isExistingUser = await findUserById(userId);

    if (!isExistingParticipant || !isExistingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (isExistingParticipant._id.equals(isExistingUser._id)) {
      return res.status(400).json({ message: "Cannot create DM with self" });
    }

    const existingDM = await Conversation.findOne({
      type: "dm",
      "participants.userId": { $all: [userId, participantId]},
    });
    if (existingDM) {
      return res
        .status(400)
        .json({ message: "DM already exists", conversation: existingDM });
    }

    const conversation = new Conversation({
      type: "dm",
      createdBy: userId,
      participants: [
        { userId, role: "member" },
        { userId: participantId, role: "member" },
      ],
    });

    await conversation.save();

    return res.status(201).json(conversation);
  } catch (error) {
    console.error("Error in createConversation:", error);
    res.status(500).json({ message: "Something unexpected happened" });
  }
}
