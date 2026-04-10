// Define las rutas HTTP del módulo bookings.
import { Router } from "express";

import { AuthMiddleware } from "../auth/auth.middleware";
import { BookingsController } from "./bookings.controller";

const router = Router();
const bookingsController = new BookingsController();
const authMiddleware = new AuthMiddleware();

router.post(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["admin", "client"]),
  bookingsController.create.bind(bookingsController)
);
router.get(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["admin"]),
  bookingsController.findAll.bind(bookingsController)
);
router.get(
  "/my-bookings",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["admin", "client"]),
  bookingsController.findMyBookings.bind(bookingsController)
);
router.get(
  "/:id",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["admin"]),
  bookingsController.findById.bind(bookingsController)
);
router.put(
  "/:id/cancel",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["admin", "client"]),
  bookingsController.cancel.bind(bookingsController)
);

export default router;
