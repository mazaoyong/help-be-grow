const AstGetter = require('./src/AstGetter')
const { getTotalFiles, getJsFileRealPath, getRealAppPath } = require('./utils')
const path = require('path')
const fs = require('fs')
const chalk = require('chalk');
const ProgressBar = require('progress');

const rd = require('rd');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const EBIZ_COMPONENTS = '@youzan/ebiz-components';
const VIS_COMPONENTS = '@youzan/vis-ui';
const RC_COMPONENTS = '@youzan/react-components';
const VANT_COMPONENTS = 'vant';

// 通过jsonApi搜索业务
function getNavigator(appName, jsonApi) {
  let clientPageDir = path.join(__dirname, './static-project/', appName, '/client/pages')
  clientPageDir = getRealAppPath(clientPageDir, appName)
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
    let controllerSuffixPath = `/app/controllers/${api[2].replace(/\./g, '/')}.js`
    let controllerPath = getJsFileRealPath(path.join(__dirname, './static-project/', appName, controllerSuffixPath), appName)
    if (controllerPath.isTs) {
      controllerSuffixPath = controllerSuffixPath.replace(/\.js/g, '.ts')
    }
    controllerPath = controllerPath.path
    const astObj = new AstGetter(controllerPath)

    const jsonApi = Array.isArray(api[1]) ? api[1] : [api[1]]
    const controllerMethod = Array.isArray(api[3]) ? api[3] : [api[3]]

    jsonApi.forEach(jsonApiItem => {
      controllerMethod.forEach(controllerFunc => {
        astObj.getServicePath(controllerFunc).forEach(service => {
          const { path: servicePath, func: serviceFunc } = service
          let serviceAstObj = null
          try {
            serviceAstObj = new AstGetter(getJsFileRealPath(path.join(__dirname, './static-project/', appName, '/app', servicePath), appName).path)
          } catch {
            serviceAstObj = ''
          }
          result.push({
            "appName": appName,
            "javaApi": serviceAstObj && serviceAstObj.getJavaApi(serviceFunc),
            "jsonApi": jsonApiItem,
            "navigator": ['wsc-pc-vis', 'wsc-h5-vis'].includes(appName) ? getNavigator(appName, jsonApiItem.replace('/v4/vis', '')).map(item => item.match(/\/client\/pages\/.+/)[0]) : [],
            // "Navigator2": getNavigator(appName, jsonApiItem.replace('/v4/vis', '')),
            "controller": controllerSuffixPath,
            "service": '/app/' + service.path
          })
        })
      })
    })
  }
  return result
}

let errRouterPath = ''
const main = (projectInfo) => {
  const updateLog = []
  // 更新的状态，1是成功，2是异常，-1是失败
  let updateState = {
    status: 1,
    info: '正常'
  }

  // 核心流程
  try {
    projectInfo.forEach(item => {
      // 纪录每次花费的时间
      const start = new Date().getTime()
      const appName = item.name
      let routersPath = getRealAppPath(path.join(__dirname, `./static-project/${appName}/app/routers`), appName)
      const routerFileList = getTotalFiles(routersPath, ['.js'])
      let data = []
      let apiArr = []
      routerFileList.forEach(routerPath => {
        errRouterPath = routerPath
        try {
          apiArr = [...apiArr, ...require(routerPath.replace('.ts', '.js'))]
        } catch (err) {
          console.log('路由文件非纯数组：' + routerPath)
        }
      })
      // 终端进度条展示
      const pb = new ProgressBar(`${chalk.blue(appName.padEnd(15, ' '))} 解析进度: :percent [:bar] :current/:total`, { total: apiArr.length, width: 50, complete: chalk.green('█'), incomplete: '░' })
      apiArr.forEach(apiItem => {
        // 先把数据全部存起来，没有报错之后才更新数据
        data = [...data, ...apiAssemble(appName, apiItem.length > 4 ? apiItem.slice(1) : apiItem)]
        pb.tick()
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
        // 先创建文件夹
        fs.mkdir(path.resolve(__dirname, './data/'), () => {
          fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), err => {
            if (err) {
              updateState = {
                status: 2,
                info: '写入数据失败，错误信息：' + err
              }
            }
            const spend = new Date().getTime() - start
            const updateLogPath = path.join(__dirname, 'update_log.json')
            updateLog.push({
              // 应用名称
              appName,
              // 更新所花费的时间
              spend,
              // 更新结束时间
              updateEndTime: new Date().getTime(),
              ...updateState
            })
            fs.writeFileSync(updateLogPath, JSON.stringify(updateLog, null, 2))
            console.log(chalk.green(appName.padEnd(15, ' ')), '数据更新完成')
          })
        })
      })
    })
  } catch (err) {
    updateState.status = -1;
    updateState.info = '更新数据失败,错误信息：' + err || '未知'
    console.log(err, chalk.red(errRouterPath))
  }
}

