# auto-dynamic-routes

## [版本更新说明](version/intro.md)

## 安装

```
npm i --save-dev auto-dynamic-routes

yarn add --dev auto-dynamic-routes

```

```
这是一款自动路由插件,可以自定义要遍历的位置和输出的位置，以及一些参数传递

```


## 参数

```
/**
     * inPath:遍历的目标文件夹
     * outPath:输出目标文件位置
     * srcDir:遍历的文件夹名
     * fileName:输出的文件名
     * filterSuffix:可生成的后缀路径
     */

这是我的默认值(不自定义参数就会走我的默认)：
const path = require('path')
var params ={
    fileName:'newRouter.js',
    inPath:path.resolve(compiler.options.context,'./src/pages'),
    outPath:path.resolve(compiler.options.context,'./src/router'),
    srcDir:'pages',
    filterSuffix:'.vue'
}

```


## 引用

webpack.config.js

```
const AutoDynamicPlugin = require('auto-dynamic-routes');  

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'index_bundle.js'
  },
  plugins: [
    new AutoDynamicPlugin({filterSuffix:'index.vue,detail.vue,.js'})
  ]
}

``` 


## 生成的路由格式

```
目前格式：
  export default {routes:[{
    path:'/wslceye/:ww/detail',
    name:'wslceye-ww-detail',
    component:()=>import('components/wslceye/_ww/detail')
},{
    path:'/data-adjustment/operate',
    name:'data-adjustment-operate',
    component:()=>import('pages/data-adjustment/operate')
},{
    path:'/wslceye',
    name:'wslceye',
    component:()=>import('pages/wslceye') 
}]}

```
