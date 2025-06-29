var express = require('express');
var bodyParser = require('body-parser')

// local modules
const helper = require('./helper.js');
const config = require('./config.js');
const stockcharts = require('./stockcharts-utils.js')
const dbHelper = require('./dbConnHelper.js');
var router = express.Router();
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

/**
 * main function
 */
router.get('/', function (req, res, next) {
    const cgo = req.query.cgo;
    var stockCodes = [];
    var taIndicatorStr = "M12";
    if (!helper.isEmpty(cgo)) {
      stockCodes = cgo.split("|")[0].split(",");
      taIndicatorStr = cgo.split("|")[1];

      stockcharts.queryStockChartsDataScan(stockCodes, taIndicatorStr)
        .then(function (row) {
          res.json(row);
        });      
    }   
  });

/**
 * sctr function
 */
router.get('/sctr/us', function (req, res, next) {
  const view = req.query.view;
  if (!helper.isEmpty(view)) {
    stockcharts.simpleSctr(view)
      .then(function (row) {
        res.json(row);
      });
  }   
});

/**
 * sctr function
 */
router.get('/sctr/hk', function (req, res, next) {
  const view = req.query.view;
  if (!helper.isEmpty(view)) {
    dbHelper.queryDailyStockStats()
      .then(function (row) {
        res.json(row);
      });
  }   
});

/**
 * market breadth statistics function
 */
router.get('/mm/hk', function (req, res, next) {
  dbHelper.queryDailyMarketStats()
    .then(function (row) {
      res.json(row);
    });
});

/**
 * store portfolio function
 */
router.post('/pp/store', jsonParser, function (req, res, next) {
  const portfolioData = req.body;
  console.log('Received data:', portfolioData);

  if( !portfolioData || !portfolioData.symbols || !portfolioData.remark || !portfolioData.chartType) {
    return res.status(400).json({ error: 'Invalid portfolio data' });
  } 

  dbHelper.storePortfolioData(portfolioData)
    .then(function (result) {
      res.json(result);
    });
});

/**
 * list portfolio function
 */
router.get('/pp/list', function (req, res, next) {
  dbHelper.queryPortfolioData()
    .then(function (row) {
      res.json(row);
    });
});

/**
 * delete portfolio function
 */
router.delete('/pp/delete', function (req, res, next) {
  const portfolioId = req.query.id;

  if (!portfolioId) {
    return res.status(400).json({ error: 'Portfolio ID is required' });
  }

  dbHelper.deletePortfolioData(portfolioId)
    .then(function (result) {
      res.json(result);
    });
});

module.exports = router;