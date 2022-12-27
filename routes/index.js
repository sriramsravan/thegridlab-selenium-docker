import express from "express";
import sessions from "./sessions.js";

const router = express.Router();
router.use("/sessions", sessions);

export default router;
