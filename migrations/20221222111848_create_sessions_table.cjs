exports.up = async function(knex) {
    await knex.schema.createTable('sessions', (table) => {
      table.increments('id').primary();
      table.string('uuid').unique().notNullable();
      table.string('project').notNullable();
      table.string('application').notNullable();
      table.string('sessionName').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
      table.timestamp('started_at').nullable();
      table.timestamp('ended_at').nullable();
      table.enum('status', ['completed', 'error', 'running', 'pending','timedout']).defaultTo('pending').notNullable();
      table.json('capabilities').nullable();
      table.uuid('session_id').nullable();
    });
  };
  
  exports.down = async function(knex) {
    await knex.schema.dropTable('sessions');
  };
  