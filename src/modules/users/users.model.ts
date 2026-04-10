// Declara los tipos del dominio de usuarios.
import { Document, Model } from "mongoose";

export type UserRole = "admin" | "client";

export interface IUser {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
}

export interface IUserDocument extends IUser, Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserModel extends Model<IUserDocument> {}
