const child_process = require('child_process');
child_process.exec('npm run build', err => {
  if (err) {
    console.log('打包报错：', err)
  }
  require('../app/index.js')
})