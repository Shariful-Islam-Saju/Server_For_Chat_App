import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
import { CloudinaryStorage } from "multer-storage-cloudinary";

config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Use process.env
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile_pics",
    allowed_formats: ["jpg", "png", "jpeg", "pdf"],
  },
});
