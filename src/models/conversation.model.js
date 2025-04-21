import mongoose, { Schema } from "mongoose";

const conversationSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ["dm", "group"],
    index: true,
  },
  title: {
    type: String,
    trim: true,
    default: null,
    required: function () {
      return this.type === "group";
    },
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  participants: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      role: {
        type: String,
        enum: ["admin", "member"],
        default: function () {
          return this.userId.equals(this._parent.createdBy)
            ? "admin"
            : "member";
        },
      },
      joinedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update `updatedAt` timestamp on save
conversationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Validate DMs have exactly two participants
conversationSchema.pre("save", function (next) {
  if (this.type === "dm" && this.participants.length !== 2) {
    return next(new Error("DMs must have exactly two participants"));
  }
  next();
});

// Prevent duplicate participants
conversationSchema.pre("save", function (next) {
  const userIds = this.participants.map((p) => p.userId.toString());
  if (new Set(userIds).size !== userIds.length) {
    return next(new Error("Duplicate participants are not allowed"));
  }
  next();
});

// Index for efficient participant queries
conversationSchema.index({ "participants.userId": 1 });

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
