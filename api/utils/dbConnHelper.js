require('dotenv').config();

const { neon } = require('@neondatabase/serverless');
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
console.log(`Connecting to Neon database at ${PGHOST}...`);

const sql = neon(`postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`);

async function getPgVersion() {
  const result = await sql`SELECT version()`;
  var version = result[0];

  return version;
}

async function insertData(tableName, data) {
  const result = await sql`INSERT INTO ${sql(tableName)} (data) VALUES (${sql(data)})`;
  return result;
}

module.exports = {
    getPgVersion
};