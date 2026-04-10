// Recibe las peticiones HTTP y delega la lógica al servicio.
import { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../../shared/types/api-response";
import { IUserDocument } from "./users.model";
import { UsersRepository } from "./users.repository";
import { UsersService } from "./users.service";

const usersService = new UsersService(new UsersRepository());

export class UsersController {
  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await usersService.createUser(req.body);
      const response: ApiResponse<IUserDocument> = {
        success: true,
        message: "Usuario creado correctamente",
        data: user
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  public async findAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await usersService.getUsers();
      const response: ApiResponse<IUserDocument[]> = {
        success: true,
        message: "Usuarios obtenidos correctamente",
        data: users
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  public async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await usersService.getUserById(req.params.id);
      const response: ApiResponse<IUserDocument> = {
        success: true,
        message: "Usuario obtenido correctamente",
        data: user
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await usersService.updateUser(req.params.id, req.body);
      const response: ApiResponse<IUserDocument> = {
        success: true,
        message: "Usuario actualizado correctamente",
        data: user
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await usersService.deleteUser(req.params.id);
      const response: ApiResponse<IUserDocument> = {
        success: true,
        message: "Usuario eliminado correctamente",
        data: user
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
