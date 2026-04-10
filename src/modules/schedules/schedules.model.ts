// Declara los tipos del dominio de horarios de cancha.
import { Document, Model, Types } from "mongoose";

export type ScheduleStatus = "available" | "booked" | "blocked";

export interface ISchedule {
  courtId: Types.ObjectId | string;
  date: string;
  startTime: string;
  endTime: string;
  status: ScheduleStatus;
}

export interface IScheduleDocument extends ISchedule, Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface IScheduleModel extends Model<IScheduleDocument> {}
