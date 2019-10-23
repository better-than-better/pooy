const compareVersions = require('compare-versions');
const pkg = require('../package.json');
const { exec } = require('child_process');

function filterVersion() {
  return new Promise((resolve, reject) => {
    exec('npm dist-tags ls pooy', (err, stdout, stderr) => {
      if (err || stderr) {
        return resolve(err || stderr);
      }

      const version = {};

      stdout.split('\n').forEach((v) => {
        const [ key, value ] = v.split(' ');

        if (!key) return;

        version[key.slice(0, -1)] = value;
      });

      resolve(version);
    });
  })
}

function checkUpdate() {
  return filterVersion().then(version => {
    const needUpdate = compareVersions(version.latest, pkg.version) === 1;

    return { version: { ...version, current: pkg.version }, needUpdate: needUpdate };
  });
}

module.exports = checkUpdate;

