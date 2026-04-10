// Recibe las peticiones HTTP y delega la lógica al servicio.
import { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../../shared/types/api-response";
import { UsersRepository } from "../users/users.repository";
import { IProfileDocument } from "./profile.model";
import { ProfileRepository } from "./profile.repository";
import { ProfileService } from "./profile.service";

const profileService = new ProfileService(new ProfileRepository(), new UsersRepository());

export class ProfileController {
  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profile = await profileService.createProfile({
        ...req.body,
        userId: req.user?.role === "client" ? req.user.userId : req.body.userId
      });
      const response: ApiResponse<IProfileDocument> = {
        success: true,
        message: "Perfil creado correctamente",
        data: profile
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  public async findAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profiles = await profileService.getProfiles();
      const response: ApiResponse<IProfileDocument[]> = {
        success: true,
        message: "Perfiles obtenidos correctamente",
        data: profiles
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  public async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profile = await profileService.getProfileById(req.params.id);
      const response: ApiResponse<IProfileDocument> = {
        success: true,
        message: "Perfil obtenido correctamente",
        data: profile
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  public async findMyProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profile = await profileService.getProfileByUserId(req.user?.userId as string);
      const response: ApiResponse<IProfileDocument> = {
        success: true,
        message: "Perfil del usuario obtenido correctamente",
        data: profile
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profile = await profileService.updateProfile(req.params.id, {
        ...req.body,
        userId: req.user?.role === "client" ? req.user.userId : req.body.userId
      });
      const response: ApiResponse<IProfileDocument> = {
        success: true,
        message: "Perfil actualizado correctamente",
        data: profile
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profile = await profileService.deleteProfile(req.params.id);
      const response: ApiResponse<IProfileDocument> = {
        success: true,
        message: "Perfil eliminado correctamente",
        data: profile
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
