import Joi from "joi";
import database from "../config/db.js";

const projectSchema = Joi.object().keys({
  id: Joi.number(),
  name: Joi.string().required(),
});

class Project {
  constructor(properties) {
    this.id = properties.id;
    this.name = properties.name;
  }

  static get tableName() {
    return "projects";
  }

  static get connection() {
    return database;
  }

  static async findAll(condition = {}) {
    const results = await Project.connection
      .select()
      .from(Project.tableName)
      .where(condition);
    return results.map((result) => new Project(result));
  }

  static async findOne(condition = {}) {
    const result = await Project.connection
      .select()
      .from(Project.tableName)
      .where(condition)
      .first();
    if (!result) throw Error("unable to fetch project");
    return new Project(result);
  }

  async save() {
    const { error } = projectSchema.validate(this);
    if (error) {
      throw new Error(error.details[0].message);
    }
    try {
      const project = await Project.findOne({ name: this.name });
      return project;
    } catch (error) {
      const result = await Project.connection
        .insert(this, ["id"])
        .into(Project.tableName);
      this.id = result[0].id;
      return this;
    }
  }
  async update() {
    const { error } = projectSchema.validate(this);
    if (error) {
      throw new Error(error.details[0].message);
    }
    await Project.connection
      .update(this)
      .where({ id: this.id })
      .into(Project.tableName);
    return this;
  }
  async delete() {
    return await Project.connection
      .delete()
      .from(Project.tableName)
      .where({ id: this.id });
  }
}

export default Project;