const handleVueFile = (file) => {
  const start = file.indexOf('<script');
  if (start === -1) {
    return '';
  }
  const sliceFile = file.slice(start);
  const _vueCheckReg = sliceFile.match(
    /<script(?:\s+[^\u007F-\u009F "'>/=]+(?:=\s*(?:[^\s"'=<>`]+|'[^']+'|"[^"]+"))?)*\s*>/,
  )
  const vueCheckReg = _vueCheckReg && _vueCheckReg[0];
  const end = file.lastIndexOf('</script>');
  const _file = file.slice(start + ((vueCheckReg && vueCheckReg.length) || 0), end);

  return _file;
}

const file2babelAst = (file, filename) => {
  try {
    if (/\.ts$/.test(filename)) {
      return parser.parse(file, {
        sourceType: 'module',
        plugins: ['dynamicImport', 'classProperites', 'typescript', 'decorators-legacy'],
      });
    } else {
      return parser.parse(file, {
        sourceType: 'module',
        plugins: ['jsx', 'dynamicImport', 'classProperites', 'typescript', 'decorators-legacy'],
      });
    }
  } catch (err) {
    console.log('err!!!!!!!!', filename, err);
    return null;
  }
}

const astAnalysis = (astFile) => {
  const componentList = new Set();

  traverse(astFile, {
    enter(path) {
      if (path.isImportDeclaration()) {
        if (path.node.source.value.includes(EBIZ_COMPONENTS)
          || path.node.source.value.includes(VIS_COMPONENTS)
          || path.node.source.value.includes(RC_COMPONENTS)
          || path.node.source.value.includes(VANT_COMPONENTS)
        ) {
          path.node.specifiers.forEach(specifier => {
            if (specifier.type === 'ImportSpecifier' && specifier.imported.type === 'Identifier') {
              componentList.add(specifier.imported.name);
            }
          });
        }
      }
    },
  });

  return Array.from(componentList);
}

const componentMain = (projectInfoList) => {
  projectInfoList.forEach(projectInfo => {
    const pathname = path.resolve(`app/static-project/${projectInfo.name}/client`);
    console.log(chalk.blue('组件解析 - start：', pathname));

    const pathnameArr = [pathname];
    if (projectInfo.name === 'wsc-pc-vis') {
      pathnameArr.push(`${pathname}-h5`);
    }

    const fileComponentsJSON = {};

    [EBIZ_COMPONENTS, VIS_COMPONENTS, RC_COMPONENTS, VANT_COMPONENTS].forEach((componentLibName) => {
      fileComponentsJSON[componentLibName] = {}

      pathnameArr.map(_pathname =>
        rd.eachFileFilterSync(_pathname, /(?<!\/node_modules\/.*)\.([jt]sx?|vue)$/, (filename) => {
          let file = fs.readFileSync(filename, { encoding: 'utf-8' });
          if (/\.vue$/.test(filename)) {
            file = handleVueFile(file);
          }

          if (file.includes(componentLibName)) {
            // console.log('filename ->>>>>', filename);
            const astFile = file2babelAst(file, filename);
            const componentList = astAnalysis(astFile);

            fileComponentsJSON[componentLibName][filename] = componentList;
          }
        })
      )
    });

    fs.mkdir(path.resolve(__dirname, './output/'), () => {
      fs.writeFileSync(path.resolve(__dirname, `./output/TEST-COMPONENT-LIST-${projectInfo.name}.json`), JSON.stringify(fileComponentsJSON, null, 2), {
        encoding: 'utf-8',
      });
      console.log(chalk.green('组件解析 - end', pathname));
    });
  })
}

module.exports = {
  main,
  componentMain,
  apiAssemble
}
