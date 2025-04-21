import express from "express";
import { config } from "dotenv";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import conversationRouter from "./routes/conversaion.route.js";
import { protectedRoute } from "./middleware/protectedRoute.js";
const app = express();
config();

const PORT = process.env.SERVER_PORT;
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/conversation",protectedRoute, conversationRouter);

app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
