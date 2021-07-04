const { parse } = require('acorn')
const fs = require('fs')
const path = require('path')
const staticPath = "../static-project/wsc-pc-vis/app/routers"

// 获取文件目录下的所有指定类型的文件
function getTotalFiles(filePath, type = ['.js', '.ts']) {
  let fileList = []
  //根据文件路径读取文件，返回文件列表
  try {
    const files = fs.readdirSync(filePath)
    //遍历读取到的文件列表
    files.forEach(function (filename) {
      //获取当前文件的绝对路径
      const filedir = path.join(filePath, filename);
      //根据文件路径获取文件信息，返回一个fs.Stats对象
      const stats = fs.statSync(filedir)
      if (stats.isFile() && type.includes(path.extname(filedir))) { // 文件
        fileList.push(filedir)
      } else if (stats.isDirectory()) { // 文件夹
        fileList = [...fileList, ...getTotalFiles(filedir)]
      }
    })
  } catch (err) {
    console.warn(err)
  }
  return fileList
}

const apiObj = [
  'GET',
  '/v4/vis/edu/course-product/list-page.json',
  'course.course.CourseProductV2Controller',
  'findPageByCondition',
]

const controllerPath = '../static-project/wsc-pc-vis/app/controllers/' + apiObj[2].replace(/\./g, '/') + '.js'
const controllerFile = fs.readFileSync(controllerPath, 'utf-8')
const astObj = parse(controllerFile)
const serviceList = []
astObj.body.forEach(item => {
  const { type, body, declarations } = item
  // 先把用到的service文件提取出来
  if (type === 'VariableDeclaration' && declarations) {
    const { init = {}, id = {} } = declarations[0]
    if (init.type === "CallExpression" && init.callee.name === 'require') {
      serviceList.push({
        varName: id.name,
        value: init.arguments[0].value
      })
    }
  } else if (type === 'ClassDeclaration' && body.type === 'ClassBody') {
    body.body.forEach(({ type, key }) => {
      if (type === 'MethodDefinition' && key.type === 'Identifier' && key.name === apiObj[3]) {

      }
    })
  }
})

console.log(serviceList)