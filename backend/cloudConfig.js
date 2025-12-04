import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    console.log("CLOUDINARY PARAMS CALLED:", file.originalname);

    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.]/g, "_");

    return {
      folder: "wanderlust_DEV",
      allowed_formats: ["jpg", "jpeg", "png"],
      public_id: `${Date.now()}-${cleanName}`,
    };
  },
});



export { cloudinary, storage };
