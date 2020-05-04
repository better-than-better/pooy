const Pooy = require('pooy-core');
const rules = require('./proxy-rules');
const socketServer = require('./socket-server');
const { getIps, getProxyRulesStatus } = require('./utils');
const CONFIG = require('../config');
const { IPv4 } = getIps();


module.exports = function proxyServer() {
  return new Promise((resolve, reject) => {
    const io = socketServer();
    const proxy = new Pooy();

    proxy.on('request', async (ctx) => {
      io.emit('request', {
        id: ctx.id,
        method: ctx.method,
        protocol: ctx.protocol,
        host: ctx.host,
        path: ctx.path,
        headers: ctx.headers,
        httpVersion: ctx.clientRequest.httpVersion,
        time: ctx.time,
        timing: ctx.timing
      });  
    });
  
    proxy.on('requestEnd', async (ctx) => {
      io.emit('requestEnd', {
        id: ctx.id,
        timing: ctx.timing,
        body: (await ctx.getLocalReqBodyData()).toString(),
      });  
    });

    proxy.on('response', (ctx) => {
      io.emit('response', {
        id: ctx.id,
        headers: ctx.headers,
        body: ctx.body,
        statusCode: ctx.statusCode,
        time: ctx.time,
        timing: ctx.timing,
        remote: ctx.remoteResponse.connection.remoteAddress
      });
    });
    
    proxy.on('responseEnd', (ctx) => {
      io.emit('responseEnd', {
        id: ctx.id,
        headers: ctx.headers,
        body: ctx.body,
        statusCode: ctx.statusCode,
        time: ctx.time,
        timing: ctx.timing,
        remote: ctx.remoteResponse.connection.remoteAddress
      });
    });
    
    proxy.on('error', (err, ctx) => {
      io.emit('responseEnd', {
        id: ctx.id,
        headers: ctx.headers,
        body: ctx.body,
        statusCode: ctx.statusCode,
        time: ctx.time,
        error: {
          ...err,
          message: err.message
        }
      });  
    });

    getProxyRulesStatus() && proxy.useRules(rules());
    
    proxy.listen(CONFIG.proxy_port, resolve);

    proxy.ignore([
      `${IPv4}:${CONFIG.client_port}`,
      `${IPv4}:${CONFIG.socket_port}`,
      `127.0.0.1:${CONFIG.client_port}`,
      `0.0.0.0:${CONFIG.client_port}`
    ]);

    io.on('connection', (client) => {
      client.on('disconnect', () => {
        // console.log('disconnect.');
      });

      client.on('enabled', (enabled) => {
        proxy.direct = !enabled;
      });
    });

    global.proxy = proxy;
  })
};
