const http = require('http');
const ora = require('ora');
const socket = require('socket.io');
const CONFIG = require('../config/index');

const requestHandler = require('./request-handler');

module.exports = function () {
  return new Promise((reslove, reject) => {
    const spinner = ora('start server...').start();
    const baseServer = http.createServer();

    baseServer.on('request', requestHandler);
    baseServer.on('error', reject);
    baseServer.listen(CONFIG.client_port, () => {
      spinner.stop();
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
        proxy.direct = !enabled;
      });
    });
  });
};
