// Centraliza y valida las variables de entorno del proyecto.
import dotenv from "dotenv";

dotenv.config();

const getEnvVariable = (key: string, defaultValue?: string): string => {
  const value = process.env[key] ?? defaultValue;

  if (!value) {
    throw new Error(`La variable de entorno ${key} es obligatoria`);
  }

  return value;
};

export const env = {
  PORT: Number(getEnvVariable("PORT", "3000")),
  MONGODB_URI: getEnvVariable("MONGODB_URI"),
  JWT_SECRET: getEnvVariable("JWT_SECRET"),
  JWT_EXPIRES_IN: getEnvVariable("JWT_EXPIRES_IN", "1d")
};
