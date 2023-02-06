import express from "express";
import { builds } from "../controllers/index.js";
import sessions from './sessions.js';
const router = express.Router();

// Get all build
router.get("/", builds.getBuilds);
router.get("/sse", builds.getBuildsSendEvents);

// Get a build by ID
router.get("/:id", builds.getBuildById);

// Get a build by ID sessions
router.use("/:id/sessions", sessions);

export default router;
