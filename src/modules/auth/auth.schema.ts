// Valida de forma sencilla los datos de entrada del módulo auth.
import { ApiError } from "../../middlewares/error.middleware";
import { LoginInput, RegisterInput } from "./auth.model";

export class AuthSchema {
  public validateRegisterPayload(payload: Partial<RegisterInput>): void {
    if (!payload.name || !payload.email || !payload.password) {
      throw new ApiError("Todos los campos son obligatorios para el registro", 400);
    }

    if (payload.password.length < 6) {
      throw new ApiError("La contrasena debe tener al menos 6 caracteres", 400);
    }

    if (payload.role && !["admin", "client"].includes(payload.role)) {
      throw new ApiError("El rol enviado no es valido", 400);
    }
  }

  public validateLoginPayload(payload: Partial<LoginInput>): void {
    if (!payload.email || !payload.password) {
      throw new ApiError("Email y contrasena son obligatorios", 400);
    }
  }
}
