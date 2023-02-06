exports.up = async function(knex) {
    await knex.schema.table('sessions', (table) => {
        table.integer('build_id')
          .unsigned()
          .notNullable()
          .references('id')
          .inTable('builds')
          .onDelete('CASCADE');
    });
};

exports.down = async function(knex) {
    await knex.schema.table('sessions', (table) => {
        table.dropForeign('build_id');
        table.dropColumn('build_id');
    });
};
