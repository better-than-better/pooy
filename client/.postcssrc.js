// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    // to edit target browsers: use "browserslist" field in package.json
    "postcss-import": {},
    "postcss-preset-env": {
      stage: 3,
      browsers: 'last 2 versions',
      features: {
        "nesting-rules": true
      }
    },
    "postcss-nested": {},
    "cssnano": {}  // 压缩优化 CSS
  }
}