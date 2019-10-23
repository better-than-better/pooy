const path = require('path');
const fs = require('fs');
const YAML = require('yaml');

const configFile = fs.readFileSync(`${__dirname}/../config.yml`, 'utf-8');
const CONFIG = YAML.parse(configFile);


module.exports = Object.freeze(CONFIG);
