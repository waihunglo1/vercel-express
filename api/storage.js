require('dotenv').config();

const { AsyncLocalStorage } = require('async_hooks');
const local = new AsyncLocalStorage();
const postgres = require('postgres');

const { AVIEN_DB_USER, AVIEN_DB_PASSWORD, AVIEN_DB_HOST, AVIEN_DB_PORT, AVIEN_DB_DATABASE_HK, AVIEN_DB_DATABASE_US} = process.env;
const hkSql = postgres(`postgres://${AVIEN_DB_USER}:${AVIEN_DB_PASSWORD}@${AVIEN_DB_HOST}:${AVIEN_DB_PORT}/${AVIEN_DB_DATABASE_HK}?sslmode=require`, {
  idle_timeout: 20,
  max_lifetime: 60 * 30
});

const usSql = postgres(`postgres://${AVIEN_DB_USER}:${AVIEN_DB_PASSWORD}@${AVIEN_DB_HOST}:${AVIEN_DB_PORT}/${AVIEN_DB_DATABASE_US}?sslmode=require`, {
  idle_timeout: 20,
  max_lifetime: 60 * 30
});

// db config
const dbConfigs = {
  us: { sql: usSql },
  hk: { sql: hkSql }
};

// Export using CommonJS syntax
module.exports = { 
    local, 
    dbConfigs 
};