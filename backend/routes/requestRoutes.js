import express from "express";

import { getAll, getById, create, updateStatus } from "../controllers/requestController.js";

const router = express.Router();

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", create);
router.patch("/:id/status", updateStatus);

export default router;