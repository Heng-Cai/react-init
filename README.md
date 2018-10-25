# webpack 安装

```bash
npm install --save-dev webpack
npm install --save-dev webpack-cli
# 4.0 以后版本的 webpack 和 webpack-cli 分离，需分别安装
```

> 项目目录：/Users/xxx/workspace/react-init <=> ./

# webpack 起步

- index.html

```html
<body>
  <!-- webpack 打包后的出口文件 -->
  <script src="./dist/script.js"></script>
</body>
```

- ./src/index.js (入口文件)

```javascript
function component() {
  const element = document.createElement('div');
  element.innerHTML = 'Hello World';
  return element;
}

document.body.appendChild(component());
```

- webpack.config.js

```javascript
const path = require('path');

module.exports = {
  // 入口文件路径
  entry: './src/index.js',
  output: {
    // 出口文件名
    filename: 'script.js',

    // 出口文件路径
    path: path.resolve(__dirname, 'dist'), // Node 环境下，__dirname 为当前文件夹所在的绝对路径
  }
};
```

- package.json

```json
{
  "scripts": {
    "build": "webpack --config ./webpack.config.js"
  }
}
```

> 当根路径下存在 webpack.config.js 文件时，webpack 会自动运用该文件，因此脚本可以简写为
>
> ```json
> {
>   "scripts": {
>     "build": "webpack"
>   }
> }
> ```

- ./dist/script.js (webpack 打包生成的出口文件)

```bash
npm run build

# output
Hash: 16d885cd424e740b501a
Version: webpack 4.20.2
Time: 94ms
Built at: 2018-10-14 22:26:29
    Asset      Size  Chunks             Chunk Names
script.js  1.02 KiB       0  [emitted]  main
Entrypoint main = script.js
[0] ./src/index.js 170 bytes {0} [built]
```

# 静态资源管理

## css

### css-loader

将 css 转化为数组，并在数组中重写 toString() 方法，可将 css 转化为字符串

