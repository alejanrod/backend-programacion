// Define el esquema Mongoose para la colección bookings.
import { Schema, model } from "mongoose";

import { IBookingDocument, IBookingModel } from "./bookings.model";

const bookingSchema = new Schema<IBookingDocument, IBookingModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    courtId: {
      type: Schema.Types.ObjectId,
      ref: "Court",
      required: true
    },
    scheduleId: {
      type: Schema.Types.ObjectId,
      ref: "Schedule",
      required: true,
      unique: true
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "cancelled"],
      default: "active"
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const BookingModel = model<IBookingDocument, IBookingModel>("Booking", bookingSchema);
