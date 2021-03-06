# webpack

## webpack 安装

```bash
npm install --save-dev webpack
npm install --save-dev webpack-cli
# 4.0 以后版本的 webpack 和 webpack-cli 分离，需分别安装
```

> 项目目录：/Users/xxx/workspace/react-init <=> ./

## webpack 起步

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

## 静态资源管理

### css

#### css-loader

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

#### style-loader

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

### image

#### file-loader

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

默认值为 undefined

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

#### url-loader

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

## 输出管理

### HtmlWebpackPlugin

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

### CleanWebpackPlugin

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

## 开发环境配置

### source maps

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

### watch mode

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

### webpack-dev-server

安装 [webpack-dev-server](https://github.com/webpack/webpack-dev-server)

```bash
npm install --save-dev webpack-dev-server
```

#### devServer.contentBase

设置服务器 origin (如: http://localhost:8080) 所对应的本地文件路径，以方便引用非 webpack 打包编译的文件

默认值为 webpack.config.js 所在的 __dirname

webpack.config.js

```javascript
devServer: {
  contentBase: 'asset/',
},
plugins: [
  // 暂时不自动生成 html
  // new HtmlWebpackPlugin({
  //   title: 'html-webpack-plugin',
  // }),
  new CleanWebpackPlugin(['dist']),
],
```

./asset/index.html

```html
<!DOCTYPE html>
<html>
<head>
  <title>react-init-asset</title>
  <link rel="stylesheet" href="./asset.css">
</head>
<body>
  <div>react-init-asset</div>
  <script src="./script.js"></script>
</body>
</html>
```

./asset/asset.css

```css
div {
  border: 1px solid aqua;
}
```

package.json

```json
{
  "scripts": {
    "start": "webpack-dev-server --open",
  }
}
```

运行 npm run start，浏览器会自动打开 http://localhost:8080，由 devServer.contentBase 的配置，该 origin  对应本地文件路径为 /Users/xxx/workspace/react-init/asset/

浏览器会默认在 http://localhost:8080/ 下请求并渲染 index.html 文件，即渲染 /Users/xxx/workspace/react-init/asset/index.html (此时不存在 html-webpack-plugin 自动生成的 html)，同时 /Users/xxx/workspace/react-init/asset/asset.css 也得到了应用

同时，webpack 打包编译生成的 script.js 也被引用渲染到 html 中，而它则是通过 devServer.publicPath 引用的

#### devServer.publicPath

设置 webpack 打包编译生成文件的基准引用路径，默认值为：'/'，基准路径为：

```bash
server.origin + devServer.publicPath
```

webpack-dev-server 不会将编译打包文件写入到本地存储中，而是存放在内存中，但仍然可以像 npm run build 那样理解，文件"输出"路径 output.path 为：

```bash
devServer.contentBase + devServer.publicPath
```

“输出”文件可以通过以下地址在浏览器中访问到：http://localhost:8080/webpack-dev-server

- img
  - [53f4717a650a18c3ef5f081ea05de980.png](http://localhost:8080/img/53f4717a650a18c3ef5f081ea05de980.png)
- [script.js](http://localhost:8080/script.js)
- [script](http://localhost:8080/script) (magic html for script.js) ([webpack-dev-server](http://localhost:8080/webpack-dev-server/script))

./asset/index.html 就根据 http://localhost:8080/script.js 引用到了打包编译生成的 script.js

若自动生成 html：webpack.config.js

```javascript
plugins: [
  new HtmlWebpackPlugin({
    title: 'html-webpack-plugin',
  }),
  new CleanWebpackPlugin(['dist']),
],
```

运行 npm run start 浏览器会自动打开 http://localhost:8080，且优先渲染由 webpack 打包编译生成的 html，即渲染 http://localhost:8080/index.html，从而 /Users/xxx/workspace/react-init/asset/index.html 不再被渲染

再次访问：http://localhost:8080/webpack-dev-server

- img
  - [53f4717a650a18c3ef5f081ea05de980.png](http://localhost:8080/img/53f4717a650a18c3ef5f081ea05de980.png)
- [script.js](http://localhost:8080/script.js)
- [script](http://localhost:8080/script) (magic html for script.js) ([webpack-dev-server](http://localhost:8080/webpack-dev-server/script))
- [index.html](http://localhost:8080/index.html)

若设置devServer.publicPath：webpack.config.js

```javascript
devServer: {
  contentBase: 'asset/',
  publicPath: '/public/',
},
```

再改变 ./asset/index.html

```html
<script src="./public/script.js"></script>
```

运行 npm run start 浏览器会自动打开 http://localhost:8080，再次渲染 /Users/xxx/workspace/react-init/asset/index.html，因为自动生成的 html 不在此路径下了，而且通过 http://localhost:8080/public/script.js 引用到了打包编译生成的 script.js

> 此时可以认为打包编译的文件所在的路径为：/Users/xxx/workspace/react-init/asset/public/script.js
>
> 但 script.js 不在本地存储中，因此上述路径无法访问到 script.js 文件，而
>
> /Users/xxx/workspace/react-init/asset  <==对应==>  http://localhost:8080
>
> 因此可以通过  http://localhost:8080/public/script.js 访问到 script.js 文件

再次访问：http://localhost:8080/webpack-dev-server

- img
  - [53f4717a650a18c3ef5f081ea05de980.png](http://localhost:8080/public/img/53f4717a650a18c3ef5f081ea05de980.png)
- [script.js](http://localhost:8080/public/script.js)
- [script](http://localhost:8080/public/script) (magic html for script.js) ([webpack-dev-server](http://localhost:8080/webpack-dev-server/public/script))
- [index.html](http://localhost:8080/public/index.html)

因此访问 http://localhost:8080/public/ 才能渲染生成的 html

> devServer.contentBase 用于设置服务器根路径所对用的本地文件路径
>
> devServer.publicPath 用于设置 webpack 打包编译的文件相对于服务器根路径 (或者服务器根路径对应的本地文件路径) 的相对路径

## 模块热替代

webpack.config.js

```javascript
devServer: {
  hot: true,
},
plugins: [
  new webpack.HotModuleReplacementPlugin(),
],
```

当更改 ./src/index.js 或其所引用到的其他文件 (js, css 等) 时，webpack 会使页面自动刷新以响应修改，同时当访问 http://localhost:8080/webpack-dev-server 时，webpack 会产生一些关于更改的 hot-updata 文件

- img
  - [53f4717a650a18c3ef5f081ea05de980.png](http://localhost:8081/public/img/53f4717a650a18c3ef5f081ea05de980.png)
- [script.js](http://localhost:8081/public/script.js)
- [script](http://localhost:8081/public/script) (magic html for script.js) ([webpack-dev-server](http://localhost:8081/webpack-dev-server/public/script))
- [index.html](http://localhost:8081/public/index.html)
- [7a338b372ebe5375c3e5.hot-update.json](http://localhost:8080/public/7a338b372ebe5375c3e5.hot-update.json)
- [0.291e9e3314b2c0b8b62b.hot-update.js](http://localhost:8080/public/0.291e9e3314b2c0b8b62b.hot-update.js)
- [0.291e9e3314b2c0b8b62b.hot-update](http://localhost:8080/public/0.291e9e3314b2c0b8b62b.hot-update) (magic html for 0.291e9e3314b2c0b8b62b.hot-update.js) ([webpack-dev-server](http://localhost:8080/webpack-dev-server/public/0.291e9e3314b2c0b8b62b.hot-update))
- [291e9e3314b2c0b8b62b.hot-update.json](http://localhost:8080/public/291e9e3314b2c0b8b62b.hot-update.json)

## 生产环境配置

### webpack-merge

安装 [webpack-merge](https://github.com/survivejs/webpack-merge)

```bash
npm install --save-dev webpack-merge
```

切分 webpack.config.js 文件，区分生产与开发环境的 webpack 配置

```diff
- |- webpack.config.js
+ |- webpack.base.js
+ |- webpack.dev.js
+ |- webpack.prod.js
```

webpack.base.js (开发环境与生产环境通用配置)

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  // 入口文件路径
  entry: './src/index.js',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'html-webpack-plugin',
    }),
    new CleanWebpackPlugin(['dist']),
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
```

webpack.dev.js (开发环境特定配置)

```javascript
const webpack = require('webpack');
const merge = require('webpack-merge');
const base = require('./webpack.base');

module.exports = merge(base, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: 'asset/',
    publicPath: '/public/',
    hot: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
});
```

webpack.prod.js (生产环境特定配置)

```javascript
const merge = require('webpack-merge');
const base = require('./webpack.base');

module.exports = merge(base, {
  mode: 'production',
  devtool: 'source-map',
});
```

> 设置 mode: 'production'  (或不设置 mode) 时 webpack 会默认对打包编译的 script.js 做压缩处理
>
> 生产环境相对于开发环境做了更轻量级的 source maps

package.json 也做相应修改 (指定 webpack 配置文件)

```json
"scripts": {
  "start": "webpack-dev-server --open --config ./webpack.dev.js",
  "build": "webpack --config ./webpack.prod.js"
}
```

### process.env.NODE_ENV

在 webpack v4 中，设置了 mode 之后，webpack 会自动利用 DefinePlugin 将 process.env.NODE_ENV 设置为相应 mode，而设置过程是在 webpack 的打包编译过程中进行的

当在 webpack.config.js 中引用 process.env.NODE_ENV 时，会发现它始终是 undefined，原因在于在编译打包之前就读取了该配置文件，而那时 webpack 还未设置该值

./sre/index.js (可在打包编译的源代码中引用该值)

```javascript
if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!');
}
```

## 代码分离

### 多入口

增加一个入口 ./src/module.js

```javascript
import './style.css';
import Icon from './icon.png';

function component() {
  const element = document.createElement('div');
  const imgElement = new Image();
  imgElement.src = Icon;
  element.innerHTML = 'module';
  element.appendChild(imgElement);
  return element;
}

document.body.appendChild(component());
```

配置 webpack.base.js

```javascript
entry: {
  index: './src/index.js',
  module: './src/module.js',
},
output: {
  // 出口文件名
  filename: '[name]_script.js',

  // 出口文件路径
  path: path.resolve(__dirname, 'dist'),
},
```

> 由于采用了多入口文件，输出时也会有多个出口文件，将 output.filename 设置为固定值 'script.js' 会因文件重名而报错，因此修改为 '[name]_script.js'，其中的占位符 '[name]' 对应各入口文件的 key 值

```bash
npm run start

# output
Version: webpack 4.20.2
Time: 1970ms
Built at: 2018-11-04 18:47:23
                                   Asset       Size  Chunks             Chunk Names
img/53f4717a650a18c3ef5f081ea05de980.png    279 KiB          [emitted]
                         index_script.js    960 KiB   index  [emitted]  index
                        module_script.js    960 KiB  module  [emitted]  module
                              index.html  259 bytes          [emitted]
```

可以看到，index_script.js 与 module_script.js 大小一样，有很多重复的代码，可以通过 webpack 的 SplitChunksPlugin 将这些可以复用的代码抽离出来，从而减小输出体积

webpack.base.js

```javascript
optimization: {
  splitChunks: {
    // 'all' 选择所有的输出文件进行重复代码抽离处理
    chunks: 'all'
  },
},
```

```bash
npm run start

# output
Version: webpack 4.20.2
Time: 1788ms
Built at: 2018-11-04 19:00:19
                                   Asset       Size                Chunks             Chunk Names
img/53f4717a650a18c3ef5f081ea05de980.png    279 KiB                        [emitted]
                         index_script.js   90.1 KiB                 index  [emitted]  index
                        module_script.js   90.1 KiB                module  [emitted]  module
          vendors~index~module_script.js    876 KiB  vendors~index~module  [emitted]  vendors~index~module
                              index.html  336 bytes                        [emitted]
```

可以看到，可复用的重复代码已经被抽离到了 vendors~index~module_script.js

同时，由 HtmlWebpackPlugin 自动生成的 html 也引入了所有的输出文件

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>html-webpack-plugin</title>
  </head>
  <body>
    <script type="text/javascript" src="vendors~index~module_script.js"></script>
    <script type="text/javascript" src="index_script.js"></script>
    <script type="text/javascript" src="module_script.js"></script>
  </body>
</html>
```

### 动态导入

利用 import() 方法进行动态导入，该方法返回 promise

新建 ./src/module.js

```javascript
export default function () {
  console.log('Module has been dynamicly imported!');
}
```

在 ./src/index.js 中动态导入 ./src/module.js

```javascript
function dynamicImport() {
  return import(/* webpackChunkName: "module" */ './module')
           .then(({ default: log }) => log());
}

function component() {
  ...
  const btnElement = document.createElement('button');
  btnElement.onclick = dynamicImport
  ...
}

document.body.appendChild(component());
```

webpack.base.js

```javascript
output: {
  // 出口文件名
  filename: 'script.js',
  chunkFilename: '[name]_script.js',

  // 出口文件路径
  path: path.resolve(__dirname, 'dist'),
},
```

> import() 中的 webpackChunkName 对应 output.chunkFilename 中的 '[name]' 占位符

```bash
npm run start

# output
Version: webpack 4.20.2
Time: 1871ms
Built at: 2018-11-05 22:42:19
                                   Asset       Size  Chunks             Chunk Names
img/53f4717a650a18c3ef5f081ea05de980.png    279 KiB          [emitted]
                               script.js    971 KiB    main  [emitted]  main
                        module_script.js  910 bytes  module  [emitted]  module
                              index.html  198 bytes          [emitted]
```

可以看到动态导入的 module_script.js 也会和其他文件一样打包编译，但通过 http://localhost:8080/ 控制台 Elements 以及 Networks 可以看到，该路径下渲染显示的 html 并未请求 module_script.js (import() 中的 webpackMode 默认值为 'lazy')，而仅请求了 script.js，html 中也没有引入 module_script.js

当点击按钮时，页面才会发送网络请求，请求 module_script.js，此时会返回 404 错误，而请求的路径为：http://localhost:8080/module_script.js 而实际上，该资源的正确请求路径为：http://localhost:8080/public/module_script.js (webpack.dev.js 中有设置 devServer.publicPath: '/public/')

可以看到，动态导入的资源的请求路径不受 devServer.publicPath 控制，而受 output.publicPath 控制，再次更改 webpack.base.js

```javascript
output: {
  // 出口文件名
  filename: 'script.js',
  chunkFilename: '[name]_script.js',
  publicPath: '/public/',

  // 出口文件路径
  path: path.resolve(__dirname, 'dist'),
},
```

请求路径：

```bash
devServer.origin + output.publicPath + output.chunkFilename
```

这样就可以动态请求到 module_script.js 了，同时，html 也动态引入了该文件 (默认插入到 head 底部)

```html
<head>
  ...
  <script charset="utf-8" src="/public/module_script.js"></script>
</head> 
```

## shimming

引入 lodash，并应用

./src/index.js

```javascript
import _ from 'lodash';
...
element.innerHTML = _.join(['Hello', 'World'], ' ');
```

./src/module.js

```javascript
import _ from 'lodash';
...
console.log(_.join(['Module has been', 'dynamicly imported!'], ' '));
```

### shimming 全局变量

利用 webpack 插件 ProvidePlugin 将 lodash 设置成全局变量，从而在源码中不需要 import 就可以应用，而 webpack 遇到这些全局变量后，会自动将其加入打包编译文件中

webpack.config.js

```javascript
const webpack = require('webpack');

plugins: [
  new webpack.ProvidePlugin({
    _: 'lodash',
  }),
],
```

在 ./src/index.js 和 ./src/module.js 中直接使用 (不再 import)

```bash
npm run build

# output
Version: webpack 4.20.2
Time: 2052ms
Built at: 2018-11-07 15:20:43
                                   Asset       Size  Chunks             Chunk Names
img/53f4717a650a18c3ef5f081ea05de980.png    279 KiB          [emitted]
                               script.js   2.31 MiB    main  [emitted]  main
                        module_script.js   1.09 KiB  module  [emitted]  module
                              index.html  198 bytes   
```

可以看到 script.js 与 module_script.js 体积都有增大，当只需要用到全局变量的某一个属性时，还可这样设置

webpack.config.js

```javascript
const webpack = require('webpack');

plugins: [
  new webpack.ProvidePlugin({
    // _: 'lodash',
    _join: ['lodash', 'join'],
  }),
],
```

在 ./src/index.js 和 ./src/module.js 中直接使用 (通过 _join 使用)

```bash
npm run build

# output
Version: webpack 4.20.2
Time: 2084ms
Built at: 2018-11-07 18:07:13
                                   Asset       Size  Chunks             Chunk Names
img/53f4717a650a18c3ef5f081ea05de980.png    279 KiB          [emitted]
                               script.js   2.31 MiB    main  [emitted]  main
                        module_script.js    1.1 KiB  module  [emitted]  module
                              index.html  198 bytes          [emitted]
```

> 可以看到，script.js 与 module_script.js 体积并没有如预期的那样有所减小，虽然只用到了 _.join，webpack 仍然将其他的“无用”代码打包编译出来了

ProvidePlugins 的两种用法

```js
new webpack.ProvidePlugin({
  // 某个库
  identifier: 'module1',
  // 某个库下的某个方法
  identifier: ['module1', 'property1'],
});
```

## 配置 babel

安装

```bash
npm install --save-dev babel-loader @babel/core @babel/preset-env
```

- @babel/core

主要用于代码的 transform 和 paser

- @babel/preset-env

preset 为一组功能相关的 plugins 的总称，preset-env 用于将 ES2015+解析转化为 ES5，preset-react 则用于处理 react 相关代码

webpack.base.js

```javascript
module: {
  rules: [
    ...,
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader"
    },
  ]
}
```

.babelrc (babel 配置文件 json)

```json
{
  "presets": [
    "@babel/preset-env"
  ],
  "plugins": []
}
```

```bash
npm run start

# output
ERROR in ./src/index.js
Module build failed (from ./node_modules/babel-loader/lib/index.js):
SyntaxError: /Users/caiheng/workspace/react-init/src/index.js: Support for the experimental syntax 'dynamicImport' isn't currently enabled (5:10):

  3 |
  4 | function dynamicImport() {
> 5 |   return import(/* webpackChunkName: "module" */ './module')
    |          ^
  6 |            .then(({ default: log }) => log());
  7 | }
  8 |

Add @babel/plugin-syntax-dynamic-import (https://git.io/vb4Sv) to the 'plugins' section of your Babel config to enable parsing
```

运行时，会提示 @babel/preset-env 不支持动态导入的写法，需要额外安装插件

```bash
npm install --save-dev @babel/plugin-syntax-dynamic-import
```

并配置 .babelrc

```json
{
  "presets": [
    "@babel/preset-env"
  ],
  "plugins": [
		"@babel/plugin-syntax-dynamic-import"
  ]
}
```

### 配置 @babel/polyfill

安装 @babel/polyfill

```bash
npm install --save @babel/polyfill
```

#### 与 @babel/preset-env 一起使用

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "entry" | 'usage' | false
      }
    ]
  ]
}
```

- "useBuiltIns": "usage"

在 webpack.config.js 以及 source code 中均不需要 import / require @babel/polyfill，如果引入了，babel 会有提示

```bash
npm run start

# output
When setting `useBuiltIns: 'usage'`, polyfills are automatically imported when needed.
Please remove the `import '@babel/polyfill'` call or use `useBuiltIns: 'entry'` instead.
```

- "useBuiltIns": "entry"

需要在 source code 的入口文件的最上方 import / require @babel/polyfill (最上方以确保最先引入 polyfill)

./src/index.js

```javascript
import '@babel/polyfill'; // 最上方引入
...
```

- "useBuiltIns": false (或不设置)

需要在 webpack.config.js 中引入 @babel/polyfill

webpack.base.js

```javascript
entry: {
  polyfill: '@babel/polyfill',  // 入口文件新增 polyfill
  index: './src/index.js',
},
output: {
  filename: '[name]_script.js', // 响应多入口
},
```

./asset/index.html

```html
<!DOCTYPE html>
<html>
<head>
  <title>react-init-asset</title>
  <link rel="stylesheet" href="./asset.css">
  <script src="./public/polyfill_script.js"></script> // 先载入 polyfill
</head>
<body>
  <div>react-init-asset</div>
  <script src="./public/index_script.js"></script>
</body>
</html>
```

npm run start 之后

http://localhost:8080/ 将渲染 /Users/xxx/workspace/react-init/asset/index.html 

> 可以根据环境不同，对 polyfill 进行按需动态加载

http://localhost:8080/public/ 将渲染 HtmlWebpackPlugin 自动生成的 html

```html
<body>
  <script type="text/javascript" src="/public/polyfill_script.js"></script>
  <script type="text/javascript" src="/public/index_script.js"></script>
  ...
</body>
```

> 为了让 polyfill 先加载运行，应将其排在入口文件的第一位

#### 单独配置 @babel/polyfill

配置方法与"useBuiltIns": false (或不设置) 采用的方法相同，即用 webpack 来配置多入口文件

这两种情况还有一种不推荐的做法，即直接在 source code 的入口文件最上方引入 polyfill

./src/index.js

```javascript
import '@babel/polyfill'; // 最上方引入
...
```

## 配置 sass

安装 [node-sass](https://github.com/sass/node-sass) 与 [sass-loader](https://github.com/webpack-contrib/sass-loader)

```bash
npm install sass-loader node-sass --save-dev
```

webpack.base.js

```javascript
{
  // 正则匹配
  test: /\.(css|scss)$/,
  // 从右向左依次 loader
  use: [
    "style-loader", // creates style nodes from JS strings
    "css-loader", // translates CSS into JS strings
    "sass-loader" // compiles Sass to CSS, using Node Sass by default
  ],
}
```

./src/style.css => ./src/style.scss

./src/_part.css => ./src/\_part.scss

### 分离 css

安装插件 [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)

```bash
npm install --save-dev mini-css-extract-plugin
```

利用 mini-css-extract-plugin 插件的 loader 代替 style-loader 以使 css 从 js 中分离出来

webpack.base.js

```javascript
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  plugins: [
    ...
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
  ],
  module: {
    rules: [
      ...
      {
        // 正则匹配
        test: /\.(css|scss)$/,
        // 从右向左依次 loader
        use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader' ],
      },
    ]
  },
};
```

./asset/index.html (引入分离出来的 css)

```html
<head>
  ...
  <link rel="stylesheet" href="./public/style.css">
</head>
```

npm run start 后，http://localhost:8080/ 渲染的 ./asset/index.html 便应用到了该样式