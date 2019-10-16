const fs = require('fs');
const { getIps, getRules, safeReadStream, urlParse, parseScriptStr } = require('./utils');
const PROXY_PORT = 9009;
const CLIENT_PORT = 9001;

function filterHeaders (arr = []) {
  if (!arr || arr.length === 0) return null;

  const headers = {};

  arr.forEach(({ key, value }) => {
    if (key && value) {
      headers[key] = value;
    }
  });

  return headers;
}

function formatRules(rules) {
  const arr = [];

  rules.forEach((v) => {
    if (!v.enabled) {
      return;
    }

    // DNS 解析
    if (v.type === '0') {
      arr.push({
        test: (ctx) => {
          const reg = new RegExp(v.hostname);

          return reg.test(ctx.hostname);
        },
        request: {
          host: v.ip
        }
      });
    }

    // 请求转发
    if (v.type === '1') {
      const urlObj = urlParse(v.forwardPath);

      arr.push({
        test: (ctx) => {
          const matchMethod = v.methods ? v.methods.includes(ctx.method) : true;
          const reg = new RegExp(v.url);

          return reg.test(ctx.url) && matchMethod;
        },
        request: {
          protocol: urlObj.protocol,
          host: urlObj.host,
          path: urlObj.path,
        }
      })
    }
    
    // 自定义响应
    if (v.type === '2') {
      arr.push({
        test: (ctx) => {
          const matchMethod = v.methods ? v.methods.includes(ctx.method) : true;
    
          return ctx.url.indexOf(v.url) > -1 && matchMethod;
        },
        response: {
          statusCode: v.statusCode,
          direct: v.resDirect,
          body: v.bodyType === 'file' ? safeReadStream(v.body) : v.body,  // TODO: 考虑文件不存在的情况要不要报 404
          discardOriginalHeaders: v.discardOriginalHeaders,
          headers: filterHeaders(v.headers)
        }
      });
    }
    
    // 自定义脚本
    if (v.type === '3') {
      const data = parseScriptStr(v.script);

      data && arr.push(data);
    }
  });

  return arr;
}

module.exports = function () {
  const systemRules = [{
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

  const userRules = formatRules(getRules());

  return [...systemRules, ...userRules];
};