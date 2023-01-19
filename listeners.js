import proxyEvent from "./proxy.event.class.js";
import { Log } from "./models/index.js";
import engine from "./utils/ruleEngine.js";
import FileSystemStorage from "./utils/Storage/FileSystemStorage.js";
import axios from "axios";
const { SELENIUM_HUB } = process.env;

function getScreenShot(sessionId) {
  return axios
    .get(`${SELENIUM_HUB}/wd/hub/session/${sessionId}/screenshot`)
    .then(({ data }) => {
      return data;
    });
}
let active = false;
export default function () {
  if (!active) {
    active = true;
    proxyEvent.on("logs", async (args) => {
      try {
        const { request, response, type } = args;
        const request_id = request.requestId;
        const { gridSession: session, method: http_method } = request;
        const {
          started_at,
          id: session_id,
          session_id: selenium_session_id,
        } = session;
        const elapsed_time = Math.round((new Date() - started_at) / 1000) || 0;
        if (type === "request") {
          const log = new Log({
            session_id,
            action: "log",
            elapsed_time,
            payload: request.body,
            url: request.url,
            request_id,
            http_method,
          });
          await log.save();
        } else if (type === "response") {
          const log = await Log.findOne({ session_id, request_id });
          const status = response?.body?.value?.error ? "error" : "completed";
          log.status = status;
          const { events } = await engine.run({ request, response });
          let body = response.body;
          if (selenium_session_id && http_method.toUpperCase() != "DELETE" ) {
            const screenshot = await getScreenShot(selenium_session_id);
            const files = new FileSystemStorage();
            const res = await files.upload(screenshot.value, request_id);
            body = { ...body, screenshot: `images/${request_id}.jpg` };
          }
          log.response = body;
          const message = events[0]?.params.message;
          log.message = message;
          await log.update();
        }
      } catch (error) {
        console.error(error);
      }
    });

    proxyEvent.on("screenshot", async (args) => {
      try {
        const { request, response, type } = args;
        const request_id = request.requestId;
        const { gridSession: session, method: http_method } = request;
        const { started_at, id: session_id } = session;
        const elapsed_time = Math.round((new Date() - started_at) / 1000) || 0;
        // console.log(
        //   "logs",
        //   "listners",
        //   args.type,
        //   args.request.requestId,
        //   response.body
        // );
        if (type === "request") {
          const log = new Log({
            session_id,
            action: "screenshot",
            elapsed_time,
            payload: request.body,
            url: request.url,
            request_id,
            http_method,
          });
          await log.save();
        } else if (type === "response") {
          const log = await Log.findOne({ session_id, request_id });
          const status = response?.body?.value?.error ? "error" : "completed";
          log.status = status;
          const files = new FileSystemStorage();
          const res = await files.upload(response.body.value, request_id);
          log.response = { screenshot: `images/${request_id}.jpg` };
          const { events } = await engine.run({ request, response });
          const message = events[0]?.params.message;
          log.message = message;
          await log.update();
        }
      } catch (error) {
        console.error(error);
      }
    });
  }
}
