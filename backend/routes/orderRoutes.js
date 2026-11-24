import express from "express";
import { getAll, getById, getByUser, create, updateStatus } from "../controllers/orderController.js";

const router = express.Router();

router.get("/", getAll);
router.get("/user/:userId", getByUser);
router.get("/:id", getById);
router.post("/", create);
router.patch("/:id/status", updateStatus);

export default router;