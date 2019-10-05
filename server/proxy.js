const Pooy = require('pooy-core');
const rules = require('./proxy-rules');
const proxy = new Pooy();
const PORT = 9009;

module.exports = function(io) {
  proxy.on('request', async (ctx) => {
    io.emit('request', {
      id: ctx.id,
      method: ctx.method,
      protocol: ctx.protocol,
      host: ctx.host,
      path: ctx.path,
      headers: ctx.headers,
      httpVersion: ctx.clientRequest.httpVersion,
      time: ctx.time
    });  
  });
  
  proxy.on('requestEnd', async (ctx) => {
    io.emit('requestEnd', {
      id: ctx.id,
      body: (await ctx.getLocalReqBodyData()).toString(),
    });  
  });
  
  // proxy.on('response', (ctx) => {
  //   io.emit('response', {
  //     id: ctx.id,
  //     headers: ctx.headers,
  //     body: ctx.body,
  //     statusCode: ctx.statusCode,
  //     time: ctx.time,
  //     remote: ctx.remoteResponse.connection.remoteAddress
  //   });  
  // });

  proxy.on('response', (ctx) => {
    ctx.setHeader('proxy-agent', 'pooy@0.0.1-alpha1');
  });
  
  proxy.on('responseEnd', (ctx) => {
    io.emit('responseEnd', {
      id: ctx.id,
      headers: ctx.headers,
      body: ctx.body,
      statusCode: ctx.statusCode,
      time: ctx.time,
      remote: ctx.remoteResponse.connection.remoteAddress
    });  
  });
  
  proxy.on('error', (err, ctx) => {
    // console.log('error', err.message);
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

  proxy.useRules(rules);
  
  proxy.listen(PORT);

  return proxy;
};
