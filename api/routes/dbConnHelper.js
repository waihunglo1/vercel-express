require('dotenv').config();
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

async function queryDailyStockStats() {
  const txDate = await sql`SELECT max(dt) as date FROM daily_stock_stats`;

  var stats = await sql`SELECT 
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

module.exports = {
    getAivenPgVersion,
    queryDailyStockStats,
    queryDailyStockStatsBySymbol,
    queryDailyMarketStats
};
