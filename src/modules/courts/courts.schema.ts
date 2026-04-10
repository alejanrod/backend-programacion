// Define el esquema Mongoose para la colección courts.
import { Schema, model } from "mongoose";

import { ICourtDocument, ICourtModel } from "./courts.model";

const courtSchema = new Schema<ICourtDocument, ICourtModel>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    surface: {
      type: String,
      required: true,
      enum: ["clay", "hard", "grass"]
    },
    status: {
      type: String,
      required: true,
      enum: ["available", "maintenance"],
      default: "available"
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const CourtModel = model<ICourtDocument, ICourtModel>("Court", courtSchema);
