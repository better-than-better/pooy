const server = require('../server');
const chalk = require('chalk');

module.exports = function start(options) {
  if (!process.env.SUDO_USER) {
    console.log('administrator privileges is required, please try ' + chalk.bold.yellow('sudo pooy'));
    return Promise.reject();
  }

  return server();
};
