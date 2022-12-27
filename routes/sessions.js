import express from "express";
import { sessions,logs } from "../controllers/index.js";
const router = express.Router();

// Get all sessions
router.get("/", sessions.getSessions);

// Get a session by ID
router.get("/:id", sessions.getSessionById);

router.get("/:id/logs", logs.getLogBySessionId);

export default router;
