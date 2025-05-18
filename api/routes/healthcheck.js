var express = require('express');
var router = express.Router();
const dbHelper = require('../utils/dbConnHelper.js');
const avienHelper = require('../utils/pg-aiven.js');

/**
 * main function
 */
router.get('/', async function (req, res, next) {
  var version = await dbHelper.getPgVersion();
  var avienVersion = await avienHelper.getPgVersion();

  console.log("Neon Version: ", version);
  console.log("Aiven Version: ", avienVersion);

  var hc = {
    "health": "yes",
    "neonVersion": version,
    "avienVersion": avienVersion
  }

  res.json(hc);
});

module.exports = router;