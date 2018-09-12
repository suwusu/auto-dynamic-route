# 自动路由和动态路由

## 安装

```
yarn add --dev auto-dynamic-routes 或者  npm install都可以

```

## 传參

```
/**
     * inPath:目标遍历文件夹
     * outPath:路由输出文件
     * firstPathName:目标文件夹名
     * filterFile:只生成的文件路径
     * isUseDynamic:是否需要生成动态路由
     * isUseNest:是否需要生成嵌套路由(还没做)
     * filterSuffix:只生成的后缀路径
     */

我包内写着默认值：
const nodePath = require('path')
module.exports ={
    inPath:nodePath.join(__dirname,'../../../src/pages'),
    outPath:nodePath.join(__dirname,'../../../src/router/newRouter.js'),
    firstPathName:'pages',
    filterFile:'index',
    isUseDynamic:true,
    isUseNest:false,
    filterSuffix:'vue,js,html'
}

```

## 引用

```
//require引用即可
const autoRoute = require('auto-dynamic-routes');
//可以什么也不写调用，也可以自定义上面的所有或者个别参数
autoRoute();
包内有文件夹和文件变动监听所以项目启动后可以自动识别修改

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

## 持续优化中，有什么建议可以随时交流
