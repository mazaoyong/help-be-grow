const AstGetter = require('./src/AstGetter')
const { getTotalFiles } = require('./utils')
const path = require('path')
const { createProgram } = require('typescript')

// const apiObj = [
//   'GET',
//   '/v4/vis/edu/course-product/list-page.json',
//   'course.course.CourseProductV2Controller',
//   'findPageByCondition',
// ]

// const astGetter = new AstGetter('app/static-project/wsc-pc-vis/app/controllers/course/course/CourseProductV2Controller.js')
// console.log(123, astGetter.getServicePath('findPageByCondition'))

// const serviceAst = new AstGetter('/Users/mazaoyong/Desktop/project/search-your-mother/app/static-project/wsc-pc-vis/app/services/owl/pc/courseitem/offlinecourse/PcCourseFacade.js')

// console.log(serviceAst.getJavaApi('findPageByCondition'))

// 处理每个json接口导航
function dealApiToObj(appName, api) {
  // 将router里面的api组装成为对象
  let result = []
  if (!Array.isArray(api[0]) && !Array.isArray(api[2])) { // 不考虑请求方法或者对应的controller是多个的情况
    const controllerSuffixPath = `/app/controllers/${api[2].replace(/\./g, '/')}.js`
    const controllerPath = path.join(__dirname, './static-project/', appName, controllerSuffixPath)
    const astObj = new AstGetter(controllerPath)

    const jsonApi = Array.isArray(api[1]) ? api[1] : [api[1]]
    const controllerMethod = Array.isArray(api[3]) ? api[3] : [api[3]]

    jsonApi.forEach(jsonApiItem => {
      controllerMethod.forEach(cm => {
        astObj.getServicePath(cm).forEach(service => {
          result.push({
            "AppName": appName,
            "JavaApi": astObj.getJavaApi(cm),
            "JsonApi": jsonApiItem,
            "Navigator": [],
            "Controller": controllerSuffixPath,
            "Service": service.path
          })
        })
      })
    })
  }
  return result
}

const projectSupported = ['wsc-pc-vis', 'wsc-h5-vis']
// 获取全部router文件
projectSupported.forEach(appName => {
  const routerFileList = getTotalFiles(path.join(__dirname, `./static-project/${appName}/app/routers`))
  routerFileList.forEach(routerPath => {
    const apiArr = require(routerPath.replace('.ts', '.js'))
    apiArr.forEach(apiItem => {
      console.log(111, apiItem)
      console.log(dealApiToObj(appName, apiItem))
    })
  })
})
