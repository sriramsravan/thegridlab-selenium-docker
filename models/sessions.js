import Joi from "joi";
import uuid from "uuid";
import database from "../config/db.js";

const sessionSchema = Joi.object({
  id: Joi.number(),
  uuid: Joi.string().uuid().required(),
  created_at: Joi.date().required(),
  ended_at: Joi.date().allow(null),
  started_at: Joi.date().allow(null),
  status: Joi.string()
    .valid("completed", "error", "running", "pending")
    .required(),
  capabilities: Joi.object().allow(null),
  session_id: Joi.string().uuid().allow(null),
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
      .orderBy('id', 'desc');
    return results.map((result) => new Session(result));
  }

  static async findBySessionId(session_id,tries = 1) {
    if(!session_id) throw Error("session_id is mandatory")
    const result = await Session.connection
      .select()
      .from(Session.tableName)
      .where({ session_id })
      .first();
    if(tries >= 3 ){
      throw Error("Unable to identify the session. Please try again.")
    }
    if(!result){ 
      return Session.findBySessionId(session_id,++tries);
    }

    return new Session(result);
  }
  static async findById(id) {
    const result = await Session.connection
      .select()
      .from(Session.tableName)
      .where({ uuid: id })
      .first();
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
    return this;
  }
}

export default Session;
