const fs = require('fs')
const path = require('path')
const rootPath = process.cwd()

const getConfig = () => {
  const config = fs.readFileSync(`${rootPath}/config.json`).toString()
  return JSON.parse(config)
}

const getApiData = (appName = getConfig().map(item => item.name)) => {
  let result = []
  appName.forEach(appName => {
    try {
      const dataPath = `${rootPath}/app/data/${appName}.json`
      result = [...result, ...JSON.parse(fs.readFileSync(dataPath))]
    } catch (err) {
      console.log('获取数据失败：', appName + ':' + err)
    }
  })
  return result
}
module.exports = {
  getConfig,
  getApiData
}