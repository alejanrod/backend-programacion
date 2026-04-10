// Recibe las peticiones HTTP y delega la lógica al servicio.
import { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../../shared/types/api-response";
import { ICourtDocument } from "./courts.model";
import { CourtsRepository } from "./courts.repository";
import { CourtsService } from "./courts.service";

const courtsService = new CourtsService(new CourtsRepository());

export class CourtsController {
  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const court = await courtsService.createCourt(req.body);
      const response: ApiResponse<ICourtDocument> = {
        success: true,
        message: "Cancha creada correctamente",
        data: court
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  public async findAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const courts = await courtsService.getCourts();
      const response: ApiResponse<ICourtDocument[]> = {
        success: true,
        message: "Canchas obtenidas correctamente",
        data: courts
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const court = await courtsService.updateCourt(req.params.id, req.body);
      const response: ApiResponse<ICourtDocument> = {
        success: true,
        message: "Cancha actualizada correctamente",
        data: court
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const court = await courtsService.deleteCourt(req.params.id);
      const response: ApiResponse<ICourtDocument> = {
        success: true,
        message: "Cancha eliminada correctamente",
        data: court
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
