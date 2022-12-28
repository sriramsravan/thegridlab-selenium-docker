import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import proxyEvent from "./proxy.event.class.js";
import { createProxyMiddleware } from "http-proxy-middleware";
import uuid from "uuid";
import {
  eventsHasToBeEmitted,
  sessionCreateMiddleWare,
  sessionFindByIdMiddleWare,
  authenticationMiddleWare,
} from "./utils/index.js";

import router from "./routes/index.js";
import listener from "./listeners.js";

const { SELENIUM_HUB } = process.env;
listener();
const app = express();
app.use(bodyParser.json());
app.use((req, _, next) => {
  req.requestId = uuid.v4();
  next();
});

app.use("/api", router);
app.post(
  "/wd/hub/session",
  authenticationMiddleWare,
  sessionCreateMiddleWare,
  eventsHasToBeEmitted(["session", "logs"]),
  createProxyMiddleware({
    target: SELENIUM_HUB,
    changeOrigin: true,
    onProxyReq: proxyEvent.request(),
    onProxyRes: proxyEvent.response(async function (req, res) {
      const session_id = res.body.value.sessionId;
      req.gridSession.session_id = session_id;
      req.gridSession.status = "running";
      req.gridSession.started_at = new Date();
      await req.gridSession.update();
    }),
  })
);

app.delete(
  "/wd/hub/session/:session_id",
  authenticationMiddleWare,
  sessionFindByIdMiddleWare,
  eventsHasToBeEmitted(["session", "logs"]),
  createProxyMiddleware({
    target: SELENIUM_HUB,
    changeOrigin: true,
    onProxyReq: proxyEvent.request(),
    onProxyRes: proxyEvent.response(async function (req, res) {
      if (res.body && res.body.value && res.body.value.error) {
        req.gridSession.status = "error";
      } else {
        req.gridSession.status = "completed";
      }
      req.gridSession.ended_at = new Date();
      await req.gridSession.update();
    }),
  })
);

app.all(
  "/wd/hub/session/:session_id/*",
  authenticationMiddleWare,
  sessionFindByIdMiddleWare,
  eventsHasToBeEmitted(["logs"]),
  createProxyMiddleware({
    target: SELENIUM_HUB,
    changeOrigin: true,
    onProxyReq: proxyEvent.request(),
    onProxyRes: proxyEvent.response(),
  })
);

function errorLogger(error, req, res, next) {
  // for logging errors
  console.error(error); // or using any fancy logging library
  next(error); // forward to next middleware
}

function failSafeHandler(error, req, res, next) {
  // generic handler
  res.status(500).json({ value: { error : error.message } });
}

app.use(errorLogger);
app.use(failSafeHandler);
app.listen(3000, () => {
  console.log("Proxy server listening on port 3000");
});
