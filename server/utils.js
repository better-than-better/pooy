const os = require('os');
const fs = require('fs');
const url = require('url');
const MD5 = require('./md5');
const POOY_DIR = `${process.env.HOME}/.pooy`;

/**
 * 简单写下只适用 mac os
 */
exports.getIps = function () {
  let IPv4 = '';
  let IPv6 = '';

  if (os.type() !== 'Darwin') {
    return {}
  }

  const networkInterfaces = os.networkInterfaces().en0;

  networkInterfaces && networkInterfaces.forEach(({ family, address }) => {
    if (family === 'IPv4') {
      IPv4 = address;
    }

    if (family === 'IPv4') {
      IPv6 = address;
    }
  });

  return {
    IPv4,
    IPv6
  }
};

/**
 * create read stream
 * @param {String} path
 */
exports.safeReadStream = function(path) {
  if (fs.existsSync(path)) {
    return fs.createReadStream(path);
  }

  return '';
};

/**
 * 解析 url
 * @param {String} path
 */
exports.urlParse = function (urlStr) {
  if (!/^(http|https):\/\//.test(urlStr)) {
    urlStr = 'http://' + urlStr;
  }

  const obj = url.parse(urlStr);

  if (obj.pathname === '/') {
      obj.pathname = '';
  }

  if (obj.query === '?') {
      obj.query = '';
  }

  return obj;
};

exports.parseScriptStr = function (str) {
  let tmpfn = () => null;

  try {
    tmpfn = new Function(`return ${str}`)
  } catch (err) {

  }

  return tmpfn();
};


/**
 * 获取请求 body && to json
 */
exports.getReqJSON = function (req) {
  return new Promise((reslove, reject) => {
    const data = [];

    req.on('data', (chunk) => { data.push(chunk) });
    req.on('end', () => {
      reslove(JSON.parse(Buffer.concat(data).toString()));
    });
    req.on('error', (err) => {
      reject(err);
    })
  });
};

exports.saveOrUpdateRule = function (rule) {
  const rulesFilePath = `${POOY_DIR}/rules`;

  let rules = [];

  if (fs.existsSync(rulesFilePath)) {
    rules = JSON.parse(fs.readFileSync(rulesFilePath));
  }

  if (rule.id) {
    rules.forEach((v, i) => {
      if(v.id === rule.id) {
        rules[i] = {...v, ...rule};
      }
    });
  } else {
    rule.id = MD5.random(8);
    rule.enabled = true;
    rules.unshift(rule);
  }

  fs.writeFileSync(rulesFilePath, JSON.stringify(rules));
};

exports.delRule = function (id) {
  const rulesFilePath = `${POOY_DIR}/rules`;

  if (!fs.existsSync(rulesFilePath)) return;

  const rules = JSON.parse(fs.readFileSync(rulesFilePath));

  fs.writeFileSync(rulesFilePath, JSON.stringify(rules.filter(v => v.id !== id)));
};

exports.getRules = function () {
  const rulesFilePath = `${POOY_DIR}/rules`;

  if (!fs.existsSync(rulesFilePath)) return [];

  return JSON.parse(fs.readFileSync(rulesFilePath));
};

exports.getProxyRulesStatus = function (enabled) {
  const rulesStatusFilePath = `${POOY_DIR}/rules_status`;

  if (!fs.existsSync(rulesStatusFilePath)) {
    return true;
  }

  return !!+fs.readFileSync(rulesStatusFilePath);
}

exports.setProxyRulesStatus = function (enabled) {
  const rulesStatusFilePath = `${POOY_DIR}/rules_status`;

  if (!fs.existsSync(rulesStatusFilePath)) {

  }

  fs.writeFileSync(rulesStatusFilePath, enabled ? 1 : 0);
}
