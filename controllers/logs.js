import {Log} from "../models/index.js";

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

export {
  getLogs,
  getLogBySessionId,
};
