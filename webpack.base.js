const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  // 入口文件路径
  entry: {
    polyfill: '@babel/polyfill',
    index: './src/index.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'html-webpack-plugin',
    }),
    new CleanWebpackPlugin(['dist']),
    new webpack.ProvidePlugin({
      // _: 'lodash',
      _join: ['lodash', 'join'],
    }),
  ],
  output: {
    // 出口文件名
    filename: '[name]_script.js',
    chunkFilename: '[name]_script.js',
    publicPath: '/public/',

    // 出口文件路径
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        // 正则匹配
        test: /\.(css|scss)$/,
        // 从右向左依次 loader
        use: [ 'style-loader', 'css-loader', 'sass-loader' ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 50000,
              outputPath: 'img/',
              publicPath: 'dist/img/',
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
    ]
  },
};
