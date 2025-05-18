var express = require('express');
var router = express.Router();
const dbHelper = require('./dbConnHelper.js');
const helper = require('./helper.js');
/**
 * main function
 */
router.get('/', async function (req, res, next) {
  var version = await dbHelper.getNeonPgVersion();
  var avienVersion = await dbHelper.getAivenPgVersion();

  console.log("Neon Version: ", version);
  console.log("Aiven Version: ", avienVersion);

  var hc = {
    "health": "yes",
    "neonVersion": version,
    "avienVersion": avienVersion
  }

  res.json(hc);
});

/**
 * extract stock codes from excel
 */
router.get('/index', function (req, res, next) {
    helper.queryExcelView()
        .then(function (data) {
            res.json(data);
        });
});

module.exports = router;