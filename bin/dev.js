const path = require('path')
const { getTotalFiles } = require('../app/utils')
const { apiAssemble } = require('../app/main')
const chalk = require('chalk');
const args = require('minimist')(process.argv.slice(2))
const mode = args['mode']
const searchMode = require('../search.test.json')
const { api,appName="wsc-pc-vis" } = searchMode[mode] || {}
const routersPath = path.join(__dirname, `../app/static-project/${appName}/app/routers`)
const routerFileList = getTotalFiles(routersPath, ['.js'])
let findApiResult = null
for (let i = 0; i < routerFileList.length;i++) {
  const routerPath = routerFileList[i]
  const apiArr = require(routerPath.replace('.ts', '.js'))
  findApiResult = apiArr.find(apiItem => {
    const jsonApi = apiItem[1]
    if (Array.isArray(jsonApi)) {
      return jsonApi.some(item => item.indexOf(api) !== -1)
    } else {
      return jsonApi.indexOf(api) !== -1
    }
  })
  if (findApiResult) {
    break;
  }
}
console.log(chalk.blue('解析结果：'),apiAssemble(appName,findApiResult))