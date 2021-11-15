const fs = require('fs')
const path = require('path')
const downloadTask = require('../app/src/download')
const { main: mainTask, componentMain: componentMainTask } = require('../app/main')
const { delDir } = require('../app/utils')
const child_process = require('child_process');

// 任务顺序
function taskList() {
  // return
  // 先删除static-project文件夹
  const staticProjectPath = path.join(__dirname, '../app/static-project')
  fs.existsSync(staticProjectPath) && delDir(staticProjectPath)
  // 创建static-project文件夹
  fs.mkdirSync(staticProjectPath)
  // 下载项目文件
  downloadTask()
    .then(res => {
      child_process.exec('npm run tsc', err => {
        if (err) {
          // console.log('ts文件格式转化报错：', err)
          // return
        }
        componentMainTask(res)
        // mainTask(res)
      })
    })
}

taskList()