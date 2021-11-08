const schedule = require('node-schedule')
const fs = require('fs')
const path = require('path')
const downloadTask = require('./src/download')
const { main: mainTask, componentMain: componentMainTask } = require('./main')
const service = require('./src/service')
const { delDir } = require('./utils')
const child_process = require('child_process');
// 任务顺序
function taskList() {
  // return
  // 先删除static-project文件夹
  const staticProjectPath = path.join(__dirname, './static-project')
  fs.existsSync(staticProjectPath) && delDir(staticProjectPath)
  // 创建static-project文件夹
  fs.mkdirSync(staticProjectPath)
  // 下载项目文件
  downloadTask()
    .then(res => {
      child_process.exec('npm run tsc', err => {
        if (err) {
          console.log('ts文件格式转化报错：', err)
          // return
        }
        mainTask(res)
        componentMainTask(res)
      })
    })
}

// 每天的凌晨2点更新代码
schedule.scheduleJob('0 0 2 * * *', () => {
  taskList()
})

// 先打包再服务器启动
child_process.exec('npm run build', err => {
  if (err) {
    console.log('静态页面打包错误：', err)
  }
  service()
  taskList()
})