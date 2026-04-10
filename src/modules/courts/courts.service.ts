// Contiene la lógica de negocio del módulo courts.
import mongoose from "mongoose";

import { ApiError } from "../../middlewares/error.middleware";
import { ICourt } from "./courts.model";
import { CourtsRepository } from "./courts.repository";

export class CourtsService {
  constructor(private readonly courtsRepository: CourtsRepository) {}

  public async createCourt(courtData: ICourt) {
    const existingCourt = await this.courtsRepository.findByName(courtData.name);

    if (existingCourt) {
      throw new ApiError("Ya existe una cancha con ese nombre", 409);
    }

    return this.courtsRepository.create(courtData);
  }

  public async getCourts() {
    return this.courtsRepository.findAll();
  }

  public async getCourtById(id: string) {
    this.validateObjectId(id);

    const court = await this.courtsRepository.findById(id);

    if (!court) {
      throw new ApiError("Cancha no encontrada", 404);
    }

    return court;
  }

  public async updateCourt(id: string, courtData: Partial<ICourt>) {
    this.validateObjectId(id);

    if (courtData.name) {
      const existingCourt = await this.courtsRepository.findByName(courtData.name);

      if (existingCourt && existingCourt.id !== id) {
        throw new ApiError("Ya existe una cancha con ese nombre", 409);
      }
    }

    const updatedCourt = await this.courtsRepository.update(id, courtData);

    if (!updatedCourt) {
      throw new ApiError("Cancha no encontrada", 404);
    }

    return updatedCourt;
  }

  public async deleteCourt(id: string) {
    this.validateObjectId(id);

    const deletedCourt = await this.courtsRepository.delete(id);

    if (!deletedCourt) {
      throw new ApiError("Cancha no encontrada", 404);
    }

    return deletedCourt;
  }

  private validateObjectId(id: string): void {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError("El id de la cancha no es valido", 400);
    }
  }
}
