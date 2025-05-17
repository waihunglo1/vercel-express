var express = require('express');

const { createProxyMiddleware } = require('http-proxy-middleware');
/**
 * Proxy endpoints for /stockcharts routing
 */
const options = {
  target: "https://stockcharts.com/",
  changeOrigin: true,
  pathRewrite: {
      [`^/stockcharts`]: '',
  },
  onProxyRes: function (proxyRes, req, res) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  }
};

const stockchartsProxy = createProxyMiddleware(options);

module.exports = stockchartsProxy;