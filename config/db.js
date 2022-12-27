import knex from "knex";
import knexConfig from "./knex.js";
function connection() {
  const environment = process.env.NODE_ENV || "development";
  return knex(knexConfig[environment]);
}
const db = connection() 
export default db;
