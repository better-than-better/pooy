const http = require('http');
const socket = require('socket.io');
const PORT = 9000;

const requestHandler = require('./request-handler');

const baseServer = http.createServer();


baseServer.on('request', requestHandler);
baseServer.listen(PORT);

const io = socket(baseServer);
const proxy = require('./proxy')(io);

process.env._PROXY = proxy;

global.proxy = proxy;

console.log('proxy enabled:', !proxy.direct);


/**
 * io
 */
io.on('connection', (client) => {
  client.on('disconnect', () => {
    console.log('disconnect.');
  });

  client.on('enabled', (enabled) => {
    console.log('enabled', enabled);
    proxy.direct = enabled;
  });
});
