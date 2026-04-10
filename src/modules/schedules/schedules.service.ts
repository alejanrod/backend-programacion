// Contiene la lógica de negocio del módulo schedules.
import mongoose from "mongoose";

import { ApiError } from "../../middlewares/error.middleware";
import { CourtsRepository } from "../courts/courts.repository";
import { ISchedule } from "./schedules.model";
import { SchedulesRepository } from "./schedules.repository";

export class SchedulesService {
  constructor(
    private readonly schedulesRepository: SchedulesRepository,
    private readonly courtsRepository: CourtsRepository
  ) {}

  public async createSchedule(scheduleData: ISchedule) {
    this.validateObjectId(String(scheduleData.courtId), "El id de la cancha no es valido");
    this.validateTimeRange(scheduleData.startTime, scheduleData.endTime);

    const court = await this.courtsRepository.findById(String(scheduleData.courtId));

    if (!court) {
      throw new ApiError("Cancha no encontrada", 404);
    }

    const existingSchedule = await this.schedulesRepository.findOneBySlot({
      courtId: String(scheduleData.courtId),
      date: scheduleData.date,
      startTime: scheduleData.startTime,
      endTime: scheduleData.endTime
    });

    if (existingSchedule) {
      throw new ApiError("Ya existe un bloque horario con esa cancha, fecha y horario", 409);
    }

    return this.schedulesRepository.create(scheduleData);
  }

  public async getSchedules(filters: { courtId?: string; date?: string }) {
    const queryFilters: { courtId?: string; date?: string } = {};

    if (filters.courtId) {
      this.validateObjectId(filters.courtId, "El id de la cancha no es valido");
      queryFilters.courtId = filters.courtId;
    }

    if (filters.date) {
      queryFilters.date = filters.date;
    }

    return this.schedulesRepository.findAll(queryFilters);
  }

  public async getAvailableSchedules(filters: { courtId?: string; date?: string }) {
    const queryFilters: { courtId?: string; date?: string; status: "available" } = {
      status: "available"
    };

    if (filters.courtId) {
      this.validateObjectId(filters.courtId, "El id de la cancha no es valido");
      queryFilters.courtId = filters.courtId;
    }

    if (filters.date) {
      queryFilters.date = filters.date;
    }

    return this.schedulesRepository.findAll(queryFilters);
  }

  public async getScheduleById(id: string) {
    this.validateObjectId(id, "El id del horario no es valido");

    const schedule = await this.schedulesRepository.findById(id);

    if (!schedule) {
      throw new ApiError("Bloque horario no encontrado", 404);
    }

    return schedule;
  }

  public async markAsBooked(id: string) {
    const schedule = await this.getScheduleById(id);

    // El horario es la fuente de verdad de disponibilidad del bloque.
    if (schedule.status !== "available") {
      throw new ApiError("El bloque horario no esta disponible para reservar", 409);
    }

    return this.schedulesRepository.update(id, { status: "booked" });
  }

  public async releaseSchedule(id: string) {
    await this.getScheduleById(id);
    // Una reserva cancelada devuelve el bloque a disponible.
    return this.schedulesRepository.update(id, { status: "available" });
  }

  private validateObjectId(id: string, message: string): void {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(message, 400);
    }
  }

  private validateTimeRange(startTime: string, endTime: string): void {
    if (startTime >= endTime) {
      throw new ApiError("La hora de inicio debe ser menor que la hora de fin", 400);
    }
  }
}
