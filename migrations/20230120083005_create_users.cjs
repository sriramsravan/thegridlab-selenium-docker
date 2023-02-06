exports.up = function(knex) {
    return knex.schema.createTable('users', table => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').notNullable().unique();
      table.string('username').notNullable().unique();
      table.string('password').notNullable();
      table.string('phone').nullable();
      table.string('address').nullable();
      table.string('access_key').notNullable();
      table.datetime('reset_password_expires').nullable();
      table.string('reset_password_token').nullable();
      table.boolean('is_active').defaultTo(true);
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('users');
  };
  