
const render = require('./generateRoute');
const chokidar = require('chokidar');
const path = require('path');
const env = process.env.NODE_ENV;


//webpack插件
function FileListPlugin (options) {
  this.newParams = options;
}

FileListPlugin.prototype.apply = function (compiler) {
  var defaultParams={
    fileName:'newRouter.js',
    inPath:path.resolve(compiler.options.context,'./src/pages'),
    outPath:path.resolve(compiler.options.context,'./src/router'),
    srcDir:'pages',
    filterSuffix:'.vue'
  }
  let params=compareParams(this.newParams,defaultParams);
  auto(params)
}
module.exports = FileListPlugin;



//是否传參
function compareParams(newParams,oldParams){
  let params=newParams?newParams:{};
  for(let item in oldParams){
      if(!params[item]){
        params[item]=oldParams[item];
      }
   }
   return params;
}



//监听调用
function auto(params) {
  render(params)
  if(env === 'production'){
      return ;
  }
  const templateFile = chokidar.watch(params.inPath);
  //文件变动监听(增加、删除文件夹，增加、删除文件，文件内容发生变化)
  templateFile.on('ready', () => {
      templateFile.on('add', (path) => {
          render(params);
      });
      templateFile.on('unlink', (path) => {
          render(params);
      });
      templateFile.on('addDir', (path) => {
          render(params);
      });
      templateFile.on('unlinkDir', (path) => {
          render(params);
      });
      templateFile.on('change', (path) => {
          render(params);
      });
  })

}

 