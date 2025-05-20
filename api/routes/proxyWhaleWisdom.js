var express = require('express');

const { createProxyMiddleware } = require('http-proxy-middleware');
/**
 * Proxy endpoints for https://whalewisdom.com
 */
const options = {
  target: "https://whalewisdom.com/",
  changeOrigin: true,
  pathRewrite: {
      [`^/portfolios`]: '',
  },
  onProxyRes: function (proxyRes, req, res) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  }
};

const proxy = createProxyMiddleware(options);

module.exports = proxy;