exports.up = function (knex) {
  return knex.schema.createTable("logs_session", (table) => {
    table.increments("id").primary();
    table.integer("session_id").unsigned().notNullable();
    table.string("request_id").unique().notNullable();
    table.string("http_method").notNullable();
    table.string("action").notNullable();
    table.string("message").nullable();
    table.integer("elapsed_time").unsigned().notNullable();
    table.json("payload").nullable();
    table.json("response").nullable();
    table.string("url").notNullable();
    table.enum("status", ["completed", "error", "running"]).notNullable();
    table.foreign("session_id").references("sessions.id").onDelete("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("logs_session");
};
