import express from "express";
import cors from "cors";
import { config } from "dotenv";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import conversationRouter from "./routes/conversaion.route.js";
import { protectedRoute } from "./middleware/protectedRoute.js";
const app = express();
config();

const PORT = process.env.SERVER_PORT;
app.use(
  cors({
    origin: process.env.FRONTED_URI,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {

  res.status(200).json({message:"This is me Shariful Islam."})
})

app.use("/api/auth", authRouter);
app.use("/api/conversation", protectedRoute, conversationRouter);
app.listen(PORT, async () => {
  console.log(`Server running `);
});
