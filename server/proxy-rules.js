const { getIps } = require('./utils');
const PROXY_PORT = 9009;
const CLIENT_PORT = 9001;

module.exports = [{
  test: (ctx) => {
    return ctx.hostname === 'ca.pooy';
  },
  request: {
    pathname: '/ssl',
    host: `${getIps().IPv4}:${PROXY_PORT}`
  }
}, {
  test: (ctx) => {
    return ctx.hostname === 'cli.pooy';
  },
  request: {
    host: `${getIps().IPv4}:${CLIENT_PORT}`
  }
}];