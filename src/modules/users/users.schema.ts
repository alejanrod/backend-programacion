// Define el esquema Mongoose para la colección users.
import { Schema, model } from "mongoose";

import { IUserDocument, IUserModel } from "./users.model";

const userSchema = new Schema<IUserDocument, IUserModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "client"],
      default: "client"
    },
    password: {
      type: String,
      required: false,
      select: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const UserModel = model<IUserDocument, IUserModel>("User", userSchema);
