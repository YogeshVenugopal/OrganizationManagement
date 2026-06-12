/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("refresh_token", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.text("provider").notNullable();
    table.text("provider_uid").notNullable();
    table.text("access_token");
    table.text("refresh_token").notNullable();
    table.timestamp("expires_at");
    table.unique(["provider", "provider_uid"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists("refresh_token");
};
