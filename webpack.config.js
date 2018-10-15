const path = require('path');

module.exports = {
  // 入口文件路径
  entry: './src/index.js',
  output: {
    // 出口文件名
    filename: 'script.js',

    // 出口文件路径
    path: path.resolve(__dirname, 'dist'), // Node 环境下，__dirname 为当前文件所在的绝对路径
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'css-loader' ],
      }
    ]
  }
};