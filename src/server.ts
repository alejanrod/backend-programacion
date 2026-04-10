// Inicia el servidor HTTP luego de conectar la base de datos.
import app from "./app";
import { env } from "./config/env";
import { connectDatabase } from "./config/database";

const startServer = async (): Promise<void> => {
  await connectDatabase();

  app.listen(env.PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${env.PORT}`);
  });
};

startServer().catch((error: unknown) => {
  console.error("Error al iniciar el servidor:", error);
  process.exit(1);
});
