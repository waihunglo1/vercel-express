var express = require('express');
var router = express.Router();
const helper = require('./helper.js');
const yahooutils = require('./yahoo-utils.js');
const storage = require('../storage.js');

/**
 * main function
 */
router.get('/taIndicator', function (req, res, next) {
  // Extract the specific config for this current execution context
  const activeConfig = storage.local.getStore();
  if (!activeConfig || !activeConfig.sql) {
    return res.status(500).json({ error: "Database context not initialized" });
  }

  const cgo = req.query.cgo;
  var stockCodes = [];
  if (!helper.isEmpty(cgo)) {
    stockCodes = cgo.split("|")[0].split(",");
    var taIndicatorStr = cgo.split("|")[1];

    if(helper.isEmpty(taIndicatorStr)) {
      taIndicatorStr = "M12";
    }

    yahooutils.queryMultipleStockTechIndicator(stockCodes, taIndicatorStr, activeConfig)
      .then(function (stocks) {
        res.json(stocks);
      });    
  }
});

/**
 * quote summary function
 */
router.get('/summary', function (req, res, next) {
  const cgo = req.query.cgo;
  var stockCodes = [];
  if (!helper.isEmpty(cgo)) {
    stockCodes = cgo.split("|")[0].split(",");

    yahooutils.queryMultipleStockQuote(stockCodes)
      .then(function (stocks) {
        res.json(stocks);
      });    
  }
});

module.exports = router;
