// Expone las rutas públicas y protegidas del módulo auth.
import { Router } from "express";

import { AuthController } from "./auth.controller";
import { AuthMiddleware } from "./auth.middleware";

const router = Router();
const authController = new AuthController();
const authMiddleware = new AuthMiddleware();

router.post("/register", authController.register.bind(authController));
router.post("/login", authController.login.bind(authController));
router.get("/profile", authMiddleware.verifyToken, authController.profile.bind(authController));

export default router;
