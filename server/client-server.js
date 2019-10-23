const http = require('http');
const server = http.createServer('http');
const requestHandler = require('./request-handler');
const CONFIG = require('../config');

module.exports = function clientServer() {
  return new Promise((resolve, reject) => {
    server.on('request', requestHandler);
    server.listen(CONFIG.client_port, resolve);
  });
}