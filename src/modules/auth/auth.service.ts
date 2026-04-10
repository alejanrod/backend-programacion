// Implementa la lógica de registro, login y validación de tokens.
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { env } from "../../config/env";
import { ApiError } from "../../middlewares/error.middleware";
import { AuthResponse, LoginInput, RegisterInput } from "./auth.model";
import { AuthRepository } from "./auth.repository";
import { AuthSchema } from "./auth.schema";

export class AuthService {
  private readonly authSchema = new AuthSchema();

  constructor(private readonly authRepository: AuthRepository) {}

  public async register(payload: RegisterInput): Promise<AuthResponse> {
    this.authSchema.validateRegisterPayload(payload);

    const existingUser = await this.authRepository.findUserByEmail(payload.email);

    if (existingUser) {
      throw new ApiError("El email ya esta registrado", 409);
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const user = await this.authRepository.createUser({
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      role: payload.role ?? "client"
    });

    const token = this.generateToken(user.id, user.email, user.role);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }

  public async login(payload: LoginInput): Promise<AuthResponse> {
    this.authSchema.validateLoginPayload(payload);

    const user = await this.authRepository.findUserByEmail(payload.email);

    if (!user || !user.password) {
      throw new ApiError("Credenciales incorrectas", 401);
    }

    const isPasswordValid = await bcrypt.compare(payload.password, user.password);

    if (!isPasswordValid) {
      throw new ApiError("Credenciales incorrectas", 401);
    }

    const token = this.generateToken(user.id, user.email, user.role);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }

  public async getProfile(userId: string) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new ApiError("El id del usuario no es valido", 400);
    }

    const user = await this.authRepository.findUserById(userId);

    if (!user) {
      throw new ApiError("Usuario no encontrado", 404);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  }

  public verifyToken(token: string): { userId: string; email: string; role: "admin" | "client" } {
    try {
      return jwt.verify(token, env.JWT_SECRET) as { userId: string; email: string; role: "admin" | "client" };
    } catch {
      throw new ApiError("Token invalido o expirado", 401);
    }
  }

  private generateToken(userId: string, email: string, role: "admin" | "client"): string {
    return jwt.sign({ userId, email, role }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"]
    });
  }
}
