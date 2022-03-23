const path = require('path')
const fs = require('fs')
const chalk = require('chalk')

// 获取文件目录下的所有指定类型的文件
const getTotalFiles = (filePath, type = ['.js', '.ts']) => {
  let fileList = []
  //根据文件路径读取文件，返回文件列表
  try {
    const files = fs.readdirSync(filePath)
    //遍历读取到的文件列表
    files.forEach(function (filename) {
      //获取当前文件的绝对路径
      const filedir = path.join(filePath, filename);
      //根据文件路径获取文件信息，返回一个fs.Stats对象
      const stats = fs.statSync(filedir)
      if (stats.isFile() && type.includes(path.extname(filedir))) { // 文件
        fileList.push(filedir)
      } else if (stats.isDirectory()) { // 文件夹
        fileList = [...fileList, ...getTotalFiles(filedir, type)]
      }
    })
  } catch (err) {
    console.warn(err)
  }
  return fileList
}

// 删除文件夹
function delDir(path) {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach((file, index) => {
      let curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) {
        delDir(curPath); //递归删除文件夹
      } else {
        fs.unlinkSync(curPath); //删除文件
      }
    });
    fs.rmdirSync(path);  // 删除文件夹自身
  }
}

// 判断文件路径是js还是ts
function getJsFileRealPath(filePath) {
  let result = {
    path: filePath,
    isTs: false
  }
  try {
    fs.accessSync(filePath, fs.constants.F_OK)
  } catch {
    result = {
      path: filePath.replace(/\.js/g, '.ts'),
      isTs: true
    }
  }
  return result
}

module.exports = {
  getTotalFiles,
  delDir,
  getJsFileRealPath
}