import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('authors', (table) => {
    table.string('id').primary().comment('Author ID from Open Library');
    table.string('name').notNullable().index();
    table.string('birth_date').nullable();

    table.integer('work_count').nullable();
    table.float('ratings_average').nullable();
    table.float('ratings_sortable').nullable();
    table.integer('ratings_count').nullable();
    table.integer('ratings_count_1').nullable();
    table.integer('ratings_count_2').nullable();
    table.integer('ratings_count_3').nullable();
    table.integer('ratings_count_4').nullable();
    table.integer('ratings_count_5').nullable();
    table.integer('want_to_read_count').nullable();
    table.integer('already_read_count').nullable();
    table.integer('currently_reading_count').nullable();
    table.integer('readinglog_count').nullable();

    table.bigInteger('version').notNullable().comment('For version tracking');
    table.jsonb('metadata').nullable().comment('Additional author data');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Add indexes
    table.index(['version']);
    table.index(['work_count']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('authors');
}
