/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable('organizations', (table) => {
    table.uuid("id").primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.text('slug').unique().notNullable();
    table.text("description");
    table.string("logo_url");
    table.string("github_org_name");
    table.text("github_org_access_token");
    table.uuid("created_by").notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.timestamps(true, true);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists('organizations');
};
