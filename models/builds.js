import Joi from "joi";
import uuid from "uuid";
import database from "../config/db.js";
import { EventEmitter } from "events";

const buildEventEmitter = new EventEmitter();

const buildSchema = Joi.object().keys({
  id: Joi.number(),
  name: Joi.string(),
  uuid: Joi.string().uuid().required(),
  status: Joi.string()
    .valid("completed", "error", "running", "timedout")
    .required(),
  user_id: Joi.number().integer().required(),
  project_id: Joi.number().integer().required(),
});

class Build {
  constructor(properties) {
    this.id = properties.id;
    this.uuid = properties.uuid || uuid.v4();
    this.name = properties.name;
    this.status = properties.status || "running";

    this.user_id = properties.user_id;
    this.project_id = properties.project_id;
  }

  static get tableName() {
    return "builds";
  }

  static get connection() {
    return database;
  }

  static async findAll(condition = {}) {
    const results = await Build.connection
      .select()
      .from(Build.tableName)
      .where(condition);
    return results.map((result) => new Build(result));
  }

  static async findById(id) {
    return Build.findOne({ uuid: id });
  }

  static async findOne(condition = {}) {
    const result = await Build.connection
      .select()
      .from(Build.tableName)
      .where(condition)
      .first();
    if (!result) return null;
    return new Build(result);
  }

  async save() {
    const { error } = buildSchema.validate(this);
    if (error) {
      throw new Error(error.details[0].message);
    }
    const build = await Build.findOne({ name: this.name });
    if (build) {
      return build;
    }
    const result = await Build.connection
      .insert(this, ["id"])
      .into(Build.tableName);
    this.id = result[0].id;
    buildEventEmitter.emit("created", this);
    return this;
  }
  async update() {
    const { error } = buildSchema.validate(this);
    if (error) {
      throw new Error(error.details[0].message);
    }
    await Build.connection
      .update(this)
      .where({ id: this.id })
      .into(Build.tableName);
    buildEventEmitter.emit("updated", this);
    return this;
  }
  async delete() {
    return await Build.connection
      .delete()
      .from(Build.tableName)
      .where({ id: this.id });
  }
}

export default Build;
export { buildEventEmitter };
