const clientServer = require('./client-server');
const proxyServer = require('./proxy-server');

module.exports = function server() {
  return new Promise((resolve, reject) => {
    Promise.all([
      clientServer(),
      proxyServer()
    ]).then(() => {
      resolve();
    }).catch(e => {
      console.log(e);
      reject(e);
    });
  });
};
