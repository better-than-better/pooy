const http = require('http');
const socket = require('socket.io');
const CONFIG = require('../config/index');

const requestHandler = require('./request-handler');

module.exports = function () {
  return new Promise((reslove, reject) => {
    const baseServer = http.createServer();

    baseServer.on('request', requestHandler);
    baseServer.on('error', reject);
    baseServer.listen(CONFIG.client_port, () => {
      reslove();
    });

    const io = socket(baseServer);
    const proxy = require('./proxy')(io);

    process.env._PROXY = proxy;

    global.proxy = proxy;

    /**
     * io
     */
    io.on('connection', (client) => {
      client.on('disconnect', () => {
        // console.log('disconnect.');
      });

      client.on('enabled', (enabled) => {
        console.log('enabled', enabled);
        proxy.direct = !enabled;
      });
    });
  });
};