安装 [css-loader](https://github.com/webpack-contrib/css-loader)

```bash
npm install --save-dev css-loader
```

./src/style.css

```css
@import './_part.css';

div {
  color: red;
}
```

./src/_part.css

```css
body {
  background-color: aqua;
}
```

./src/index.js

```javascript
import css from'./style.css';

console.log('***css***', css);
// output
[
  [3,"body {\n  background-color: aqua;\n}\n",""],
  [0,"div {\n  color: red;\n}\n",""]
]

// Array 同时有一个重写的 toString() 方法, 将 css 转化为字符串
console.log('***css***', css.toString());
// output
"body {\n  background-color: aqua;\n}\n  div {\n  color: red;\n}\n"
```

webpack.config.js

```javascript
module: {
  rules: [
    {
      test: /\.css$/,
      use: [ 'css-loader' ],
    }
  ]
}
```

```bash
npm run build

# output
Hash: 1d9cfe9508e783eac203
Version: webpack 4.20.2
Time: 312ms
Built at: 2018-10-15 11:44:28
    Asset      Size  Chunks             Chunk Names
script.js  2.11 KiB       0  [emitted]  main
Entrypoint main = script.js
[0] ./src/style.css 260 bytes {0} [built]
[2] ./src/index.js 274 bytes {0} [built]
[3] ./node_modules/css-loader!./src/_part.css 197 bytes {0} [built]
```

> 输出的 css 的数组的第一个元素与打包编号向对应
>
> ./src/style.css <=> 0
>
> ./src/_part.css <=> 3

### style-loader

将 css-loader toString() 之后的 css 字符串以 `<style>` 标签包裹，并在页面加载时动态插入 `<head>` (查看源代码的 index.html 不会变化)

```javascript
document.createElement('style');
```

安装 [style-loader](https://github.com/webpack-contrib/style-loader)

```bash
npm install --save-dev style-loader
```

webpack.config.js

```javascript
module: {
  rules: [
    {
      test: /\.css$/,
      // 从右向左依次 loader
      use: [ 'style-loader', 'css-loader' ],
    }
  ]
}
```

```bash
npm run build

# output
Hash: cf9323d99eba35e639f1
Version: webpack 4.20.2
Time: 810ms
Built at: 2018-10-15 22:57:21
    Asset      Size  Chunks             Chunk Names
script.js  7.02 KiB       0  [emitted]  main
Entrypoint main = script.js
[1] ./src/index.js 193 bytes {0} [built]
[2] ./src/style.css 1.05 KiB {0} [built]
[3] ./node_modules/css-loader!./src/style.css 260 bytes {0} [built]
[4] ./node_modules/css-loader!./src/_part.css 197 bytes {0} [built]
```

> webpack 打包生成的 script.js 文件中增加了动态插入 `<style>` 标签的代码，从而在页面加载时使样式生效

Chrome 控制台 element

```html
<head>
<style type="text/css">body {
  background-color: aqua;
}
</style>
<style type="text/css">div {
  color: red;
}
</style>
</head>
```

> [3], [4] 打包编号对应动态插入的两个 `<style>` 标签

## image

### file-loader

安装 [file-loader](https://github.com/webpack-contrib/file-loader)

```bash
npm install --save-dev file-loader
```

./src/bg.png (加入的图片)

./src/_part.css (引入图片)

```css
body {
  background-image: url('./bg.png');
}
```

./src/index.js (引入图片)

```javascript
import BackgroundImage from './bg.png';

const imgElement = new Image();
imgElement.src = BackgroundImage;
```

webpack.config.js

```javascript
module: {
  rules: [
    {
      test: /\.(png|svg|jpg|gif)$/,
      use: [ 'file-loader' ],
    },
  ]
}
```

```bash
npm run build

# output
Hash: 9d2910f0fec6c0731a36
Version: webpack 4.20.2
Time: 331ms
Built at: 2018-10-18 22:14:28
                               Asset      Size  Chunks                    Chunk Names
53f4717a650a18c3ef5f081ea05de980.png   279 KiB          [emitted]  [big]
                           script.js  7.39 KiB       0  [emitted]         main
Entrypoint main = script.js
[0] ./src/bg.png 82 bytes {0} [built]
[2] ./src/index.js 394 bytes {0} [built]
[3] ./src/style.css 1.05 KiB {0} [built]
[4] ./node_modules/css-loader!./src/style.css 260 bytes {0} [built]
[5] ./node_modules/css-loader!./src/_part.css 303 bytes {0} [built]
```

> ./src/bg.png 被复制到了 ./dist/53f4717a650a18c3ef5f081ea05de980.png

Chrome 控制台 element

```html
<head>
<style type="text/css">body {
  background-image: url(53f4717a650a18c3ef5f081ea05de980.png);
}
</style>
</head>
<body>
<img src="53f4717a650a18c3ef5f081ea05de980.png"></img>
</body>
```

鼠标悬浮时会显示图片路径 (类似 url 链接)：

file:///Users/xxx/workspace/react-init/53f4717a650a18c3ef5f081ea05de980.png (引用图片的路径)

可以看到，webpack 复制的图片不在此路径上，而在：

file:///Users/xxx/workspace/react-init/dist/53f4717a650a18c3ef5f081ea05de980.png (输出图片的路径)

因此无法显示该图片

#### output.path

代表本地输出文件的**绝对路径**，[默认值为](https://github.com/webpack/webpack/blob/master/lib/WebpackOptionsDefaulter.js#L152)

```javascript
this.set("output.path", path.join(process.cwd(), "dist"));

// process.cwd() 为 node API，表示当前 node 进程所运行的文件夹目录
```

webpack.config.js

```javascript
console.log('***process.cwd()***', process.cwd());
// ***process.cwd()*** /Users/xxx/workspace/react-init

console.log('***__dirname***', __dirname);
// ***__dirname*** /Users/xxx/workspace/react-init
```

#### output.publicPath

代表线上引用文件的路径，可为相对路径，也可为绝对路径，默认值为空字符串

该路径是所有打包生成文件的 URL 的前缀，因此一般以 '/' 结尾

```javascript
module.exports = {
  output: {
    // One of the below
    publicPath: 'https://cdn.example.com/assets/', // CDN (always HTTPS)
    publicPath: '//cdn.example.com/assets/', // CDN (same protocol)
    publicPath: '/assets/', // server-relative
    publicPath: 'assets/', // relative to HTML page
    publicPath: '../assets/', // relative to HTML page
    publicPath: '', // relative to HTML page (same directory)
    publicPath: './', // relative to HTML page (same directory)
  }
};
```

> 相对于 HTML page 在本项目中即指相对于 index.html 所在文件夹：/Users/xxx/workspace/react-init

#### file-loader.outputPath

默认值为 `undefined`

设置 loader 文件输出的绝对路径：

```bash
output.path
+
(file-loader.outputPath || '')
+
file-loader.name
```

因此当未设置 file-loader.outputPath 时，输出的图片的绝对路径为：

```bash
/Users/xxx/workspace/react-init/dist/53f4717a650a18c3ef5f081ea05de980.png

# output.path
/Users/xxx/workspace/react-init/dist
# file-loader.name
53f4717a650a18c3ef5f081ea05de980.png
```

若设置 webpack.config.js

```javascript
{
  test: /\.(png|svg|jpg|gif)$/,
  use: [
    {
      loader: 'file-loader',
      options: {
        outputPath: 'img/',
      },
    },
  ],
},
```

则输出图片的绝对路径为

```bash
/Users/xxx/workspace/react-init/dist/img/53f4717a650a18c3ef5f081ea05de980.png

# output.path
/Users/xxx/workspace/react-init/dist
# file-loader.outputPath
img/
# file-loader.name
53f4717a650a18c3ef5f081ea05de980.png
```

#### file-loader.publicPath

默认值为 undefined

设置 loader 文件的引用路径 (相当于针对该 file-loader 重写了 output.publicPath，从而此设置项将变为该 file-loader 所打包编译文件的引用路径前缀)：

```bash
# file-loader.publicPath 默认值为 output.publicPath 与 file-loader.outputPath 的拼接值
file-loader.publicPath || (output.publicPath + (file-loader.outputPath || ''))
+
file-loader.name
```

- 当未设置 output.publicPath 以及 file-loader.publicPath 时，引用图片的路径为：

```bash
/Users/xxx/workspace/react-init/53f4717a650a18c3ef5f081ea05de980.png

# HTML page
/Users/xxx/workspace/react-init
# output.publicPath + (file-loader.outputPath || '')
''
# file-loader.name
53f4717a650a18c3ef5f081ea05de980.png
```

- 若设置 webpack.config.js

```javascript
{
  test: /\.(png|svg|jpg|gif)$/,
  use: [
    {
      loader: 'file-loader',
      options: {
        outputPath: 'img/',
        publicPath: '', // 或者不设置 publicPath
      },
    },
  ],
},
```

则引用路径变为为

```bash
/Users/xxx/workspace/react-init/img/53f4717a650a18c3ef5f081ea05de980.png

# HTML page
/Users/xxx/workspace/react-init
# output.publicPath + (file-loader.outputPath || '')
'img/'
# file-loader.name
53f4717a650a18c3ef5f081ea05de980.png
```

图片仍然无法显示

- 若设置 webpack.config.js

```javascript
{
  test: /\.(png|svg|jpg|gif)$/,
  use: [
    {
      loader: 'file-loader',
      options: {
        outputPath: 'img/',
        publicPath: 'dist/img/'
      },
    },
  ],
},
```

则引用路径变为为

```bash
/Users/xxx/workspace/react-init/dist/img/53f4717a650a18c3ef5f081ea05de980.png

# HTML page
/Users/xxx/workspace/react-init
# file-loader.publicPath
'dist/img/'
# file-loader.name
53f4717a650a18c3ef5f081ea05de980.png
```

于是就可以将图片显示出来了

Chrome 控制台 element

```html
<head>
<style type="text/css">body {
  background-image: url(dist/img/53f4717a650a18c3ef5f081ea05de980.png);
}
</style>
</head>
<body>
<img src="dist/img/53f4717a650a18c3ef5f081ea05de980.png"></img>
</body>
```

> html 中文件的引用路径为：
>
> ```bash
> file-loader.publicPath || (output.publicPath + (file-loader.outputPath || ''))
> +
> file-loader.name
> ```

### url-loader

安装 [url-loader](https://github.com/webpack-contrib/url-loader)

```bash
npm install --save-dev url-loader
```

- 当文件满足 url-loader.limit 限制时，返回文件的 DataURL (base64)
- 当文件不满足 url-loader.limit 限制时，则按 (url-loader.fallback || 'file-loader') 中设置的 loader 来处理
- url-loader 中定义的 options 对 fallback 也生效

./src/icon.png (新增图片)

./src/index.js (引入新增图片)

```javascript
import Icon from './icon.png';

const imgElement = new Image();
imgElement.src = Icon;
```

Webpack.config.js

```javascript
{
  test: /\.(png|svg|jpg|gif)$/,
  use: [
    {
      loader: 'url-loader',
      options: {
        limit: 50000, // 限制大小 (b)
        outputPath: 'img/', // 可用于 fallback-loader
        publicPath: 'dist/img/', // 可用于 fallback-loader
      },
    },
  ],
},
```

```bash
npm run build

# output
Hash: 2007f37c046caf479531
Version: webpack 4.20.2
Time: 398ms
Built at: 2018-10-23 17:47:54
                                   Asset      Size  Chunks                    Chunk Names
img/53f4717a650a18c3ef5f081ea05de980.png   279 KiB          [emitted]  [big]
                               script.js  9.15 KiB       0  [emitted]         main
Entrypoint main = script.js
[1] ./src/icon.png 1.79 KiB {0} [built]
[2] ./src/index.js 318 bytes {0} [built]
[3] ./src/style.css 1.05 KiB {0} [built]
[4] ./node_modules/css-loader!./src/style.css 260 bytes {0} [built]
[5] ./node_modules/css-loader!./src/_part.css 303 bytes {0} [built]
[7] ./src/bg.png 65 bytes {0} [built]
```

Chrome 控制台 Elements

```html
<head>
<style type="text/css">body {
  background-image: url(dist/img/53f4717a650a18c3ef5f081ea05de980.png);
}
</style>
</head>
<body>
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA2CAYAAACMRWrdAAAAAXNSR0IArs4c6QAABPlJREFUaAXdmk2MFEUUx/+vZ1dC4uIXhGxiwiLgHvjQA+zBg5kFJIGwtwX1otGL635EooknCAc4EA9Gg/vhzeBFkNseNJhlJ15M1JNhE1fiB9wI8QLBILOz5XtV3eNsT3dv1Ux3T+/WYaY/Xr36/7q6qqvqFSHFpJQiTLyyB7VqGYp2s+t+KLUNRJv4v0cXRXSfj+/xtVt8vghSCyh1V3DxuxtEpNKSQ+060jCjB1+GWn6DfQ1BYUtLPgl3Od8syLuEqevftwvZMpgGGhs8iWV1jmF2tQQTl4lwEx6dweT8lVYBWwJTo4cGUat9BKj9cdrSuU4/o1T6kKbm5l39OYGp8SPbsfTvJNfQUdeC2rInfIOuDWP02bU/bf1Yg6mRcpmdXuWG/4yt81TtiP5mf8M0U6nY+PVsjBjqHQa61jEoESkPlDVoLRaiE2tMXTlRwtzdT9nrmIWvHE1oEoe2vEcnv67FFdoVd0NfLySUKOMHPSdfB4zLT1SKrTH/9ZuJylSYa0Qj3OY+j9ITCaY7CmlTQHdUpgJdq/II5khUh9IEZrr0Rz91tKNweXLSW3Y9diD8KWjuFfV3qkNdugtQYCu9pWgOpRU1ZkYUS9dDNmvjtNR1sHGEUq8xPfbTw6S1wdGkkrVrBv9GHQwyoM187NckJ8ULPG7VDMalBtOkMkovWnp6K/D2aWDDRjtlzBDUmqkxPZ9KeephJyXeSqDe/wQYOAxM8ETCBk6mT8LCyYCZSWJ8IXnfCaA295qSd+51gNMTXnh+1Q3lrT22vDBUYPgcrzQ8/2JwlvQ/JEykxg/vRbX6S5JlbvfioJaXgS/5dfzhWzsp3d37PL3wYmeerVVaUKKSF5M8fzUpW9GreU8TSsriFTLpPPpXKzfT+2lDGbH9AtaXqfAk59lASYl9AmYWMpMEZHEvOyhR28NtzF+hdRHf85SLdbNttlDcxhSDuabjbwFnvwCe3eGa09hnDeWr8ngGet9aoUAdfxN4/Ang1MfucDlBCZPUmB3YMV6aF6ggucLlBSX6OOghYH/J8arp1q9A9dFKM1u4PKFEIUdyBGxxpdqYs4UfgRmeQrjC5Q1l5C9yG+P4lG1yhesMFNeYWvB00M0WTOxWg9v3EnjVCNj1AvABLyIHU4+gDNcBbZDP5Z8DiaSnLe+W7zgH7HYPACPneeWRIWxTHlASQJyubPX8wNqsrba6XVzN1Q1CB3lAmSJnhcl8oCU82koSuGnuUB7+k5y7tgRcumA/n0r2lnzXZ9Hriv7ruNhyyLW3D3j9VPQM9/ZN4DK3td9vJAtK466EeKcr/VJjGkx8qtHyq6ipr9ry37sN2MmdxqYngQf83f+DO9zbv7Xl0ilziV6jqcplyfM/mGxlGBnkdyvruLKTVAdjjlfPzA8EwXjTxoRQ9lhwINvBU7FMJQgvDH6qg8m5XvuWQPZaS6y5cd1e5K8A0zwcnefqk0D22kg6jMSaQ6kJzI8zDbNdNWRbxFPROByOjYnQJjC5qCOERBNyXOjEGqOimaI5EkxumNguR+cLm2jSaIwWGAumzXvBX90iwpntENFI5mr9O5Zk5O8guMg2nQ62SzBdXr/InQKNDFZgkkHvJFhvW44ETDdSjs7zWCX/75zeJMY7Ayz3UWm98uOa1t22vsYHoGcE620jZhPgeto62wgXHOtaDG92NkGPnvpSek6bnf8DllAL2L6D0tkAAAAASUVORK5CYII="></img>
</body>
```

- ./src/icon.png

由于其大小满足 url-loader.limit 的限制，会被转化为 base64，并被加入到打包的 ./dist/script.js 中，在 index.html 加载时动态插入到 `<img>` 标签中

- ./src/bg.png

由于其大小超过 url-loader.limit 的限制，会用默认的 file-loader 来处理，被复制到 ./dist/img/53f4717a650a18c3ef5f081ea05de980.png

# 输出管理

## HtmlWebpackPlugin

安装 [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) (自动生成 html)

```bash
npm install --save-dev html-webpack-plugin
```

webpack.config.js

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');

plugins: [
  new HtmlWebpackPlugin({
    title: 'react-init',
  }),
],
```

./dist/index.html (HtmlWebpackPlugin 自动生成的 html)

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>react-init</title>
  </head>
  <body>
  <script type="text/javascript" src="script.js"></script></body>
</html>
```

- 默认的 filename 为 index.html (可自定义)

```javascript
plugins: [
  new HtmlWebpackPlugin({
    filename: 'assets/admin.html',
  }),
],
```

- 生成的 html 输出路径

```bash
OUTPUT_PATH = output.path + html-webpack-plugin.filename
```

- 打包生成的 script.js 会默认插入到 html 的 `<body>` 底部 (可自定义)

```javascript
plugins: [
  new HtmlWebpackPlugin({
    inject: 'head',
  }),
],
```

> inject: true || 'head' || 'body' || false (默认为 true)
>
> - true || 'body' => 插入 `<body>` 底部
> - false || 'head' => 插入 `<head>` 底部

- 若将 css 从 script.js 中分离出去，分离出的 css 会已 `<link>` 标签插入到生成的 html 中

```diff
CleanWebpackPlugin
```

## CleanWebpackPlugin

安装 [clean-webpack-plugin](https://github.com/johnagan/clean-webpack-plugin) (build 之前移除整个 build 文件夹)

```bash
npm install --save-dev clean-webpack-plugin
```

```javascript
{
  plugins: [
    new CleanWebpackPlugin(paths [, options])
    // paths: array<string>
    // options: object
  ]
}
```

移除的文件夹路径：

```bash
REMOVE_PATH = (clean-webpack-plugin.options.root || __dirname) + paths
```

Webpack.config.js

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

plugins: [
  new HtmlWebpackPlugin({
    title: 'react-init',
  }),
  new CleanWebpackPlugin(['dist']), // 不一定需要放在最前面
],
```

```bash
npm run build

# output
clean-webpack-plugin: /Users/caiheng/workspace/react-init/dist has been removed.
Hash: edccb81ab09906e93c01
...
```

# 开发环境配置

## source maps

将打包编译后的代码 (如: ./dist/script.js) 与源码 (如: ./src/index.js) 之间建立映射关系，从而当打包编译后的代码报错时，抛出的错误栈可以将错误出处映射到源码的相应位置

当未配置 source maps 且有错误信息时：

./src/index.js

```javascript
const element = documen.createElement('div'); // document typo error
```

npm run build 后运行 index.html (报错)

```bash
Uncaught ReferenceError: documen is not defined
    at script.js:formatted:123
    at Module.<anonymous> (script.js:formatted:129)
    at n (script.js:formatted:11)
    at script.js:formatted:71
    at script.js:formatted:72
(anonymous) @ script.js:formatted:123
(anonymous) @ script.js:formatted:129
n @ script.js:formatted:11
(anonymous) @ script.js:formatted:71
(anonymous) @ script.js:formatted:72
```

可以看到错误被定位到打包编译生成的 ./dist/script.js 中，不便于 debug

```javascript
// Chrome 控制台 Sources 中 formatted 处理过的 ./dist/script.js
document.body.appendChild(function() {
  const t = documen.createElement("div")  // document typo error
    , e = new Image;
  return e.src = o.a,
  t.innerHTML = "Hello World",
  t.appendChild(e),
  t
}())
```

webpack.config.js (配置 source maps)

```javascript
devtool: 'inline-source-map',
```

npm run build 后运行 index.html (报错)

```bash
Uncaught ReferenceError: documen is not defined
    at index.js:5
    at Module.<anonymous> (index.js:13)
    at n (bootstrap:19)
    at bootstrap:83
    at bootstrap:83
```

错误被定位到了源码处 (./src/index.js)

当设置为 inline-source-map 时，source maps 文件会以 DataUrl 的形式插入到打包编译生成的 ./dist/script.js 中

./dist/script.js

```javascript
... // javascript code
//# sourceMappingURL=data:application/json;charset=utf-8;base64,
eyJ2ZXJzaW9uIjozLCJzb3VyY2...
```

## watch mode

package.json

```json
{
  "scripts": {
    "watch": "webpack --watch",
    "build": "webpack --config ./webpack.config.js"
  }
}

// 等效于
{
  "scripts": {
    "watch": "webpack --watch --config ./webpack.config.js",
    "build": "webpack --config ./webpack.config.js"
  }
}
```

运行 npm run watch，进入 watch mode，当源文件发生改变时，会自动重新运行 npm run build

