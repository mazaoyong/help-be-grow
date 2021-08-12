const schedule = require('node-schedule')
const fs = require('fs')
const path = require('path')
const downloadTask = require('./src/download')
const mainTask = require('./main')
const { delDir } = require('./utils')
const child_process = require('child_process');

// 任务顺序
function taskList() {
  // 先删除static-project文件夹
  const staticProjectPath = path.join(__dirname, './static-project')
  fs.existsSync(staticProjectPath) && delDir(staticProjectPath)
  // 创建static-project文件夹
  fs.mkdirSync(staticProjectPath)
  // 下载项目文件
  downloadTask()
    .then(res => {
      child_process.exec('tsc', err => {
        if (err) {
          console.log('ts文件格式转化报错：', errr)
          return
        }
        mainTask(res)
      })
    })
}
taskList()
// 每天的凌晨2点更新代码
schedule.scheduleJob('0 0 2 * * *', () => {
  taskList()
})