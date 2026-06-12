/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable('org_member', (table) => {
    table.uuid("id").primary().notNullable().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid("org_id").notNullable().references("id").inTable("organizations").onDelete("CASCADE");
    table.uuid("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.enum("status", ["accept", "reject", "pending"],{
        useNative: true,
        enumName: "request_status"
    }).notNullable().defaultTo("pending");
    table.text('message');
    table.uuid("reviewed_by").notNullable().references("id").inTable("users");
    table.timestamp("requested_at");
    table.timestamp("reviewed_at");
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists('org_member');
};
