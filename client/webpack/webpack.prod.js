const path = require('path');
const baseWebpackConfig = require('./webpack.base');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HTMLPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const styleLaoders = [ /** {{loaders}} */ ];
const extEnum = name => name === 'postcss' ? 'pcss' : name;
const resolvePath = value => path.join(__dirname, '..', value);

const rules = styleLaoders.map(v => ({
  test: new RegExp(`\.${extEnum(v)}`),
  use: [
    { loader: MiniCssExtractPlugin.loader },
    {
      loader: 'css-loader',
      options: {
        importLoaders: 2,  // importLoaders: 0 => 无 loader(默认); 1 => postcss-loader; 2 => postcss-loader, sass-loader
        sourceMap: true
      }
    },
    { loader: `${v}-loader` }
  ],
  include: [resolvePath('src')]
}));



const prodWebpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  devtool: 'none',
  module: {
    rules: [
      {
        test: /\.pcss$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
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
    new MiniCssExtractPlugin({
      filename: 'app.css'
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: 'vendors'
    },
    // runtimeChunk: {
    //   name: 'runtime'
    // }
  }
  // externals: {
  //   "react": 'window.React',
  //   "react-dom": 'window.ReactDOM'
  // }
});

if (process.env.npm_lifecycle_event === 'analyze') {
  prodWebpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = prodWebpackConfig;
