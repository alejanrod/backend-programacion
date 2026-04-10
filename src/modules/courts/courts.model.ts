// Declara los tipos del dominio de canchas.
import { Document, Model } from "mongoose";

export type CourtSurface = "clay" | "hard" | "grass";
export type CourtStatus = "available" | "maintenance";

export interface ICourt {
  name: string;
  surface: CourtSurface;
  status: CourtStatus;
}

export interface ICourtDocument extends ICourt, Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface ICourtModel extends Model<ICourtDocument> {}
