const child_process = require('child_process');
const path = require('path')
const startPath = path.resolve(__dirname, '../gen-data.sh')
child_process.exec(startPath, err => {
  if (err) {
    console.log('启动报错：', err)
    return
  }
  console.log('后台运行中')
})
