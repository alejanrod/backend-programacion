// Encapsula el acceso directo a la base de datos para reservas.
import { BookingModel } from "./bookings.schema";
import { IBooking } from "./bookings.model";

export class BookingsRepository {
  public async create(bookingData: IBooking) {
    return BookingModel.create(bookingData);
  }

  public async findAll() {
    return BookingModel.find()
      .populate("userId", "name email role")
      .populate("courtId")
      .populate("scheduleId");
  }

  public async findById(id: string) {
    return BookingModel.findById(id)
      .populate("userId", "name email role")
      .populate("courtId")
      .populate("scheduleId");
  }

  public async findByUserId(userId: string) {
    return BookingModel.find({ userId })
      .populate("userId", "name email role")
      .populate("courtId")
      .populate("scheduleId");
  }

  public async findByScheduleId(scheduleId: string) {
    return BookingModel.findOne({ scheduleId });
  }

  public async update(id: string, bookingData: Partial<IBooking>) {
    return BookingModel.findByIdAndUpdate(id, bookingData, {
      new: true,
      runValidators: true
    })
      .populate("userId", "name email role")
      .populate("courtId")
      .populate("scheduleId");
  }
}
