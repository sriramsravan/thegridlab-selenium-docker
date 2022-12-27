import { Session } from "../models/index.js";

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

export { getSessionById, getSessions };
