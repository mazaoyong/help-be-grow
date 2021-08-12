const AstGetter = require('./src/AstGetter')
const { getTotalFiles } = require('./utils')
const path = require('path')
const fs = require('fs')
const schedule = require('node-schedule')

// 通过jsonApi搜索业务
function getNavigator(appName, jsonApi) {
  const clientPageDir = path.join(__dirname, './static-project/', appName, '/client/pages')
  const apiMatch = jsonApi.match(/\/[^/]+$/)
  const keyword = [jsonApi.slice(0, apiMatch.index), apiMatch[0]]
  return getTotalFiles(clientPageDir).filter(clientPageFilePath => {
    const fileStr = fs.readFileSync(clientPageFilePath)
    if (fileStr.indexOf(keyword[0]) !== -1 && fileStr.indexOf(keyword[1]) !== -1) {
      return true
    }
    return false
  })
}
// 处理每个json接口导航
function apiAssemble(appName, api) {
  // 将router里面的api组装成为对象
  let result = []
  if (!Array.isArray(api[0]) && !Array.isArray(api[2])) { // 不考虑请求方法或者对应的controller是多个的情况
    const controllerSuffixPath = `/app/controllers/${api[2].replace(/\./g, '/')}.js`
    const controllerPath = path.join(__dirname, './static-project/', appName, controllerSuffixPath)
    const astObj = new AstGetter(controllerPath)

    const jsonApi = Array.isArray(api[1]) ? api[1] : [api[1]]
    const controllerMethod = Array.isArray(api[3]) ? api[3] : [api[3]]

    jsonApi.forEach(jsonApiItem => {
      controllerMethod.forEach(controllerFunc => {
        astObj.getServicePath(controllerFunc).forEach(service => {
          const { path: servicePath, func: serviceFunc } = service
          const serviceAstObj = new AstGetter(path.join(__dirname, './static-project/', appName, '/app', servicePath))
          result.push({
            "AppName": appName,
            "JavaApi": serviceAstObj.getJavaApi(serviceFunc),
            "JsonApi": jsonApiItem,
            "Navigator": getNavigator(appName, jsonApiItem.replace('/v4/vis', '')).map(item => item.match(/\/client\/pages\/.+/)[0]),
            // "Navigator2": getNavigator(appName, jsonApiItem.replace('/v4/vis', '')),
            "Controller": controllerSuffixPath,
            "Service": '/app/' + service.path
          })
        })
      })
    })
  }
  return result
}

module.exports = (projectInfo) => {
  // 纪录每次花费的时间
  const start = new Date().getTime()
  // 更新的状态，1是成功，2是异常，-1是失败
  let updateState = {
    status: 1,
    info: '正常'
  }

  // 核心流程
  try {
    projectInfo.forEach(item => {
      const appName = item.name
      const routersPath = path.join(__dirname, `./static-project/${appName}/app/routers`)
      const routerFileList = getTotalFiles(routersPath)
      let data = []
      routerFileList.forEach(routerPath => {
        const apiArr = require(routerPath.replace('.ts', '.js'))
        apiArr.forEach(apiItem => {
          // 先把数据全部存起来，没有报错之后才更新数据
          data = [...data, ...apiAssemble(appName, apiItem)]
        })
      })
      const dataFilePath = path.join(__dirname, `./data/${appName}.json`);
      // 先把昨天的数据备份，在生成新的数据，每周日备份数据（不包括周日的数据）
      fs.rename(dataFilePath, dataFilePath.replace('.json', new Date().getDay() === 0 ? '.b.json' : '.json'), err => {
        if (err) {
          updateState = {
            status: 2,
            info: '备份数据失败，错误信息：' + err
          }
        }
        fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), err => {
          if (err) {
            updateState = {
              status: 2,
              info: '写入数据失败，错误信息：' + err
            }
          }
        })
      })
    })
  } catch (err) {
    updateState.status = -1;
    updateState.info = '更新数据失败,错误信息：' + err || '未知'
  }


  const spend = new Date().getTime() - start
  const updateLogPath = path.join(__dirname, 'update_log.json')
  fs.readFile(updateLogPath, (err, data) => {
    let updateLog = []
    if (err) {
      // 找不到文件
    } else {
      updateLog = JSON.parse(data)
    }
    updateLog.push({
      // 更新所花费的时间
      spend,
      // 更新结束时间
      updateEndTime: new Date().getTime(),
      ...updateState
    })
    fs.writeFileSync(updateLogPath, JSON.stringify(updateLog, null, 2))
    console.log('更新完成')
  })
}