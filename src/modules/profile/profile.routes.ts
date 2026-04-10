// Define las rutas HTTP del módulo profile.
import { Router } from "express";

import { AuthMiddleware } from "../auth/auth.middleware";
import { ProfileController } from "./profile.controller";

const router = Router();
const profileController = new ProfileController();
const authMiddleware = new AuthMiddleware();

router.post("/", authMiddleware.verifyToken, profileController.create.bind(profileController));
router.get(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["admin"]),
  profileController.findAll.bind(profileController)
);
router.get("/me", authMiddleware.verifyToken, profileController.findMyProfile.bind(profileController));
router.get(
  "/:id",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["admin"]),
  profileController.findById.bind(profileController)
);
router.put("/:id", authMiddleware.verifyToken, profileController.update.bind(profileController));
router.delete(
  "/:id",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["admin"]),
  profileController.delete.bind(profileController)
);

export default router;
