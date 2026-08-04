var express = require('express');
var router = express.Router();
const dbHelper = require('./dbConnHelper.js');
const helper = require('./helper.js');
const yahooutils = require('./yahoo-utils.js');
const storage = require('../storage.js');

/**
 * main function
 */
router.get('/', async function (req, res, next) {
  // Extract the specific config for this current execution context
  const activeConfig = storage.local.getStore();
  if (!activeConfig || !activeConfig.sql) {
    return res.status(500).json({ error: "Database context not initialized" });
  }

  var avienVersion = await dbHelper.getAivenPgVersion(activeConfig);
  console.log("Aiven Version: ", avienVersion);

  var hc = {
    "health": "yes",
    "avienVersion": avienVersion
  }

  res.json(hc);
});

module.exports = router;