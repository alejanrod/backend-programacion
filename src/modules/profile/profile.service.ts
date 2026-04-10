// Contiene la lógica de negocio del módulo profile.
import mongoose from "mongoose";

import { ApiError } from "../../middlewares/error.middleware";
import { UsersRepository } from "../users/users.repository";
import { IProfile } from "./profile.model";
import { ProfileRepository } from "./profile.repository";

export class ProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly usersRepository: UsersRepository
  ) {}

  public async createProfile(profileData: IProfile) {
    this.validateObjectId(String(profileData.userId), "El id del usuario no es valido");

    const user = await this.usersRepository.findById(String(profileData.userId));

    if (!user) {
      throw new ApiError("Usuario no encontrado", 404);
    }

    const existingProfile = await this.profileRepository.findByUserId(String(profileData.userId));

    if (existingProfile) {
      throw new ApiError("El usuario ya tiene un perfil registrado", 409);
    }

    return this.profileRepository.create(profileData);
  }

  public async getProfiles() {
    return this.profileRepository.findAll();
  }

  public async getProfileById(id: string) {
    this.validateObjectId(id, "El id del perfil no es valido");

    const profile = await this.profileRepository.findById(id);

    if (!profile) {
      throw new ApiError("Perfil no encontrado", 404);
    }

    return profile;
  }

  public async getProfileByUserId(userId: string) {
    this.validateObjectId(userId, "El id del usuario no es valido");

    const profile = await this.profileRepository.findByUserId(userId);

    if (!profile) {
      throw new ApiError("Perfil no encontrado", 404);
    }

    return profile;
  }

  public async updateProfile(id: string, profileData: Partial<IProfile>) {
    this.validateObjectId(id, "El id del perfil no es valido");

    if (profileData.userId) {
      this.validateObjectId(String(profileData.userId), "El id del usuario no es valido");

      const user = await this.usersRepository.findById(String(profileData.userId));

      if (!user) {
        throw new ApiError("Usuario no encontrado", 404);
      }
    }

    const updatedProfile = await this.profileRepository.update(id, profileData);

    if (!updatedProfile) {
      throw new ApiError("Perfil no encontrado", 404);
    }

    return updatedProfile;
  }

  public async deleteProfile(id: string) {
    this.validateObjectId(id, "El id del perfil no es valido");

    const deletedProfile = await this.profileRepository.delete(id);

    if (!deletedProfile) {
      throw new ApiError("Perfil no encontrado", 404);
    }

    return deletedProfile;
  }

  private validateObjectId(id: string, message: string): void {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(message, 400);
    }
  }
}
