const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const baseWebpackConfig = require('./webpack.base');
const merge = require('webpack-merge');
const HTMLPlugin = require('html-webpack-plugin');
const resolvePath = value => path.join(__dirname, '..', value);

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    compress: true,
    hot: true,
    host: 'localhost',
    port: 9001,
    open: true,
    host: '0.0.0.0',
    // https: {
    //   key: fs.readFileSync(path.resolve(__dirname, '../ssl/key.pem')),
    //   cert: fs.readFileSync(path.resolve(__dirname, '../ssl/cert.pem')),
    // },
    disableHostCheck: true,
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.pcss$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,  // importLoaders: 0 => 无 loader(默认); 1 => postcss-loader; 2 => postcss-loader, sass-loader
              sourceMap: true
            }
          },
          { loader: 'postcss-loader' }
        ],
        include: [resolvePath('src')]
      }
    ]
  },
  plugins: [
    // more options: https://github.com/jantimon/html-webpack-plugin#options
    new HTMLPlugin({
      filename: `index.html`,
      template: `client/src/index.html`,
      inject: true
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
});
