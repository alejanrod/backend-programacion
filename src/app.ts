// Configura la aplicación Express y registra middlewares y rutas.
import express from "express";
import cors from "cors";

import authRoutes from "./modules/auth/auth.routes";
import bookingsRoutes from "./modules/bookings/bookings.routes";
import courtsRoutes from "./modules/courts/courts.routes";
import profileRoutes from "./modules/profile/profile.routes";
import schedulesRoutes from "./modules/schedules/schedules.routes";
import usersRoutes from "./modules/users/users.routes";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Servidor funcionando correctamente"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/courts", courtsRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/schedules", schedulesRoutes);
app.use("/api/users", usersRoutes);

app.use(errorMiddleware);

export default app;
