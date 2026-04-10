// Recibe las peticiones HTTP y delega la lógica al servicio.
import { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../../shared/types/api-response";
import { CourtsRepository } from "../courts/courts.repository";
import { SchedulesRepository } from "../schedules/schedules.repository";
import { SchedulesService } from "../schedules/schedules.service";
import { UsersRepository } from "../users/users.repository";
import { IBookingDocument } from "./bookings.model";
import { BookingsRepository } from "./bookings.repository";
import { BookingsService } from "./bookings.service";

const bookingsService = new BookingsService(
  new BookingsRepository(),
  new UsersRepository(),
  new CourtsRepository(),
  new SchedulesRepository(),
  new SchedulesService(new SchedulesRepository(), new CourtsRepository())
);

export class BookingsController {
  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const booking = await bookingsService.createBooking({
        ...req.body,
        userId: req.user?.role === "client" ? req.user.userId : req.body.userId
      });
      const response: ApiResponse<IBookingDocument | null> = {
        success: true,
        message: "Reserva creada correctamente",
        data: booking
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  public async findAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const bookings = await bookingsService.getBookings();
      const response: ApiResponse<IBookingDocument[]> = {
        success: true,
        message: "Reservas obtenidas correctamente",
        data: bookings
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  public async findMyBookings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const bookings = await bookingsService.getMyBookings(req.user?.userId as string);
      const response: ApiResponse<IBookingDocument[]> = {
        success: true,
        message: "Reservas del usuario obtenidas correctamente",
        data: bookings
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  public async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const booking = await bookingsService.getBookingById(req.params.id);
      const response: ApiResponse<IBookingDocument> = {
        success: true,
        message: "Reserva obtenida correctamente",
        data: booking
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  public async cancel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const booking = await bookingsService.cancelBooking(req.params.id, {
        userId: req.user?.userId as string,
        role: req.user?.role as "admin" | "client"
      });
      const response: ApiResponse<IBookingDocument | null> = {
        success: true,
        message: "Reserva cancelada correctamente",
        data: booking
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
