/*
    实现Linux tree -L功能, 另外支持可展示任意目录的目录树
    node index.js -L [level] [dir]
    level: 展示目录级数, 默认0, 展示所有
    dir: 展示的目录, 默认'.', 当前展示目录
 */
const fs = require('fs');

const clc = require('cli-color');
const dirStyle = clc.xterm(18).bgXterm(29);

const params = process.argv.splice(2);

// 展示层级 默认0（展示所有）
let level = 0;
if (params[1]) {
    level = parseInt(params[1]);
    if (isNaN(level) || level < 0) {
        console.log('tree: Invalid level, must be greater than or equal 0.');
        return;
    }
}

// 展示的目录 默认当前
let showDir = params[2] || '.';

// 父级节点
let pNodeData = {};
// 最后一级节点
let lastNodeData = [];
// 目录数
let dirNum = 0;
// 文件数
let fileNum = 0;

// 计算节点前的字符
let getPreStr = function (pNode) {
    const num = pNode.length;
    let str = '';
    for (var i = 1; i <= num - 1; i++) {
        if (lastNodeData.indexOf(pNode[i]) >= 0) {
            str += '    ';
        } else {
            str += '│   ';
        }
    }
    return str;
}

const outputTree = function (dirname, isOneLevel) {
    if (isOneLevel) {
        console.log(dirStyle(dirname));
    }
    const files = fs.readdirSync(dirname, 'utf-8');

    const fileLen = files.length;
    if (fileLen !== 0) {
        for (let i = 0; i < fileLen; i++) {
            let itemFile = files[i];
            if (isOneLevel) {
                pNodeData[dirname + '/' + itemFile] = [dirname]
            } else {
                pNodeData[dirname + '/' + itemFile] = pNodeData[dirname].concat([dirname])
            }

            // 目录节点前面的字符
            let preStr = getPreStr(pNodeData[dirname + '/' + itemFile]);
            // 是否是当前目录最后一个
            if (i === fileLen -1) {
                preStr += '└── ';
                lastNodeData.push(dirname + '/' + itemFile);
            } else {
                preStr += '├── ';
            }

            const stat = fs.statSync(dirname + '/' + itemFile);
            // 是否是目录
            if (stat.isDirectory()) {
                dirNum++;
                console.log(preStr + dirStyle(itemFile));
                if (level === 0 || level > pNodeData[dirname + '/' + itemFile].length ) {
                    outputTree(dirname + '/' + itemFile);
                }
            } else {
                fileNum++;
                console.log(preStr + itemFile);
            }
        }
    }
}

outputTree(showDir, 1);
console.log('\n' + dirNum + ' directories, ' + fileNum + ' files');
