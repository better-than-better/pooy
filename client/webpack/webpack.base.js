const fs = require('fs');
const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const resolvePath = value => path.join(__dirname, '..', value);
const getEntry = () => {
  const entry = {};

  if (fs.existsSync(`${__dirname}/../src/app.jsx`)) {
    entry.index = './client/src/app.jsx';
  } else {
    const tmpArr = fs.readdirSync(`${__dirname}/../src`);

    tmpArr.forEach(v => {
      entry[`${v}/index`] = `./client/src/pages/${v}/app.jsx`;
    });
  }

  return entry;
};

const entry = getEntry();

const plugins = Object.keys(entry).map(name => {
  return new HTMLPlugin({
    filename: `${name}.html`,
    template: `client/src/index.html`,
    favicon: path.resolve(__dirname, '../src/assets/favicon.ico'),
    inject: true,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true
    },
    chunks: [name, 'vendors']
  })
});

const baseWebpackConfig = {
  entry,
  output: {
    filename: '[name].js',
    path:  `${path.join(__dirname, '..', '/dist')}`,
    publicPath: '/',
    globalObject: 'this'
  },
  resolve: {
    alias: {
      '@': resolvePath('src'),
      '@components': resolvePath('src/components'),
      '@modules': resolvePath('src/modules'),
      '@assets': resolvePath('src/assets'),
      '@helper': resolvePath('src/helper'),
      '@api': resolvePath('src/api'),
      '@pages': resolvePath('src/pages'),
      '@config': resolvePath('src/config')
    },
    extensions: ['.js', '.jsx', '.tsx', '.json']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)/,
        loader: 'babel-loader',
        include: [`${path.join(__dirname, '..', '/src')}`]
      },
      {
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' },
        include: [`${path.join(__dirname, '..', '/src')}`]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1024 * 20
        },
        include: [`${path.join(__dirname, '..', '/src')}`]
      },
    ]
  },
  plugins
};

module.exports = baseWebpackConfig;
