import Joi from "joi";
import database from "../config/db.js";

const logSchema = Joi.object().keys({
  id: Joi.number(),
  session_id: Joi.number().integer().positive().required(),
  action: Joi.string().required(),
  // seconds
  elapsed_time: Joi.number().required(),
  url: Joi.string().required(),
  payload: Joi.object(),
  response: Joi.object(),
  status: Joi.string().valid("completed", "error", "running").required(),
  request_id: Joi.string().uuid().required(),
});

class Log {
  constructor(properties) {
    this.id = properties.id;
    this.session_id = properties.session_id;
    this.action = properties.action;
    this.elapsed_time = properties.elapsed_time;
    this.payload = properties.payload;
    this.response = properties.response;
    this.url = properties.url;
    this.status = properties.status || "running";
    this.request_id = properties.request_id;
  }

  static get tableName() {
    return "logs_session";
  }

  static get connection() {
    return database;
  }

  static async findOne(condition = {}) {
    const result = await Log.connection
      .select()
      .from(Log.tableName)
      .where(condition)
      .first();
    return new Log(result);
  }

  static async findBySessionUuid(sessionUuid) {
    const results = await Log.connection
      .select(["logs_session.*", "sessions.session_id"])
      .from(Log.tableName)
      .innerJoin("sessions", "logs_session.session_id", "sessions.id")
      .where({ "sessions.uuid": sessionUuid })
      .orderBy("id","asc");
    return results.map((result) => new Log(result));
  }

  async save() {
    const { error } = logSchema.validate(this);
    if (error) {
      throw new Error(error.details[0].message);
    }
    await Log.connection.insert(this).into(Log.tableName);
    return this;
  }
  async update() {
    const { error } = logSchema.validate(this);
    if (error) {
      throw new Error(error.details[0].message);
    }
    await Log.connection
      .update(this)
      .where({ id: this.id })
      .into(Log.tableName);
    return this;
  }
}

Log.prototype.toJSON = function () {
  delete this.id;
  return this;
};
export default Log;
