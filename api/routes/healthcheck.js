var express = require('express');
var router = express.Router();
const dbHelper = require('./dbConnHelper.js');
const helper = require('./helper.js');
const yahooutils = require('./yahoo-utils.js');
/**
 * main function
 */
router.get('/', async function (req, res, next) {
  var avienVersion = await dbHelper.getAivenPgVersion();
  console.log("Aiven Version: ", avienVersion);

  var hc = {
    "health": "yes",
    "avienVersion": avienVersion
  }

  res.json(hc);
});

module.exports = router;