const server = require('../server');

module.exports = function start(options) {
  return new Promise((reslove, reject) => {
    server();
    reslove();
  });
};
