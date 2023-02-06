import { Log } from "../models/index.js";
import { logEventEmitter } from "../models/logs.js";

async function getLogs(req, res) {
  try {
    const logs = await Log.findAll();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getLogBySessionId(req, res) {
  try {
    const log = await Log.findBySessionUuid(req.params.id);
    if (log) {
      res.json(log);
    } else {
      res.status(404).json({ error: "Log not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getLogBySessionIdSendEvents = async (req, res) => {
  // Set the Content-Type header
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  const sessionUUID = req.gridSession.id;
  const status = req.gridSession.status;
  if (status === "completed") {
    res.write("event: close\n");
    res.write(`data: data finished\n\n`);
    return res.end();
  }
  const sendCreatedEvent = (log) => {
    if (log.session_id === sessionUUID) {
      res.write("event: created\n");
      res.write(`data: ${JSON.stringify(log)}\n\n`);
    }
  };

  logEventEmitter.on("created", sendCreatedEvent);
  const sendUpdatedEvent = (log) => {
    if (log.session_id === sessionUUID) {
      res.write("event: updated\n");
      res.write(`data: ${JSON.stringify(log)}\n\n`);
    }
  };
  logEventEmitter.on("updated", sendUpdatedEvent);
  // Stop sending updates when the connection is closed
  req.on("close", () => {
    logEventEmitter.off("created", sendCreatedEvent);
    logEventEmitter.off("updated", sendUpdatedEvent);
  });
};
export { getLogs, getLogBySessionId, getLogBySessionIdSendEvents };
