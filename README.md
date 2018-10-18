# webpack 安装

```bash
npm install --save-dev webpack
npm install --save-dev webpack-cli
# 4.0 以后版本的 webpack 和 webpack-cli 分离，需分别安装
```

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
    path: path.resolve(__dirname, 'dist'), // Node 环境下，__dirname 为当前文件所在的绝对路径
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

安装 css-loader

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

安装 css-loader

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

安装 css-loader

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

鼠标悬浮时会显示图片路径：

file:///project_local_path/53f4717a650a18c3ef5f081ea05de980.png

可以看到，webpack 复制的图片不在此路径上，而在：

file:///project_local_path/dist/53f4717a650a18c3ef5f081ea05de980.png

因此无法显示该图片