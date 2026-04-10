// Recibe las peticiones HTTP y delega la lógica al servicio.
import { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../../shared/types/api-response";
import { CourtsRepository } from "../courts/courts.repository";
import { IScheduleDocument } from "./schedules.model";
import { SchedulesRepository } from "./schedules.repository";
import { SchedulesService } from "./schedules.service";

const schedulesService = new SchedulesService(new SchedulesRepository(), new CourtsRepository());

export class SchedulesController {
  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const schedule = await schedulesService.createSchedule(req.body);
      const response: ApiResponse<IScheduleDocument> = {
        success: true,
        message: "Bloque horario creado correctamente",
        data: schedule
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  public async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const schedules = await schedulesService.getSchedules({
        courtId: req.query.courtId as string | undefined,
        date: req.query.date as string | undefined
      });
      const response: ApiResponse<IScheduleDocument[]> = {
        success: true,
        message: "Bloques horarios obtenidos correctamente",
        data: schedules
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  public async findAvailable(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const schedules = await schedulesService.getAvailableSchedules({
        courtId: req.query.courtId as string | undefined,
        date: req.query.date as string | undefined
      });
      const response: ApiResponse<IScheduleDocument[]> = {
        success: true,
        message: "Bloques disponibles obtenidos correctamente",
        data: schedules
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
