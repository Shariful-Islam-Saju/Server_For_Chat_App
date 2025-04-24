import multer from "multer";
import { storage } from "./cloudinary.js";
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const ext = file.originalname.split(".").pop().toLowerCase();
    if (!allowedTypes.test(ext)) {
      return cb(new Error("Only JPG, PNG, and PDF files are allowed!"));
    }
    cb(null, true);
  },
  public_id: (req, file) => {
    const timestamp = Date.now();
    const originalName = file.originalname.split(".").slice(0, -1).join(".");
    return `${originalName}-${timestamp}`;
  },  
});

export default upload;
