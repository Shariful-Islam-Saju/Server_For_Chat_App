import { v2 as cloudinary } from "cloudinary";
// this will be optional
import { config } from "dotenv";
config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Use process.env
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
