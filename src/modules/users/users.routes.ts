// Define las rutas HTTP del módulo users.
import { Router } from "express";

import { AuthMiddleware } from "../auth/auth.middleware";
import { UsersController } from "./users.controller";

const router = Router();
const usersController = new UsersController();
const authMiddleware = new AuthMiddleware();

router.post(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["admin"]),
  usersController.create.bind(usersController)
);
router.get(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["admin"]),
  usersController.findAll.bind(usersController)
);
router.get(
  "/:id",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["admin"]),
  usersController.findById.bind(usersController)
);
router.put(
  "/:id",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["admin"]),
  usersController.update.bind(usersController)
);
router.delete(
  "/:id",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["admin"]),
  usersController.delete.bind(usersController)
);

export default router;
