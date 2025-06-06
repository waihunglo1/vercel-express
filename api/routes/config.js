const yaml = require('js-yaml');
const fs   = require('fs');
const path = require('path');

var doc = new Object();

// Get document, or throw exception on error
try {
  var ymlPath = path.join(__dirname, '..', '..', 'config', 'setup.yml')
  console.log("yml path: " + ymlPath);
  doc = yaml.load(fs.readFileSync(ymlPath, 'utf8'));
  
} catch (e) {
  console.log(e);
}

const read = () => {
    return doc;
}

const breadthByKey = (key) => {
  var breadth = null;
  doc.indexes.forEach(element => {
    if(key.includes(element.name)) {
      breadth = element.breadth;
    }
    });
  return breadth;  
}

const tradingViewExchangeByKey = (key) => {
  var exchange = null;
  doc.exchanges.forEach(element => {
    if(key.includes(element.name)) {
      exchange = element.tradingView;
    }
    });
  return exchange;  
}

const tradingViewCodeByKey = (key) => {
  var tradingViewCode = null;
  doc.indexes.forEach(element => {
    if(key.includes(element.name)) {
      tradingViewCode = element.tradingViewCode;
    }
    });
  return tradingViewCode;  
}

const stockCodeByKey = (key) => {
  var stockCode = null;
  doc.indexes.forEach(element => {
    if(key.includes(element.name)) {
      stockCode = element.stockCode;
    }
    });
  return stockCode;  
}

const retrievePortfolios = () => {
  return doc.portfolios;
}

const stockListLinkByKey = (key) => {
  var link = null;
  doc.stockList.forEach(element => {
    if(key.includes(element.name)) {
      link = element.link;
    }
    });
  return link;  
}

module.exports = {
    read,
    breadthByKey,
    tradingViewExchangeByKey,
    tradingViewCodeByKey,
    stockCodeByKey,
    retrievePortfolios,
    stockListLinkByKey
  };