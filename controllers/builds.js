import { Build } from "../models/index.js";
import { buildEventEmitter } from "../models/builds.js";

const getBuilds = async (req, res) => {
  try {
    const builds = await Build.findAll();
    res.json(builds);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getBuildById = async (req, res) => {
  try {
    const { id } = req.params;
    const build = await Build.findById(id);
    if (!build) {
      res.status(404).send("Build not found");
      return;
    }
    res.json(build);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getBuildsSendEvents = async (req, res) => {
  // Set the Content-Type header
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const sendCreatedEvent = (build) => {
    res.write("event: created\n");
    res.write(`data: ${JSON.stringify(build)}\n\n`);
  };
  buildEventEmitter.on("created", sendCreatedEvent);
  const sendUpdatedEvent = (build) => {
    res.write("event: updated\n");
    res.write(`data: ${JSON.stringify(build)}\n\n`);
  };
  buildEventEmitter.on("updated", sendUpdatedEvent);
  // Stop sending updates when the connection is closed
  req.on("close", () => {
    buildEventEmitter.off("created", sendCreatedEvent);
    buildEventEmitter.off("updated", sendUpdatedEvent);
  });
};
export { getBuildById, getBuilds, getBuildsSendEvents };
