import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
const app = express();
dotenv.config();

const PORT = process.env.SERVER_PORT;
app.use(express.json());

app.use("/api/auth", authRouter);

app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
