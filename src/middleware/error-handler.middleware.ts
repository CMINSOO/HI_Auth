import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ValidationError } from "class-validator";

export const errorHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (Array.isArray(err) && err[0] instanceof ValidationError) {
    const formattedErrors = err.map((error) =>
      Object.values(error.constraints || {}).join(", ")
    );

    res.status(400).json({
      message: "Validation failed",
      errors: formattedErrors,
    });
    return;
  }

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
};
