'use strict';

var path = require('path');
var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: [
    'babel-polyfill',
    'webpack/hot/poll?1000',
    path.join(__dirname, 'src/server.js'),
  ],
  target: 'node',
  devtool: 'cheap-eval-source-map',
  externals: [
    nodeExternals({
      whitelist: ['webpack/hot/poll?1000'],
    }),
  ],
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, 'build'),
    filename: 'server.js', // this should match the first part of function handler in serverless.yml
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: [
          'babel-loader',
          // 'eslint-loader'
        ],
      },
    ],
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
};
