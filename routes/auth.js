import express from "express";
import { auth } from "../controllers/index.js";
const router = express.Router();

router.post("/register", auth.register);

router.post("/login", auth.login);
router.get("/logout", auth.logout);

router.post("/reset-password", auth.resetPassword);

router.post("/new-password", auth.setPassword);

export default router;
