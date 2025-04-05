import mongoose from "mongoose";

export async function connectDB() {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URL);
    console.log("server connected");
  } catch (error) {
    console.log("There is a error connecting Database", error);
  }
}
