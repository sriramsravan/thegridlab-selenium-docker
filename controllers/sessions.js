import { Session } from "../models/index.js";
import { sessionEventEmitter } from "../models/sessions.js";

const getSessions = async (req, res) => {
  try {
    const sessions = await Session.findAll();
    res.json(sessions);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getSessionById = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await Session.findById(id);
    if (!session) {
      res.status(404).send("Session not found");
      return;
    }
    res.json(session);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getSessionsSendEvents = async (req, res) => {
  // Set the Content-Type header
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const sendCreatedEvent = (session) => {
    res.write("event: created\n");
    res.write(`data: ${JSON.stringify(session)}\n\n`);
  };
  sessionEventEmitter.on("created", sendCreatedEvent);
  const sendUpdatedEvent = (session) => {
    res.write("event: updated\n");
    res.write(`data: ${JSON.stringify(session)}\n\n`);
  };
  sessionEventEmitter.on("updated", sendUpdatedEvent);
  // Stop sending updates when the connection is closed
  req.on("close", () => {
    sessionEventEmitter.off("created", sendCreatedEvent);
    sessionEventEmitter.off("updated", sendUpdatedEvent);
  });
};
export { getSessionById, getSessions, getSessionsSendEvents };
