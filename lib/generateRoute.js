const fs = require('fs')
const nodePath = require('path')
//模版文件
const template = nodePath.resolve(__dirname+'/auto.router.js')
 var isWin = /^win/.test(process.platform);
console.log("oooooooo",isWin)
 //读取目录的内容
function readdirPromisify(dir) {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, list) => {
            if (err) {
                reject(err);
            }
            resolve(list);
        });
    });
}

//获取文件数组
function getFilesPromisify(dir) {
        let stats = fs.statSync(dir);
        if (stats.isDirectory()) {
            return readdirPromisify(dir).then(list =>
                Promise.all(list.map(item =>
                    getFilesPromisify(nodePath.resolve(dir, item))
                ))
            ).then(subtree => [].concat(...subtree));
        } else {
            return [dir];
        }
}



function complete() {
    console.log("文件生成成功");
}

//写入文件utf-8格式
function writeFile(fileName, data) {
    fs.writeFileSync(fileName, data, complete);
}


function pathResolve(path){   
    return path
}

//生成需要的路径模版
function formatOptimize(param,params){
    let result = fs.readFileSync(template, {encoding: 'utf-8'});
    let newRou = [];
    let pathReg = new RegExp('\\$\\{path\\}', 'ig');
    let nameReg = new RegExp('\\$\\{name\\}', 'ig');
    let componentReg = new RegExp('\\$\\{component\\}', 'ig');
    let pageNext = param.split(pathResolve(params.srcDir))[1];
    //动态路由
    let switchSrc=pageNext.replace(/_/g,':');
    let firstItem = switchSrc.split('.')[0].split('/');
    if(isWin){
        firstItem = switchSrc.split('.')[0].split(/\\/g);
    }
    let endPath=firstItem[firstItem.length-1];
    let thirdItem=firstItem;
    if(endPath=='index'){
        thirdItem=firstItem.slice(0,firstItem.length-1);
    }
    let nameStr = '';
    let pathStr='';
    
    //循环拼接
    thirdItem.map((item, index) => {      
        let renderName=item.replace(/:/g,'');
        nameStr = nameStr ? nameStr + '-' + renderName : renderName;
        pathStr=pathStr?pathStr+'/'+item:item;
    })
    nameStr=nameStr?nameStr:endPath;
    

    if(isWin){
        pathStr = pathStr.replace(/\\/g,'/')
        nameStr = nameStr.replace(/\\/g,'-')
        param=param.replace(/\\/g,'/')
    }
    result= result.replace(pathReg,'/'+pathStr)
    result= result.replace(nameReg,nameStr)
    result= result.replace(componentReg,param)  
    newRou.push(result);
    return newRou
}

function render(params){
    getFilesPromisify(params.inPath).then(filesList=>{
        let filterSuffixArr=params.filterSuffix.split(',');
        let renderRoute=[];
        for (var i = 0; i < filesList.length; i++) {
            //过滤生成的文件
            filterSuffixArr.map((item,index)=>{
                let isFilterSuffix=filesList[i].indexOf(item);
                if(isFilterSuffix!=-1){
                    renderRoute=renderRoute.concat(formatOptimize(filesList[i],params));
                }
            })
        }
        
        strs='export default {routes:['+renderRoute+']}';
        writeFile(params.outPath+'/'+params.fileName,strs);
    })
}

module.exports=render