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
    symbol, short_name, dt, sector, industry, sctr, close, 
    0 as delta, sma10turnover, volume as vol 
    FROM daily_stock_stats WHERE symbol = ${stock.symbol}`;

  stats.forEach(stat => {
    // stock.symbol = stat.symbol;
    stock.name = stat.short_name;
    stock.date = stat.dt;
    stock.sector = stat.sector;
    stock.industry = stat.industry;
    stock.sctr = stat.sctr;
    // stock.close = stat.close;
    stock.delta = stat.delta;
    stock.sma10turnover = stat.sma10turnover;
    // stock.vol = stat.vol;
  });
}

async function queryDailyStockStats() {
  const txDate = await sql`SELECT max(dt) as date FROM daily_stock_stats`;

  var stats = await sql`SELECT 
    symbol, short_name, dt, sector, industry, sctr, close, 
    0 as delta, sma10turnover, volume as vol 
    FROM daily_stock_stats`;

  const result = [txDate[0]]; 

  stats.forEach(stat => {
    result.push({
      symbol: stat.symbol,
      name: stat.short_name,
      date: stat.date,
      sector: stat.sector,
      industry: stat.industry,
      SCTR: stat.sctr,
      close: stat.close,
      delta: stat.delta,
      sma10turnover: stat.sma10turnover,
      vol: stat.vol
    });
  });

  return result;
}

module.exports = {
    getAivenPgVersion,
    queryDailyStockStats,
    queryDailyStockStatsBySymbol
};
