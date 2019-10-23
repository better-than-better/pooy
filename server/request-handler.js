const url = require('url');
const fs = require('fs');
const querystring = require('querystring');
const mime = require('mime');
const { getIps, getReqJSON, saveOrUpdateRule, getRules, delRule, setProxyRulesStatus, getProxyRulesStatus } = require('./utils');
const checkUpdate  = require('../tools/check-update');
const CONFIG = require('../config');
const PROXY_HOST = 'ca.pooy'

const POOY_DIR = `${process.env.HOME}/.pooy`;
const proxyRules = require('./proxy-rules');

module.exports = async function (req, res) {
  if (res.headersSent) return;

  const proxy = global.proxy;

  res.setHeader('access-control-allow-credentials', true);
  res.setHeader('access-control-allow-headers', 'content-Type');
  res.setHeader('access-control-allow-methods', 'OPTION, POST, GET, PUT, DELETE');
  res.setHeader('access-control-allow-origin', '*');

  const { pathname, query } = url.parse(req.url);
  const queryData = querystring.parse(query);
  const resJSON = (data) => {
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(data));
  };

  if (req.method === 'OPTIONS') {
    return res.end('');
  }

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
      res.writeHead(200, JSON.parse(fs.readFileSync(`${targetDir}/res_header`)));
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
      port: CONFIG.proxy_port,
      host: PROXY_HOST,
      ...getIps()
    });

    // resJSON({
    //   path: '/ssl',
    //   ip: getIps(),
    //   port: CONFIG.proxy_port,
    //   host: PROXY_HOST
    // });
    return;
  }

  // 代理转态
  if (pathname === '/proxy-status.pooy') {
    resJSON({
      enabled: !proxy.direct
    });
    return;
  }

  if (pathname === '/proxy-rule.pooy') {

    if (req.method === 'POST' || req.method === 'PUT') {
      const ruleData = await getReqJSON(req);

      saveOrUpdateRule(ruleData);
      proxy.resetRules();
      proxy.useRules(proxyRules());
      return resJSON({
        success: 'ok'
      });
    }

    if (req.method === 'DELETE') {
      delRule(queryData.id);
      proxy.resetRules();
      proxy.useRules(proxyRules());
      return resJSON({
        success: 'ok'
      });
    }
  }

  if (pathname === '/proxy-rules.pooy') {
    return resJSON(getRules());
  }

  if (pathname === '/proxy-rules-status.pooy') {

    if (req.method === 'GET') {
      return resJSON({ enabled: getProxyRulesStatus() });
    }

    if (req.method === 'PUT') {
      const data = await getReqJSON(req);

      proxy.resetRules();
      data.enabled && proxy.useRules(proxyRules());
      
      await setProxyRulesStatus(data.enabled);

      return resJSON({ message: 'ok' });
    }
  }

  if (pathname === '/check-update.pooy') {
    const data = await checkUpdate(true);

    resJSON(data);
  }
  

  res.end(req.url);
}
