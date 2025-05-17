var express = require('express');
var router = express.Router();
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

/**
 * main function
 */
router.get('/', async function (req, res, next) {
  var version = await getPgVersion();

  var hc = {
    "health": "yes",
    "version": version
  }

  res.json(hc);
});

module.exports = router;