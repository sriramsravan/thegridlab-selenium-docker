import express from "express";
import { sessions, logs } from "../controllers/index.js";
import { sessionByIdMiddleWare } from "../utils/middleware.js";
const router = express.Router();

// Get all sessions
router.get("/", sessions.getSessions);
router.get("/sse", sessions.getSessionsSendEvents);

// Get a session by ID
router.get("/:id", sessions.getSessionById);

router.get("/:id/logs", logs.getLogBySessionId);
router.get(
  "/:id/logs/sse",
  sessionByIdMiddleWare,
  logs.getLogBySessionIdSendEvents
);

export default router;
