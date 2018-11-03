const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  // 入口文件路径
  entry: './src/index.js',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: 'asset/',
    publicPath: '/public/',
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'html-webpack-plugin',
    }),
    new CleanWebpackPlugin(['dist']),
    new webpack.HotModuleReplacementPlugin(),
  ],
  output: {
    // 出口文件名
    filename: 'script.js',

    // 出口文件路径
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        // 正则匹配
        test: /\.css$/,
        // 从右向左依次 loader
        use: [ 'style-loader', 'css-loader' ],
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
    ]
  },
};
