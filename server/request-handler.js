const url = require('url');
const fs = require('fs');
const querystring = require('querystring');
const mime = require('mime');
const { getIps } = require('./utils');
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

  if (!/\.pooy$/.test(pathname)) {
    const p = `${__dirname}/../client/dist${pathname === '/' ? pathname + 'index.html' : pathname}`;

    if (fs.existsSync(p)) {
      const reader = fs.createReadStream(p);

      res.setHeader('content-type', mime.getType(p));
      reader.pipe(res);
    } else {
      const reader = fs.createReadStream(`${__dirname}/../client/dist/index.html`);

      res.setHeader('content-type', 'text/html');
      reader.pipe(res);
    }

    return;
  }

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
