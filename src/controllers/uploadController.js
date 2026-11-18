import uploadFile from "../services/uploadService.js";
import { ApiError } from "../utills/ApiError.js";

const uploadFileController = async (req, res, next) => {
    try {
       if (!req.file || !req.file.buffer) {
      return res.status(400).json({ status: 400, error: "No file uploaded" });
    }

    const imageUrl = await uploadFile(req.file.buffer, req.file.mimetype);
    res.status(200).json({ status: 200, message: "File uploaded successfully", imageUrl });
    }
    catch (error) {
        next(error instanceof ApiError ? error : new ApiError(500, 'Failed to upload file', error.message));
    }
};

export { uploadFileController };

