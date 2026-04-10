// Declara los tipos del perfil extendido del cliente.
import { Document, Model, Types } from "mongoose";

export interface IProfile {
  userId: Types.ObjectId | string;
  name: string;
  phone: string;
  address: string;
  birthDate: string;
}

export interface IProfileDocument extends IProfile, Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface IProfileModel extends Model<IProfileDocument> {}
