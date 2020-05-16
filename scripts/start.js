const server = require('../server');
const chalk = require('chalk');
const macProxyManager = require('../tools/mac-proxy-manager');
const CONFIG = require('../config');

module.exports = function start(options) {
  if (!process.env.SUDO_USER) {
    console.log('>> administrator privileges is required, please try ' + chalk.bold.yellow('sudo pooy'));
    return Promise.reject();
  }

  if (options.global) {
    process.env.POOY.proxy_global = true;
    macProxyManager.clearWebProxy();
    macProxyManager.setWebProxy('0.0.0.0', CONFIG.proxy_port);
    console.log('\n🚧  global proxy has enabled, see: ' + chalk.bold.yellow('Network -> Advanced -> Proxies'), '\n');
  }

  return server();
};
