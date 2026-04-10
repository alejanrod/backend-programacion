// Define las rutas HTTP del módulo schedules.
import { Router } from "express";

import { AuthMiddleware } from "../auth/auth.middleware";
import { SchedulesController } from "./schedules.controller";

const router = Router();
const schedulesController = new SchedulesController();
const authMiddleware = new AuthMiddleware();

router.post(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["admin"]),
  schedulesController.create.bind(schedulesController)
);
router.get("/", authMiddleware.verifyToken, schedulesController.findAll.bind(schedulesController));
router.get("/available", authMiddleware.verifyToken, schedulesController.findAvailable.bind(schedulesController));

export default router;
