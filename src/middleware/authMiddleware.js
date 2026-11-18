import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ApiError } from "../utills/ApiError.js";
dotenv.config();


const authMiddleware = (req, res, next) => {
    if (!process.env.JWT_SECRET) {
        return next(new ApiError(500, "JWT secret is not configured"));
    }
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer ")) {
        return next(new ApiError(401, "Authorization header missing or invalid"));
    }
   const token = authorization.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }   
catch (error) {
        next(new ApiError(401, "Invalid token", error.message));
    }
};

export default authMiddleware;

