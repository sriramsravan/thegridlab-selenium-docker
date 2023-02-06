import { Build, Project, Session } from "../models/index.js";
import axios from "axios";

let LICENSE_STATUS = true;

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

const sessionByIdMiddleWare = (req, res, next) => {
  Session.findById(req.params.id)
    .then((session) => {
      if (!session) return res.status(404).json({ message: "Session not found" });
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
  const build_id = req.build.id;
  const session = new Session({ created_at, capabilities, build_id });
  session
    .save()
    .then((_session) => {
      req.gridSession = _session;
      next();
    })
    .catch((err) => {
      next(err);
    });
};

const projectCreateMiddleWare = async (req, _, next) => {
  const capabilities = req.body;
  const projectName = capabilities.desiredCapabilities["gl:project"];

  const project = new Project({ name: projectName });
  project
    .save()
    .then((_project) => {
      req.project = _project;
      next();
    })
    .catch((err) => {
      next(err);
    });
};

const buildCreateMiddleWare = async (req, _, next) => {
  const capabilities = req.body;
  const { id: user_id } = req.user;
  const project_id = req.project.id;
  const buildName = capabilities.desiredCapabilities["gl:build"];

  const build = new Build({ name: buildName, project_id, user_id });
  build
    .save()
    .then((_build) => {
      req.build = _build;
      next();
    })
    .catch((err) => {
      next(err);
    });
};

const licenseCheck = async () => {
  return axios
    .post(`http://localhost:5000/licenses/check`, {
      license: "123456",
    })
    .then(({ data }) => {
      if (data.status === "ok") {
        LICENSE_STATUS = true;
        periodicLicenseCheck(data.check_again_at);
      } else {
        LICENSE_STATUS = false;
        // process.exit(0);
      }
      return data;
    })
    .catch((error) => {
      LICENSE_STATUS = false;
      console.error(error.message);
      // process.exit(1);
      // throw error
    });
};
const periodicLicenseCheck = (seconds) => {
  setTimeout(async () => {
    await licenseCheck().catch((err) => {
      console.error(err);
    });
  }, seconds * 1000);
};

const licenseCheckMiddleWare = (req, res, next) => {
  if (LICENSE_STATUS) {
    next();
  } else {
    res.status(401).json({
      message: "Invalid License.!",
    });
  }
};
export {
  eventsHasToBeEmitted,
  sessionCreateMiddleWare,
  sessionFindByIdMiddleWare,
  sessionByIdMiddleWare,
  buildCreateMiddleWare,
  projectCreateMiddleWare,
  licenseCheckMiddleWare,
  licenseCheck,
};
