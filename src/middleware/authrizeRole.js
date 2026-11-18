import { ApiError } from "../utills/ApiError.js";

const authorizeRole = (roles) => {
  return (req, res, next) => {
    const { user } = req;

    if (!user || !roles.includes(user.role)) {
      return next(
        new ApiError(
          403,
          "Forbidden: You do not have permission to access this resource"
        )
      );
    }

    next();
  };
};

export default authorizeRole;