// Encapsula el acceso directo a la base de datos para perfiles.
import { IProfile } from "./profile.model";
import { ProfileModel } from "./profile.schema";

export class ProfileRepository {
  public async create(profileData: IProfile) {
    return ProfileModel.create(profileData);
  }

  public async findAll() {
    return ProfileModel.find().populate("userId", "name email role");
  }

  public async findById(id: string) {
    return ProfileModel.findById(id).populate("userId", "name email role");
  }

  public async findByUserId(userId: string) {
    return ProfileModel.findOne({ userId }).populate("userId", "name email role");
  }

  public async update(id: string, profileData: Partial<IProfile>) {
    return ProfileModel.findByIdAndUpdate(id, profileData, {
      new: true,
      runValidators: true
    }).populate("userId", "name email role");
  }

  public async delete(id: string) {
    return ProfileModel.findByIdAndDelete(id).populate("userId", "name email role");
  }
}
