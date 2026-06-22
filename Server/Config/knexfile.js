import dotenv from 'dotenv';
dotenv.config({path : "../.env"});

/** @type { Object.<string, import("knex").Knex.Config> } */
  console.log("DB Connection String:", process.env.DB_PASSWORD);

const config = {
  development: {
    client: 'pg',
    connection: {
      host:     process.env.DB_HOST || 'localhost',
      port:     process.env.DB_PORT || 5432,
      database: process.env.DB_NAME,
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    pool: { min: 2, max: 10 },
    migrations: {
      tableName: 'knex_migrations',
      directory: './Migrations',
    },
    seeds: {
      directory: './Seeds',
    },
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    pool: { min: 2, max: 10 },
    migrations: {
      tableName: 'knex_migrations',
      directory: './Migrations',
    },
  },

};


export default config;