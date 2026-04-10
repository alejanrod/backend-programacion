// Encapsula el acceso directo a la base de datos para usuarios.
import { IUser } from "./users.model";
import { UserModel } from "./users.schema";

export class UsersRepository {
  public async create(userData: IUser) {
    return UserModel.create(userData);
  }

  public async findAll() {
    return UserModel.find();
  }

  public async findById(id: string) {
    return UserModel.findById(id);
  }

  public async findByEmail(email: string) {
    return UserModel.findOne({ email }).select("+password");
  }

  public async update(id: string, userData: Partial<IUser>) {
    return UserModel.findByIdAndUpdate(id, userData, {
      new: true,
      runValidators: true
    });
  }

  public async delete(id: string) {
    return UserModel.findByIdAndDelete(id);
  }
}
