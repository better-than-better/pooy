const crypto = require('crypto');

class MD5{
  static random(bytes = 156) {
    return crypto.randomBytes(bytes).toString('hex')
  }
}

module.exports = MD5;