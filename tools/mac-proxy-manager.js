const { execSync } = require('child_process');
const macProxyManager = {};

const typeEnum = {
  http: 'setwebproxystate',
  https: 'setsecurewebproxystate',
  socket: 'setsocksfirewallproxystate',
  auto: 'setautoproxystate'
};

macProxyManager.networkType = 'Wi-Fi';

const _getNetworkType = () => {
  return 'Wi-Fi';
};
  
const _setProxy = (ip, port, proxyType = 'http') => {
  if (!ip || !port) {
    console.log('failed to set global proxy server.\n ip and port are required.');
    return;
  }
  
  const networkType = macProxyManager.networkType || macProxyManager.getNetworkType();
  const cmd = proxyType === 'http'
    ? `networksetup -setwebproxy ${networkType} ${ip} ${port} && networksetup -setproxybypassdomains ${networkType} 127.0.0.1 localhost`
    : `networksetup -setsecurewebproxy ${networkType} ${ip} ${port} && networksetup -setproxybypassdomains ${networkType} 127.0.0.1 localhost`;
  
  return execSync(cmd);
};
  
const _clearProxy = (proxyTypes = ['http']) => {
  const networkType = macProxyManager.networkType || macProxyManager.getNetworkType();

  proxyTypes.forEach((type) => {
    execSync(`networksetup -${typeEnum[type]} ${networkType} off`);
  });
};
  
macProxyManager.getProxyStatus = () => {
  const networkType = macProxyManager.networkType || macProxyManager.getNetworkType();
  const result = execSync(`networksetup -getwebproxy ${networkType}`);

  return result;
};

macProxyManager.setWebProxy = (ip, port) => {
  _setProxy(ip, port, 'http');

  _setProxy(ip, port, 'https');
};

macProxyManager.clearWebProxy = () => {
  _clearProxy(['http', 'https', 'socket', 'auto']);
};

module.exports = macProxyManager;
