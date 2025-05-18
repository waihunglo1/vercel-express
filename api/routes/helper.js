const moment = require('moment');
var fincal = require("fincal");
var XLSX = require("xlsx");
var axios = require('axios').default;
const config = require('./config.js');
axios.defaults.timeout = 1000;


const isEmpty = (str) => {
    if (typeof str == 'undefined' || !str || str.length === 0 || str === "" || !/[^\s]/.test(str) || /^\s*$/.test(str) || str.replace(/\s/g,"") === "")
        return true;
    else
        return false;
}

const determineTargetDateString = (taIndicatorStr) => {
    var days = 25;
    if (taIndicatorStr == "S50DF") {
      days = 80;    
    }
    else if (taIndicatorStr == "VP") {
        days = 150;    
    }
  
    // Calendar class
    var hkCalendar = fincal.calendar("hong_kong");
    var previousTradingDate = hkCalendar.previousTradingDay(moment(), "YYYY-MM-DD");
    var targetDate = moment(previousTradingDate).subtract(days, "days");
    var targetTradingDate = hkCalendar.previousTradingDay(targetDate, "YYYY-MM-DD");
    var formattedTargetTradingDate = targetTradingDate.format("YYYY-MM-DD");

    // console.log(hkCalendar.name); // > "New York"
    // console.log(hkCalendar.locale); // > [Object]
    console.log("date range: " + formatDate(previousTradingDate,"YYYY-MM-DD") + " to " + formattedTargetTradingDate); 

    return {
        startDate: formattedTargetTradingDate,
        endDate:   formatDate(previousTradingDate,"YYYY-MM-DD")
    };
}

const formatDate = (sourceDate, formatStr) => {
    return moment(sourceDate).format(formatStr);
}
  
/**
 * Round half away from zero ('commercial' rounding)
 * Uses correction to offset floating-point inaccuracies.
 * Works symmetrically for positive and negative numbers.
 */
const round = (num, decimalPlaces = 0) => {
    var p = Math.pow(10, decimalPlaces);
    var n = (num * p) * (1 + Number.EPSILON);
    return +Number(Math.round(n) / p).toFixed(2);
}

const isValidIsinCode = (isin_code) => {
    // Regex to check valid
    // ISIN CODE
    let regex = new RegExp(/^[A-Z]{2}[-]{0, 1}[0-9A-Z]{8}[-]{0, 1}[0-9]{1}$/);

    console.log(isin_code + ":" + regex.test(isin_code));
 
    // ISIN CODE
    // is empty return false
    if (isin_code == null) {
        return "false";
    }
 
    // Return true if the isin_code
    // matched the ReGex
    if (regex.test(isin_code) == true) {
        return "true";
    }
    else {
        return "false";
    }
}

const queryExcelView = async () => {
    const excelFileUrl = config.stockListLinkByKey("hkex");

    // read file
    const file = await (await fetch(excelFileUrl)).arrayBuffer();
    console.log("fetched file :" + excelFileUrl + " bytelength:" + file.byteLength); 

    // parse file
    const workbook = XLSX.read(file);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    worksheet['!ref'] = "A4:C99999" // change the sheet range to A2:C3

    var range = XLSX.utils.decode_range(worksheet['!ref']);
    var numRows = range.e.r - range.s.r + 1
    var numCols = range.e.r - range.s.r + 1
    console.log("parsed file :" + excelFileUrl + " rows:" + numRows + " cols:" + numCols);

    // convert to json
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {header:1, blankrows: false}); 
    return reformatData(jsonData);
}

const reformatData = (data) => {
    return data
        .filter(function (item) {
            return item[2] && item[2].length > 0 && item[2].indexOf("Equity") > -1;
        })
        .map(item => {
            return {
                code: reformatSymbolinHK(item[0]),
                name: item[1],
                type: item[2]
            };
        });
}

const reformatSymbolinHK = (symbol) => {
    // remove the last 4 characters
    if (symbol.charAt(0) == '0' && symbol.length > 4) {
        symbol = symbol.substring(1, 5);
    }

    return symbol + ".HK";
}
 
module.exports = {
    determineTargetDateString,
    round,
    isEmpty,
    isValidIsinCode,
    formatDate,
    queryExcelView
};