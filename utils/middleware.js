import { Session } from "../models/index.js";

const eventsHasToBeEmitted = (events) => (req, _, next) => {
  req.events = events;
  next();
};
const sessionFindByIdMiddleWare = (req, _, next) => {
  Session.findBySessionId(req.params.session_id)
    .then((session) => {
      req.gridSession = session;
      next();
    })
    .catch((err) => {
      next(err);
    });
};
const sessionCreateMiddleWare = async (req, _, next) => {
  const created_at = new Date();
  const capabilities = req.body;
  const session = new Session({ created_at, capabilities });
  session
    .save()
    .then((_) => {
      req.gridSession = session;
      next();
    })
    .catch((err) => {
      next(err);
    });
};

export {
  eventsHasToBeEmitted,
  sessionCreateMiddleWare,
  sessionFindByIdMiddleWare,
};
