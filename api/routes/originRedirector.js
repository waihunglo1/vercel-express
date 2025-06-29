var express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

/**
 * Proxy endpoints for https://whalewisdom.com
 */
const whaleWisdomOptions = {
  target: "https://whalewisdom.com/",
  changeOrigin: true,
  pathRewrite: {
      [`^/portfolios`]: '',
  },
  onProxyRes: function (proxyRes, req, res) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  }
};

/**
 * Proxy endpoints for https://fintel.io
 */
const fintelIoOptions = {
  target: "https://fintel.io/",
  changeOrigin: true,
  pathRewrite: {
      [`^/portfolios`]: '',
  },
  onProxyRes: function (proxyRes, req, res) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  }
};

/**
 * Proxy endpoints for /stockcharts routing
 */
const stockChartsOptions = {
  target: "https://stockcharts.com/",
  changeOrigin: true,
  pathRewrite: {
      [`^/stockcharts`]: '',
  },
  onProxyRes: function (proxyRes, req, res) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  }
};

const stockchartsProxy = createProxyMiddleware(stockChartsOptions);
const proxyWhaleWisdomProxy = createProxyMiddleware(whaleWisdomOptions);
const proxyFintelIoProxy = createProxyMiddleware(fintelIoOptions);

module.exports = {
    proxyWhaleWisdomProxy,
    proxyFintelIoProxy,
    stockchartsProxy
};