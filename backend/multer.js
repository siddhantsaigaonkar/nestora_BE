import multer from "multer";
import { storage } from "./cloudConfig.js";

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    console.log("MULTER FILE RECEIVED:", file);
    cb(null, true);
  },
});

export default upload;
