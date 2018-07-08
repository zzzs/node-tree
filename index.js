// 模拟 Linux tree功能
const fs = require('fs');

var clc = require('cli-color');
var dirStyle = clc.xterm(18).bgXterm(29);

var params = process.argv.splice(2);

let level;
if (params[1]) {
    level = parseInt(params[1]);
    if (isNaN(level) || level <= 0) {
        console.log('tree: Invalid level, must be greater than 0.');
        return;
    }
} else {
    level = 0;
}

// 计算节点前的字符
let getPreStr = function (num) {
    let str = '';
    for (var i = 0; i < num - 1; i++) {
        str += '│   ';
    }
    return str;
}

let curLevel = level;
// 父级节点
let nodeData = {};

let outputTree = function (dirname, isOneLevel) {
    if (isOneLevel) {
        console.log(dirname);
    }
    let files = fs.readdirSync(dirname, 'utf-8');

    let fileLen = files.length;
    if (fileLen !== 0) {
        for (var i = 0; i < fileLen; i++) {
            let itemFile = files[i];
            if (isOneLevel) {
                nodeData[dirname + '/' + itemFile] = [dirname]
            } else {
                nodeData[dirname + '/' + itemFile] = nodeData[dirname].concat([dirname])
            }
            let stat = fs.statSync(dirname + '/' + itemFile);

            let preStr = getPreStr(nodeData[dirname + '/' + itemFile].length);

            if (i === fileLen -1) {
                preStr += '└── ';
            } else {
                preStr += '├── ';
            }

            if (stat.isDirectory()) {
                console.log(preStr + dirStyle(itemFile));
                if (level === 0 || curLevel - 1 > 0) {
                    outputTree(dirname + '/' + itemFile);
                }
            } else {
                console.log(preStr + itemFile);
            }
        }
        if (level !== 0) {
            curLevel--;
            if (curLevel <= 0) {
                return;
            }
        }
    }
}

outputTree('.', 1);
