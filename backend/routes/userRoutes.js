import express from "express";
import { getUsers, getUserByToken } from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:token", getUserByToken);

export default router;