import { ApiError } from "../../utils/ApiError.util.js";

const notFoundHandler = (req, _res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
};

const errorHandler = (err, _req, res, _next) => {
  const statusCode = err?.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err?.message || "Internal server error",
    errors: err?.errors || [],
  });
};

export { notFoundHandler, errorHandler };
