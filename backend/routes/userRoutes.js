import express from "express";
import { register, login, getById, update } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/:id", getById);
router.put("/:id", update);

export default router;