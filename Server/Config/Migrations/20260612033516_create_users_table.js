/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    return knex.schema.createTable('users', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.string('name').notNullable();
        table.string('email').unique().notNullable();
        table.string('password');
        table.string('profile_url').defaultTo("");
        table.string('github_username');
        table.string('github_access_token');
        table.enu("role", ["admin", "tl", "user"], {
            useNative: true,
            enumName: "user_role"
        }).notNullable().defaultTo("user");
        
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists('users');
};
