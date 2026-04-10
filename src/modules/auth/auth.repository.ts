// Gestiona el acceso a datos necesario para autenticación.
import { UserModel } from "../users/users.schema";

export class AuthRepository {
  public async findUserByEmail(email: string) {
    return UserModel.findOne({ email });
  }

  public async findUserById(id: string) {
    return UserModel.findById(id);
  }

  public async createUser(userData: {
    name: string;
    email: string;
    password: string;
    role: "admin" | "client";
  }) {
    return UserModel.create(userData);
  }
}
