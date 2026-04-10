// Define el esquema Mongoose para la colección schedules.
import { Schema, model } from "mongoose";

import { IScheduleDocument, IScheduleModel } from "./schedules.model";

const scheduleSchema = new Schema<IScheduleDocument, IScheduleModel>(
  {
    courtId: {
      type: Schema.Types.ObjectId,
      ref: "Court",
      required: true
    },
    date: {
      type: String,
      required: true,
      trim: true
    },
    startTime: {
      type: String,
      required: true,
      trim: true
    },
    endTime: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      required: true,
      enum: ["available", "booked", "blocked"],
      default: "available"
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

scheduleSchema.index(
  { courtId: 1, date: 1, startTime: 1, endTime: 1 },
  { unique: true }
);

export const ScheduleModel = model<IScheduleDocument, IScheduleModel>("Schedule", scheduleSchema);
