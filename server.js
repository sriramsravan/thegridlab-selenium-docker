import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import proxyEvent from "./proxy.event.class.js";
import { createProxyMiddleware } from "http-proxy-middleware";
import uuid from "uuid";
import path, { dirname } from "path";

import {
  eventsHasToBeEmitted,
  sessionCreateMiddleWare,
  sessionFindByIdMiddleWare,
  authenticationMiddleWare,
} from "./utils/index.js";
import { capabilities } from "./utils/validators.js";
import router from "./routes/index.js";
import listener from "./listeners.js";
import cors from "cors";
import { licenseCheck, licenseCheckMiddleWare } from "./utils/middleware.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const { SELENIUM_HUB } = process.env;
console.log(__dirname)
listener();
var corsOptions = {
  origin: ["http://localhost:3001", "http://localhost","http://3.109.209.94","http://43.204.238.237"],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const app = express();
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(
  "/images",
  express.static(path.join(__dirname,  "screenshots", "images"))
);
app.use((req, _, next) => {
  req.requestId = uuid.v4();
  next();
});
app.use(licenseCheckMiddleWare);
app.use("/api", router);
app.post(
  "/wd/hub/session",
  authenticationMiddleWare,
  capabilities,
  sessionCreateMiddleWare,
  eventsHasToBeEmitted(["session", "logs"]),
  createProxyMiddleware({
    target: SELENIUM_HUB,
    changeOrigin: true,
    onProxyReq: proxyEvent.request(),
    onProxyRes: proxyEvent.response(async function (req, res) {
      const session_id = res.body.value.sessionId;
      const { browserName, browserVersion, platformName } =
        res.body.value.capabilities;
      req.gridSession.session_id = session_id;
      req.gridSession.os = platformName;
      req.gridSession.type =
        browserName.toLowerCase() === "chrome" ? "browser" : "other";
      req.gridSession.browser_name = browserName;
      req.gridSession.browser_version = browserVersion;
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

app.get(
  "/wd/hub/session/:session_id/screenshot",
  authenticationMiddleWare,
  sessionFindByIdMiddleWare,
  eventsHasToBeEmitted(["screenshot"]),
  createProxyMiddleware({
    target: SELENIUM_HUB,
    changeOrigin: true,
    onProxyReq: proxyEvent.request(),
    onProxyRes: proxyEvent.response(),
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
  res
    .status(400)
    .json({ value: { error: "unknow error", message: error.message } });
}

app.use(errorLogger);
app.use(failSafeHandler);
// licenseCheck().then(()=>{
app.listen(3000, () => {
  console.log("Proxy server listening on port 3000");
});
// })
