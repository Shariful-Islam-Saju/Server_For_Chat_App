import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
  } catch (error) {
    console.log("There is a error connecting Database", error);
  }
}
