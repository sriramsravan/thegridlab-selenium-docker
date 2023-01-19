import { Session } from "../models/index.js";
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

const sessionByIdMiddleWare = (req, _, next) => {
  Session.findById(req.params.id)
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
      console.error(error.message)
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
  licenseCheckMiddleWare,
  licenseCheck
};
