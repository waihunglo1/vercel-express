require('dotenv').config();
const helper = require('./helper.js');
const postgres = require('postgres');
const { AVIEN_DB_USER, AVIEN_DB_PASSWORD, AVIEN_DB_HOST, AVIEN_DB_PORT, AVIEN_DB_DATABASE } = process.env;
const sql = postgres(`postgres://${AVIEN_DB_USER}:${AVIEN_DB_PASSWORD}@${AVIEN_DB_HOST}:${AVIEN_DB_PORT}/${AVIEN_DB_DATABASE}?sslmode=require`, {
  idle_timeout: 20,
  max_lifetime: 60 * 30
});

async function getAivenPgVersion() {
  const result = await sql`SELECT version()`;
  var version = result[0];
  return version;
}

async function queryDailyStockStatsBySymbol(stock) {
    const index = stock.symbol.search(/.HK$/);
    if(index < 0) {
        return;
    }

  var stats = await sql`SELECT 
    symbol, short_name, dt, sector, industry, sctr1, close, 
    0 as delta, sma10turnover, volume as vol 
    FROM daily_stock_stats WHERE symbol = ${stock.symbol}`;

  stats.forEach(stat => {
    // stock.symbol = stat.symbol;
    stock.name = stat.short_name;
    stock.date = stat.dt;
    stock.sector = stat.sector;
    stock.industry = stat.industry;
    stock.sctr = stat.sctr1;
    // stock.close = stat.close;
    stock.delta = stat.delta;
    stock.sma10turnover = stat.sma10turnover;
    // stock.vol = stat.vol;
  });
}

async function queryDailyStockStats(view) {
  const txDate = await sql`SELECT max(dt) as date FROM daily_stock_stats`;
  var stats = null;

  if(helper.isEmpty(view) || view == 'default') {
    stats = await sql`SELECT 
        symbol, short_name, dt, sector, industry, 
        sctr1, sctr2, sctr3, sctr4, sctr5, 
        sctr6, sctr7, sctr8, sctr9, sctr10,
        sctr11, sctr12, sctr13, sctr14, sctr15,
        sctr16, sctr17, sctr18, sctr19, sctr20,
        close, sctr1 - sctr2 as delta, sma10turnover, volume as vol 
        FROM daily_stock_stats
        WHERE sctr1 >= (select sctr1 from daily_stock_stats where symbol = '2800.HK')
        and sma10turnover >= 20000000
        `;
  } else if (view == 'sma') {
    stats = await sql`SELECT
        symbol, short_name, dt, sector, industry,
        sctr1, sctr2, sctr3, sctr4, sctr5,
        sctr6, sctr7, sctr8, sctr9, sctr10,
        sctr11, sctr12, sctr13, sctr14, sctr15,
        sctr16, sctr17, sctr18, sctr19, sctr20,
        close, sctr1 - sctr2 as delta, sma10turnover, volume as vol
        FROM daily_stock_stats
        WHERE sma10turnover >= 20000000
        and above_20d_sma > 0 
        and above_50d_sma > 0 
        and above_150d_sma > 0
        `;
  } else if (view == 'vol') {
    stats = await sql`SELECT
        symbol, short_name, dt, sector, industry,
        sctr1, sctr2, sctr3, sctr4, sctr5,
        sctr6, sctr7, sctr8, sctr9, sctr10,
        sctr11, sctr12, sctr13, sctr14, sctr15,
        sctr16, sctr17, sctr18, sctr19, sctr20,
        close, sctr1 - sctr2 as delta, sma10turnover, volume as vol
        FROM daily_stock_stats
        WHERE volume * close > sma10turnover 
        and sma10turnover > 0 
        and volume * close / sma10turnover > 2
        and volume * close  >= 5000000
        `;
  }

  const result = [txDate[0]]; 

  stats.forEach(stat => {
    result.push({
      symbol: stat.symbol,
      name: stat.short_name,
      date: stat.date,
      sector: stat.sector,
      industry: stat.industry,
      SCTR: stat.sctr1,
      SCTR1: stat.sctr1,
      SCTR2: stat.sctr2,
      SCTR3: stat.sctr3,
      SCTR4: stat.sctr4,
      SCTR5: stat.sctr5,
      SCTR6: stat.sctr6,
      SCTR7: stat.sctr7,
      SCTR8: stat.sctr8,
      SCTR9: stat.sctr9,
      SCTR10: stat.sctr10,
      SCTR11: stat.sctr11,
      SCTR12: stat.sctr12,
      SCTR13: stat.sctr13,
      SCTR14: stat.sctr14,
      SCTR15: stat.sctr15,
      SCTR16: stat.sctr16,
      SCTR17: stat.sctr17,
      SCTR18: stat.sctr18,
      SCTR19: stat.sctr19,
      SCTR20: stat.sctr20,
      close: stat.close,
      delta: stat.delta,
      sma10turnover: stat.sma10turnover,
      vol: stat.vol
    });
  });

  return result;
}

/**
 * Query daily market statistics
 * @returns 
 */
async function queryDailyMarketStats() {
  var stats = await sql`
    SELECT 
    * from 
    DAILY_MARKET_STATS
    order by dt desc
    `;

  const result = [];
  stats.forEach(stat => {
    result.push({
      date: stat.dt,
      up4pct1d: stat.up4pct1d,
      dn4pct1d: stat.dn4pct1d,
      up25pctin100d: stat.up25pctin100d,
      dn25pctin100d: stat.dn25pctin100d,
      up25pctin20d: stat.up25pctin20d,
      dn25pctin20d: stat.dn25pctin20d,
      up50pctin20d: stat.up50pctin20d,
      dn50pctin20d: stat.dn50pctin20d,
      noofstocks: stat.noofstocks,
      above200smapct: stat.above200smapct,
      above150smapct: stat.above150smapct,
      above20smapct: stat.above20smapct,
      hsi: stat.hsi,
      hsce: stat.hsce
    });
  });

  return result;
}

/**
 * Query portfolio data
 * @returns 
 */
async function queryPortfolioData() {
  var ppList = await sql`
    SELECT 
    * from 
    PORTFOLIO_DATA
    order by dt desc
    `;

  const result = [];
  ppList.forEach(stat => {
    result.push({
      id: stat.id,
      date: stat.dt,
      symbols: stat.symbols,
      remark: stat.remark,
      chartType: stat.chart_type
    });
  });

  return result;
}

async function storePortfolioData(portfolioData) {
  const existingData = await sql`
    SELECT count(1) FROM PORTFOLIO_DATA
    WHERE symbols = ${portfolioData.symbols}
  `;

  if (existingData[0].count > 0) {
    // If data exists, update it
    const result = await sql`
      UPDATE PORTFOLIO_DATA
      SET remark = ${portfolioData.remark}
      WHERE symbols = ${portfolioData.symbols}
      RETURNING *
    `;
    return result[0];
  }

  const result = await sql`
    INSERT INTO PORTFOLIO_DATA (symbols, remark, chart_type)
    VALUES (${portfolioData.symbols}, ${portfolioData.remark}, ${portfolioData.chartType})
    RETURNING *
  `;
  return result[0];
} 

async function deletePortfolioData(portfolioId) {
  const result = await sql`
    DELETE FROM PORTFOLIO_DATA
    WHERE id = ${portfolioId}
    RETURNING *
  `;
  return result[0];
} 

module.exports = {
    getAivenPgVersion,
    queryDailyStockStats,
    queryDailyStockStatsBySymbol,
    queryDailyMarketStats,
    queryPortfolioData,
    storePortfolioData,
    deletePortfolioData
};
