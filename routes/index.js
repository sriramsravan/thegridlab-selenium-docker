import express from "express";
import builds from "./builds.js";
import auth from "./auth.js";
import passport from "../utils/passport/index.js";
import sessions from "./sessions.js";
import expressSession from "express-session";
import cookieParser from "cookie-parser";

const router = express.Router();
router.use("/auth", auth);
router.use(expressSession({ secret: "SECRET" }));
router.use(cookieParser());
router.use("/sessions", sessions);
router.use("/builds", passport.authenticate("jwt"), builds);

export default router;
