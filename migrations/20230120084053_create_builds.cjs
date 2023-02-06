exports.up = function (knex) {
  return knex.schema.createTable("builds", (table) => {
    table.increments("id").primary();
    table.string('uuid').unique().notNullable();
    table.string("name").unique().notNullable();
    table.enum('status', ['completed', 'error', 'running','timedout']).defaultTo('running').notNullable();
    table
      .integer("project_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("projects")
      .onDelete("CASCADE");
    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");

    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("builds");
};
