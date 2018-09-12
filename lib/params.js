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

/**
     * inPath:目标遍历文件夹
     * outPath:路由输出文件
     * firstPathName:目标文件夹名
     * filterFile:只生成的文件路径
     * isUseDynamic:是否需要生成动态路由
     * isUseNest:是否需要生成嵌套路由(还没做)
     * filterSuffix:只生成的后缀路径
     */