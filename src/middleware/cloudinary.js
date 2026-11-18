import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";
import dotenv from "dotenv";

dotenv.config();

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadToCloudinary = async (buffer, mimeType) => {
  try {
    if (!mimeType) {
      throw new Error("Could not determine MIME type.");
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ];

    if (!allowedTypes.includes(mimeType)) {
      throw new Error(`Unsupported file type: ${mimeType}`);
    }

    // Compress image
    const compressedBuffer = await sharp(buffer)
      .webp({ quality: 20 })
      .toBuffer();

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "ecommerce-app-images",
          resource_type: "image",
          format: "webp",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      stream.end(compressedBuffer);
    });

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
};

export default uploadToCloudinary;