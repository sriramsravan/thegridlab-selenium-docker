import Joi from "joi";
import uuid from "uuid";
import database from "../config/db.js";
import { EventEmitter } from "events";

const sessionEventEmitter = new EventEmitter();

const sessionSchema = Joi.object({
  id: Joi.number(),
  uuid: Joi.string().uuid().required(),
  created_at: Joi.date().required(),
  ended_at: Joi.date().allow(null),
  started_at: Joi.date().allow(null),
  status: Joi.string()
    .valid("completed", "error", "running", "pending", "timedout")
    .required(),
  capabilities: Joi.object().allow(null),
  session_id: Joi.string().allow(null),
  os: Joi.string(),
  type: Joi.string(),
  browser_name: Joi.string(),
  browser_version: Joi.string(),
  project: Joi.string().required(),
  application: Joi.string().optional(),
  session_name: Joi.string().required(),
  build_id: Joi.number().required(),
});

class Session {
  constructor(properties) {
    this.id = properties.id;
    this.uuid = properties.uuid || uuid.v4();
    this.created_at = properties.created_at || new Date();
    this.started_at = properties.started_at;
    this.ended_at = properties.ended_at;
    this.status = properties.status || "pending";
    this.capabilities = properties.capabilities;
    this.session_id = properties.session_id;
    this.os = properties.os;
    this.type = properties.type;
    this.browser_name = properties.browser_name;
    this.browser_version = properties.browser_version;
    this.project = properties.capabilities.desiredCapabilities["gl:project"];
    this.application =
      properties.capabilities.desiredCapabilities["gl:application"];
    this.session_name =
      properties.capabilities.desiredCapabilities["gl:sessionName"].toString();
    this.build_id = properties.build_id;
  }

  static get tableName() {
    return "sessions";
  }

  static get connection() {
    return database;
  }

  static async findAll(condition = {}) {
    const results = await Session.connection
      .select()
      .from(Session.tableName)
      .where(condition)
      .orderBy("id", "desc");
    return results.map((result) => new Session(result));
  }

  static async findBySessionId(session_id, tries = 1) {
    if (!session_id) throw Error("session_id is mandatory");
    const result = await Session.connection
      .select()
      .from(Session.tableName)
      .where({ session_id })
      .first();
    if (tries >= 5) {
      throw Error("Unable to identify the session. Please try again.");
    }
    if (!result) {
      return Session.findBySessionId(session_id, ++tries);
    }

    return new Session(result);
  }
  static async findById(id) {
    const result = await Session.connection
      .select()
      .from(Session.tableName)
      .where({ uuid: id })
      .first();
    if (!result) return null;
    return new Session(result);
  }

  async save() {
    const { error } = sessionSchema.validate(this);
    if (error) {
      throw new Error(error.details[0].message);
    }
    const result = await Session.connection
      .insert(this, ["id"])
      .into(Session.tableName);
    this.id = result[0].id;
    sessionEventEmitter.emit("created", this);
    return this;
  }
  async update() {
    const { error } = sessionSchema.validate(this);
    if (error) {
      throw new Error(error.details[0].message);
    }
    await Session.connection
      .update(this)
      .where({ id: this.id })
      .into(Session.tableName);
    sessionEventEmitter.emit("updated", this);
    return this;
  }
}

// Session.prototype.toJSON = function () {
//   this.id = this.uuid;
//   return this;
// };
export default Session;
export { sessionEventEmitter };
