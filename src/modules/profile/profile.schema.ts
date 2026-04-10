// Define datos ampliados del cliente sin duplicar acceso ni credenciales.
import { Schema, model } from "mongoose";

import { IProfileDocument, IProfileModel } from "./profile.model";

const profileSchema = new Schema<IProfileDocument, IProfileModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    birthDate: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const ProfileModel = model<IProfileDocument, IProfileModel>("Profile", profileSchema);
