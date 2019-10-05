const url = require('url');
const fs = require('fs');
const querystring = require('querystring');
const { getIps } = require('./utils');
const PROXY_PORT = 9009;
const PROXY_HOST = 'ca.pooy'

const POOY_DIR = `${process.env.HOME}/.pooy`;

module.exports = function (req, res) {
  if (res.headersSent) return;
  const proxy = global.proxy;

  res.setHeader('access-control-allow-credentials', true);
  res.setHeader('access-control-allow-headers', 'content-Type');
  res.setHeader('access-control-allow-methods', 'OPTION, POST, GET');
  res.setHeader('access-control-allow-origin', '*');

  const { pathname, query } = url.parse(req.url);
  const queryData = querystring.parse(query);
  const resJSON = (data) => {
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(data));
  };

  if (pathname === '/response.pooy') {
    const targetDir = `${POOY_DIR}/tmp/${queryData.id}`;

    if (fs.existsSync(targetDir) && fs.existsSync(`${targetDir}/res_body`)) {
      fs.createReadStream(`${targetDir}/res_body`).pipe(res);
    } else {
      res.end('');
    }

    return;
  }

  // 证书
  if (pathname === '/ca.pooy') {
    resJSON({
      path: '',
      ip: getIps(),
      host: PROXY_HOST
    });
    return;
  }

  // 代理转态
  if (pathname === '/proxy-status.pooy') {
    resJSON({
      enabled: proxy.direct
    });
    return;
  }

  res.end(req.url);
}
