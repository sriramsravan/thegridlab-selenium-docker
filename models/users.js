import Joi from "joi";
import database from "../config/db.js";
import crypto from "crypto";

const userSchema = Joi.object().keys({
  id: Joi.number(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().optional(),
  username: Joi.string().optional(),
  phone: Joi.string().optional(),
  is_active: Joi.boolean().optional(),
  reset_password_expires: Joi.date(),
  reset_password_token: Joi.string(),
  access_key: Joi.string().required(),
});

const generateUsername = async (email) => {
  let username = email.substring(0, email.indexOf("@"));
  username = username.toLowerCase().replace(/ /g, "_");
  let suffix = 0;
  let unique = false;
  while (!unique) {
    const user = await User.findOne({ username });
    if (!user) {
      unique = true;
    } else {
      suffix++;
      username = `${username}${suffix}`;
    }
  }
  return username;
};

class User {
  constructor(properties) {
    this.id = properties.id;
    this.name = properties.name;
    this.email = properties.email;
    this.username = properties.username;
    this.password = properties.password;
    this.phone = properties.phone;
    this.reset_password_token = properties.reset_password_token;
    this.reset_password_expires = properties.reset_password_expires;
    this.access_key =
      properties.access_key || crypto.randomBytes(16).toString("hex");
    this.is_active = properties.is_active;
  }

  static get tableName() {
    return "users";
  }

  static get connection() {
    return database;
  }

  static async findOne(condition = {}) {
    const result = await User.connection
      .select()
      .from(User.tableName)
      .where(condition)
      .first();
    if (!result) return null;
    return new User(result);
  }

  async save() {
    if (!this.username) this.username = await generateUsername(this.email);
    const { error } = userSchema.validate(this);
    if (error) {
      throw new Error(error.details[0].message);
    }
    const result = await User.connection
      .insert(this, ["id"])
      .into(User.tableName);
    this.id = result[0].id;
    return this;
  }
  async update() {
    const { error } = userSchema.validate(this);
    if (error) {
      throw new Error(error.details[0].message);
    }
    await User.connection
      .update(this)
      .where({ id: this.id })
      .into(User.tableName);
    return this;
  }
}

export default User;
