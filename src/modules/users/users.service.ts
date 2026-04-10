// Contiene la lógica de negocio del módulo users.
import mongoose from "mongoose";

import { ApiError } from "../../middlewares/error.middleware";
import { IUser } from "./users.model";
import { UsersRepository } from "./users.repository";

export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async createUser(userData: IUser) {
    const existingUser = await this.usersRepository.findByEmail(userData.email);

    if (existingUser) {
      throw new ApiError("El email ya esta registrado", 409);
    }

    return this.usersRepository.create(userData);
  }

  public async getUsers() {
    return this.usersRepository.findAll();
  }

  public async getUserById(id: string) {
    this.validateObjectId(id);

    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new ApiError("Usuario no encontrado", 404);
    }

    return user;
  }

  public async updateUser(id: string, userData: Partial<IUser>) {
    this.validateObjectId(id);

    if (userData.email) {
      const existingUser = await this.usersRepository.findByEmail(userData.email);

      if (existingUser && existingUser.id !== id) {
        throw new ApiError("El email ya esta registrado", 409);
      }
    }

    const updatedUser = await this.usersRepository.update(id, userData);

    if (!updatedUser) {
      throw new ApiError("Usuario no encontrado", 404);
    }

    return updatedUser;
  }

  public async deleteUser(id: string) {
    this.validateObjectId(id);

    const deletedUser = await this.usersRepository.delete(id);

    if (!deletedUser) {
      throw new ApiError("Usuario no encontrado", 404);
    }

    return deletedUser;
  }

  private validateObjectId(id: string): void {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError("El id del usuario no es valido", 400);
    }
  }
}
