const http = require('http');
const socket = require('socket.io');
const server = http.createServer();
const CONFIG = require('../config');

module.exports = function socketServer() {
  server.listen(CONFIG.socket_port);
  return socket(server);
};
