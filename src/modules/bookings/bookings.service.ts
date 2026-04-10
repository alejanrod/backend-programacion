// Contiene la lógica de negocio del módulo bookings.
import mongoose from "mongoose";

import { ApiError } from "../../middlewares/error.middleware";
import { CourtsRepository } from "../courts/courts.repository";
import { SchedulesRepository } from "../schedules/schedules.repository";
import { SchedulesService } from "../schedules/schedules.service";
import { UsersRepository } from "../users/users.repository";
import { IBooking } from "./bookings.model";
import { BookingsRepository } from "./bookings.repository";

export class BookingsService {
  constructor(
    private readonly bookingsRepository: BookingsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly courtsRepository: CourtsRepository,
    private readonly schedulesRepository: SchedulesRepository,
    private readonly schedulesService: SchedulesService
  ) {}

  public async createBooking(bookingData: IBooking) {
    this.validateObjectId(String(bookingData.userId), "El id del usuario no es valido");
    this.validateObjectId(String(bookingData.courtId), "El id de la cancha no es valido");
    this.validateObjectId(String(bookingData.scheduleId), "El id del horario no es valido");

    const [user, court, schedule, existingBooking] = await Promise.all([
      this.usersRepository.findById(String(bookingData.userId)),
      this.courtsRepository.findById(String(bookingData.courtId)),
      this.schedulesRepository.findById(String(bookingData.scheduleId)),
      this.bookingsRepository.findByScheduleId(String(bookingData.scheduleId))
    ]);

    if (!user) {
      throw new ApiError("Usuario no encontrado", 404);
    }

    if (!court) {
      throw new ApiError("Cancha no encontrada", 404);
    }

    if (!schedule) {
      throw new ApiError("Bloque horario no encontrado", 404);
    }

    if (this.extractId(schedule.courtId) !== String(bookingData.courtId)) {
      throw new ApiError("El bloque horario no pertenece a la cancha enviada", 400);
    }

    // Booking representa la ocupación del bloque; Schedule conserva su disponibilidad.
    if (existingBooking && existingBooking.status === "active") {
      throw new ApiError("Ese bloque horario ya fue reservado", 409);
    }

    if (schedule.status !== "available") {
      throw new ApiError("El bloque horario no esta disponible para reservar", 409);
    }

    const booking = await this.bookingsRepository.create({
      ...bookingData,
      status: "active"
    });

    // Toda reserva activa bloquea el horario asociado.
    await this.schedulesService.markAsBooked(String(bookingData.scheduleId));

    return this.bookingsRepository.findById(String(booking._id));
  }

  public async getBookings() {
    return this.bookingsRepository.findAll();
  }

  public async getMyBookings(userId: string) {
    this.validateObjectId(userId, "El id del usuario no es valido");
    return this.bookingsRepository.findByUserId(userId);
  }

  public async getBookingById(id: string) {
    this.validateObjectId(id, "El id de la reserva no es valido");

    const booking = await this.bookingsRepository.findById(id);

    if (!booking) {
      throw new ApiError("Reserva no encontrada", 404);
    }

    return booking;
  }

  public async cancelBooking(id: string, requester: { userId: string; role: "admin" | "client" }) {
    const booking = await this.getBookingById(id);

    if (requester.role === "client" && this.extractId(booking.userId) !== requester.userId) {
      throw new ApiError("No tienes permisos para cancelar esta reserva", 403);
    }

    if (booking.status === "cancelled") {
      throw new ApiError("La reserva ya fue cancelada", 409);
    }

    const updatedBooking = await this.bookingsRepository.update(id, { status: "cancelled" });
    // Toda cancelación libera nuevamente el bloque horario.
    await this.schedulesService.releaseSchedule(this.extractId(booking.scheduleId));

    return updatedBooking;
  }

  private validateObjectId(id: string, message: string): void {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(message, 400);
    }
  }

  private extractId(value: unknown): string {
    if (value && typeof value === "object" && "_id" in value) {
      return String((value as { _id: unknown })._id);
    }

    return String(value);
  }
}
