// Maneja de forma global los errores de la aplicación.
import { NextFunction, Request, Response } from "express";

export class ApiError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if ((error as ApiError).statusCode) {
    const apiError = error as ApiError;

    res.status(apiError.statusCode).json({
      success: false,
      message: apiError.message
    });
    return;
  }

  if ("code" in error && (error as { code?: number }).code === 11000) {
    res.status(409).json({
      success: false,
      message: "El recurso ya existe en la base de datos"
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: "Error interno del servidor"
  });
};
