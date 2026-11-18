import { uploadFileController } from "../controllers/uploadController.js";
import multer from "multer";
import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRole from "../middleware/authrizeRole.js";

const router = Router();

//Multer middleware for handling file uploads

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

router.post("/upload", authMiddleware, authorizeRole(['admin']), upload.single("image"), uploadFileController);


export default router;