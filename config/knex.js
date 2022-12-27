import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

export default {
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 5432,
    },
    migrations: {
      directory: "../migrations",
    },
  },
  production: {
    client: "pg",
    connection: {
      host: process.env.PROD_DB_HOST,
      database: process.env.PROD_DB_NAME,
      user: process.env.PROD_DB_USER,
      port: process.env.DB_PORT || 5432,
      password: process.env.PROD_DB_PASSWORD,
    },
    migrations: {
      directory: "../migrations",
    },
  },
  staging: {
    client: "pg",
    connection: {
      host: process.env.STAGING_DB_HOST,
      database: process.env.STAGING_DB_NAME,
      user: process.env.STAGING_DB_USER,
      port: process.env.DB_PORT || 5432,
      password: process.env.STAGING_DB_PASSWORD,
    },
    migrations: {
      directory: "../migrations",
    },
  },
};
