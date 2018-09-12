const fs = require('fs')
const nodePath = require('path')
const template = nodePath.resolve(__dirname+'/auto.router.js')
// co
//遍历文件夹，获取所有文件夹里面的文件信息
/*
 * @param path 路径
 *
 */

function geFileList(path) {
    let filesList = [];
    readFile(path, filesList);
    return filesList;
}

//遍历读取文件
function readFile(path, filesList) {
    files = fs.readdirSync(path);//需要用到同步读取
    files.forEach(walk);
    function walk(file) {
        states = fs.statSync(path + '/' + file);
        if (states.isDirectory()) {
            readFile(path + '/' + file, filesList);
        }
        else {
            var paths = path + '/' + file;
            filesList.push(paths);
        }
    }
}

//写入文件utf-8格式
function writeFile(fileName, data) {
    fs.writeFile(fileName, data, complete);
    function complete() {
        console.log("文件生成成功");
    }
}


function formatOptimize(param,params){
    let result = fs.readFileSync(template, {encoding: 'utf-8'});
    let newRou = [];
    let pathReg = new RegExp('\\$\\{path\\}', 'ig');
    let nameReg = new RegExp('\\$\\{name\\}', 'ig');
    let componentReg = new RegExp('\\$\\{component\\}', 'ig');
    let pageNext = param.split(params.firstPathName+'/')[1];
    let firstItem = pageNext.split('.')[0].split('/');
    let secondItem=firstItem[firstItem.length-1];
    let thirdItem=firstItem.slice(0,firstItem.length-1);
    let nameStr = '';
    let pathStr='';
    let componentStr='';
    
    if(!thirdItem.length){
        nameStr=secondItem;
        componentStr=secondItem;
    }else{
        thirdItem.map((item, index) => {
            let renderPath=item;
            let renderName=item.replace('_','');
            //动态路由
            if(params.isUseDynamic){
                let middlePath=item.replace('_',':');
                if(middlePath.indexOf(':')!=-1){
                    renderPath=middlePath;
                }
            }
            nameStr = nameStr ? nameStr + '-' + renderName : renderName;
            pathStr=pathStr?pathStr+'/'+renderPath:renderPath;
            componentStr=componentStr?componentStr+'/'+item:item;
        })
        nameStr=nameStr+'-'+secondItem;
        pathStr=pathStr+'/'+secondItem;
        componentStr=componentStr+'/'+secondItem;
    }
    
    let obj = result;
    obj= obj.replace(pathReg,'/'+pathStr)
    obj= obj.replace(nameReg,nameStr)
    obj= obj.replace(componentReg,params.firstPathName+'/'+componentStr)  
    newRou.push(obj);
    
    return newRou
}

function render(params){
    let filesList = geFileList(params.inPath);
    let filterSuffixArr=params.filterSuffix.split(',');
    let filterFileArray=params.filterFile.split(',');
    let renderRoute=[];
    for (var i = 0; i < filesList.length; i++) {
        //过滤生成的文件后缀和文件
        let filesListSplit=filesList[i].split('.');
        let filesListFirst=filesListSplit[1];
        let filesListSecond=filesListSplit[0].split('/');
        let filesListThird=filesListSecond[filesListSecond.length-1];
        let isFilterSuffix=filterSuffixArr.indexOf(filesListFirst);
        let isFilterFile=filterFileArray.indexOf(filesListThird);
        if(isFilterSuffix==-1||isFilterFile==-1){
            continue ;
        }
        renderRoute=renderRoute.concat(formatOptimize(filesList[i],params));
    }
    
    strs='export default {routes:['+renderRoute+']}';
    writeFile(params.outPath,strs);
}

module.exports=render