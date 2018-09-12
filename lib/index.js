const render = require('./generateRoute');
const chokidar = require('chokidar');
const path = require('path');
const allParams= require('./params');
const env = process.env.NODE_ENV;

function compareParams(items){
    let params=items?items:{};
    for(let item in allParams){
        if(!params[item]&&typeof(params[item])!='boolean'){
          params[item]=allParams[item];
        }
     }
     return params;
}

function auto(items) {
    let params=compareParams(items);
    const templateFile = chokidar.watch(params.inPath);
    render(params)
    if(env === 'production'){
        return ;
    }
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
module.exports = auto;