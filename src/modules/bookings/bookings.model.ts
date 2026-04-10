// Declara los tipos del dominio de reservas.
import { Document, Model, Types } from "mongoose";

export type BookingStatus = "active" | "cancelled";

export interface IBooking {
  userId: Types.ObjectId | string;
  courtId: Types.ObjectId | string;
  scheduleId: Types.ObjectId | string;
  status: BookingStatus;
}

export interface IBookingDocument extends IBooking, Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface IBookingModel extends Model<IBookingDocument> {}
