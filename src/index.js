import express from "express";
import cors from "cors";
import { config } from "dotenv";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import conversationRouter from "./routes/conversation.route.js";
import { protectedRoute } from "./middleware/protectedRoute.js";
import { connectDB } from "./lib/db.js";
const app = express();
config();

const PORT = process.env.SERVER_PORT;
const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:3000"];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(cookieParser());
connectDB();

app.use("/api/auth", authRouter);
app.use("/api/conversation", protectedRoute, conversationRouter);
app.listen(PORT, async () => {
  console.log(`Server running `);
});
