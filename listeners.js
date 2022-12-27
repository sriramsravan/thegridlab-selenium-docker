import proxyEvent from "./proxy.event.class.js";
import { Log } from "./models/index.js";
let active = false;
export default function () {
  if (!active) {
    proxyEvent.on("logs", async (args) => {
      const { request, response, type } = args;
      const request_id = request.requestId;
      const { gridSession: session } = request;
      const { started_at, id: session_id } = session;
      const elapsed_time = Math.round((new Date() - started_at) / 1000) || 0;
      console.log(
        "logs",
        "listners",
        args.type,
        args.request.requestId,
        response.body
      );
      if (type === "request") {
        const log = new Log({
          session_id,
          action: "log",
          elapsed_time,
          payload: request.body,
          url: request.url,
          request_id,
        });
        await log.save();
      } else if (type === "response") {
        const log = await Log.findOne({ session_id, request_id });
        const status = response?.body?.value?.error ? "error" : "completed";
        log.status = status;
        log.response = response.body;
        await log.update();
      }
    });

    proxyEvent.on("session", (args) => {
      // update the status of the session.
      console.log("session", "listners", args.type, args.request.requestId);
    });
    proxyEvent.on("sessionCreated", (args) => {
      console.log(
        "sessionCreated",
        "listners",
        args.type,
        args.request.requestId
      );
    });
  }
}
