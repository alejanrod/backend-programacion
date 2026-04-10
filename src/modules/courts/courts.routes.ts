// Define las rutas HTTP del módulo courts.
import { Router } from "express";

import { AuthMiddleware } from "../auth/auth.middleware";
import { CourtsController } from "./courts.controller";

const router = Router();
const courtsController = new CourtsController();
const authMiddleware = new AuthMiddleware();

router.post(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["admin"]),
  courtsController.create.bind(courtsController)
);
router.get("/", authMiddleware.verifyToken, courtsController.findAll.bind(courtsController));
router.put(
  "/:id",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["admin"]),
  courtsController.update.bind(courtsController)
);
router.delete(
  "/:id",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["admin"]),
  courtsController.delete.bind(courtsController)
);

export default router;
