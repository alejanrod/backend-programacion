// Verifica el JWT y habilita rutas protegidas.
import { NextFunction, Request, Response } from "express";

import { ApiError } from "../../middlewares/error.middleware";
import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";
import { UserRole } from "../users/users.model";

const authService = new AuthService(new AuthRepository());

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

export class AuthMiddleware {
  public verifyToken(req: Request, _res: Response, next: NextFunction): void {
    try {
      const authorizationHeader = req.headers.authorization;

      if (!authorizationHeader) {
        throw new ApiError("No se envio el token de autenticacion", 401);
      }

      const [scheme, token] = authorizationHeader.split(" ");

      if (scheme !== "Bearer" || !token) {
        throw new ApiError("Formato de token invalido", 401);
      }

      const decodedToken = authService.verifyToken(token);
      req.user = decodedToken;

      next();
    } catch (error) {
      next(error);
    }
  }

  public requireRole(allowedRoles: UserRole[]) {
    return (req: Request, _res: Response, next: NextFunction): void => {
      try {
        if (!req.user) {
          throw new ApiError("Usuario no autenticado", 401);
        }

        if (!allowedRoles.includes(req.user.role)) {
          throw new ApiError("No tienes permisos para realizar esta accion", 403);
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }
}
