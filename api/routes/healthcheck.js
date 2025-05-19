var express = require('express');
var router = express.Router();
const dbHelper = require('./dbConnHelper.js');
const helper = require('./helper.js');
const yahooutils = require('./yahoo-utils.js');
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
  const chunkSize = 25;

    helper.queryExcelView()
        .then(async function (data) {
            // splice and request data from stockcharts
            while (data.length > 0) {
                var chunk = data.splice(0, chunkSize);
                var codes = chunk.map(function (item) {
                  return item.code
                });
                yahooutils.queryMultipleStockTechIndicator(codes, "M12")
                    .then(function (result) {
                        console.log("result length: " + result.length);
                        console.log(result);
                    });

                // wait for 1 second before next request
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        });

    res.json("ok");
});

module.exports = router;