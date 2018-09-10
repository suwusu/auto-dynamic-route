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
    let itemParam = param.split(params.firstPathName)[1];
    let switchItem = itemParam.split('.')[0].split('/');
    let nameStr = '';
    let pathStr='';
    let componentStr='';
    
    switchItem.map((item, index) => {
        if (item&&item!='index') {
            var renderPath=item;
            var renderName=item.replace('_','');
            if(params.isUseDynamic){
                let middlePath=item.replace('_',':');
                if(middlePath.indexOf(':')!=-1){
                    renderPath=middlePath;
                }
            }
            nameStr = nameStr ? nameStr + '-' + renderName : renderName;
            pathStr=pathStr?pathStr+'/'+renderPath:renderPath;
            componentStr=componentStr?componentStr+'/'+item:item;
        }
    })
    let obj = result;
    obj= obj.replace(pathReg,'/'+pathStr)
    obj= obj.replace(nameReg,nameStr)
    obj= obj.replace(componentReg,params.firstPathName+'/'+componentStr)  
    newRou.push(obj);
    
    return newRou
}

function render(params){
    let filesList = geFileList(nodePath.join(__dirname,params.inPath));
    let filterArr=params.filterSuffix.split(',');
    let renderRoute=[];
    for (var i = 0; i < filesList.length; i++) {
        let isChoose=filesList[i].indexOf('index') != -1;
        let filesListSplit=filesList[i].split('.')[1];
        let isFilter=filterArr.indexOf(filesListSplit);
        if(isFilter!=-1){
            continue ;
        }
        if(params.isOnlyIndex&&isChoose){
           renderRoute=renderRoute.concat(formatOptimize(filesList[i],params));
        }else if(!params.isOnlyIndex){
           renderRoute=renderRoute.concat(formatOptimize(filesList[i],params));
        }
    }
    
    strs='export default {routes:['+renderRoute+']}';
    writeFile(nodePath.join(__dirname,params.outPath+'/'+params.routeName+'.js'),strs);
}

module.exports=render