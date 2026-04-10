// Atiende peticiones HTTP del módulo auth.
import { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../../shared/types/api-response";
import { AuthRepository } from "./auth.repository";
import { AuthResponse } from "./auth.model";
import { AuthService } from "./auth.service";

const authService = new AuthService(new AuthRepository());

export class AuthController {
  public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.register(req.body);
      const response: ApiResponse<AuthResponse> = {
        success: true,
        message: "Registro exitoso",
        data: result
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(req.body);
      const response: ApiResponse<AuthResponse> = {
        success: true,
        message: "Login exitoso",
        data: result
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  public async profile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      const profile = await authService.getProfile(userId as string);
      const response: ApiResponse<typeof profile> = {
        success: true,
        message: "Perfil obtenido correctamente",
        data: profile
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
