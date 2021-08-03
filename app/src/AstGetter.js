const get = require('lodash/get')
const fs = require('fs')
const { parse } = require('acorn')
const { tsquery } = require('@phenomnomnominal/tsquery')
const path = require('path')

class AstGetter {
  constructor(filePath) {
    let controllerFile = ''
    // 不知道是js文件还是ts文件
    try {
      controllerFile = fs.readFileSync(filePath).toString()
    } catch {
      controllerFile = fs.readFileSync(filePath.replace(path.extname(filePath), path.extname(filePath) === '.js' ? '.ts' : '.js')).toString()
    }
    // 如果解析报错了，说明是ts语法
    let astObj = ''
    try {
      astObj = parse(controllerFile, {
        sourceType: 'module'
      })
    }
    catch {
      astObj = tsquery.ast(controllerFile);
      this.isTs = true
    }
    this.astObj = astObj
    const astBody = get(astObj, 'body', [])
    this.astBody = astBody
    // 将用到的各种类型分类
    astBody.forEach(body => {
      const bodyGroup = get(this, body.type, [])
      this[body.type] = [...bodyGroup, body]
    })
  }

  // 获取变量require的路径
  getRequirePath() {
    const requirePathObj = {}
    // 是否是ts文件
    if (this.isTs) {
      const ast = this.astObj;
      // ts文件的导入可能有两种，一种是import，一种是require
      const importNodes = tsquery(ast, 'ImportDeclaration[importClause.name!=undefined]')
      importNodes.forEach(item => {
        const keyName = item.importClause.name.escapedText
        const pathValue = item.moduleSpecifier.text
        requirePathObj[keyName] = pathValue.replace(/\.\.\/|\.js|\.ts/g, '')
      })

      const requireNodes = tsquery(ast, 'VariableStatement > VariableDeclarationList.declarations[0]')
      requireNodes.forEach(varDec => {
        const isRequire = get(varDec, 'initializer.expression.escapedText', '') === 'require'
        const keyName = get(varDec, 'name.escapedText', null)
        if (isRequire && keyName) {
          const pathValue = get(varDec, 'initializer.arguments[0].text', '')
          requirePathObj[keyName] = pathValue.replace(/\.\.\/|\.js|\.ts/g, '')
        }
      })
    } else {
      const partBody = get(this, 'VariableDeclaration', [])
      partBody.forEach(body => {
        const isRequireType = get(body, 'declarations[0].init.callee.name', null)
        const requirePath = get(body, 'declarations[0].init.arguments[0].value', null)
        const name = get(body, 'declarations[0].id.name', null)
        if (isRequireType === 'require' && requirePath && name) {
          requirePathObj[name] = requirePath.replace(/\.\.\/|\.js|\.ts/g, '')
        }
      })
    }
    return requirePathObj
  }

  // 找出class中的所有async函数
  getAllAsyncMethod() {
    let result = []
    if (this.isTs) {
      const ast = this.astObj
      result = tsquery(ast, 'ClassDeclaration > MethodDeclaration')
    } else {
      const classDec = get(this, 'ClassDeclaration[0]', null)
      if (classDec) {
        const methodArr = get(classDec, 'body.body', [])
        if (classDec.body.type === 'ClassBody') {
          result = methodArr.filter(body => body.type === 'MethodDefinition' && body.value.type === 'FunctionExpression' && body.value.async)
        }
      }
    }
    return result
  }

  // 根据service的函数获取接口地址
  getJavaApi(func) {
    const methodList = this.getAllAsyncMethod()
    let javaApi = ''
    if (this.isTs) {
      const serviceFunc = methodList.find(item => item.name.escapedText === func)
      const invokeBody = tsquery(serviceFunc.body, 'CallExpression[expression.name.escapedText="invoke"]')[0]
      const suffix = invokeBody.arguments[0].text
      // 获取java接口前缀的N种方法
      const publicAst = tsquery(this.astObj, 'PropertyDeclaration:has(PublicKeyword)[name.escapedText=/^[A-Z0-9_]+$/]')
      const readonlyAst = tsquery(this.astObj, 'PropertyDeclaration:has(ReadonlyKeyword)[name.escapedText=/^[A-Z0-9_]+$/]')
      const getAccessor = tsquery(this.astObj, 'GetAccessor[name.escapedText=/^[A-Z0-9_]+$/]')
      const prefix = get(publicAst[0], 'initializer.text', null) || get(readonlyAst[0], 'initializer.text', null) || (getAccessor.body && get(tsquery(getAccessor.body, 'ReturnStatement')[0], expression.text, null))
      javaApi = prefix + '#' + suffix
    } else {
      const serviceFunc = methodList.find(body => body.key.name === func)
      const callList = this.getArrByCondition(serviceFunc, { type: 'CallExpression' })
      let invoke = ''
      for (let i = 0; i < callList.length; i++) {
        const body = callList[i];
        if (get(body, 'callee.property.name', '') === 'invoke') {
          invoke = get(body, 'arguments[0].value', '')
        }
        if (invoke) {
          break
        }
      }
      // 获取get函数
      const getFunc = this.getArrByCondition(this.astBody, { type: 'MethodDefinition', kind: 'get' })
      if (getFunc[0]) {
        const body = getFunc[0]
        const getFuncName = get(body, 'key.name', '')
        const isCap = new RegExp(`([A-Z]|[0-9]|_){${getFuncName.length}}`)
        if (isCap.test(getFuncName)) {
          const returnState = this.getArrByCondition(body, { type: 'ReturnStatement' })
          const apiPrefix = get(returnState[0], 'argument.value', '')
          javaApi = apiPrefix + '#' + invoke
        }
      }
    }
    return javaApi
  }

  // 输入对应的controller函数名称，获取到用到的service文件路径
  getServicePath(controllerFunc) {
    let result = []
    // 获取class内部的所有函数
    const methodList = this.getAllAsyncMethod()
    const requireObj = this.getRequirePath()
    if (this.isTs) {
      // 筛选async函数
      const asyncMethod = tsquery(this.astObj, 'MethodDeclaration:has(AsyncKeyword)')
      const controllerMethod = asyncMethod.find(item => item.name.escapedText === controllerFunc)
      if (controllerMethod) {
        const awaitAstArr = tsquery(controllerMethod.body, 'AwaitExpression > CallExpression > PropertyAccessExpression:has(NewExpression)')
        awaitAstArr.forEach(item => {
          const serviceKeyName = get(item, 'expression.expression.escapedText', '')
          const serviceMethod = get(item, 'name.escapedText', '')
          if (serviceKeyName && serviceMethod && requireObj[serviceKeyName]) {
            result.push({
              path: requireObj[serviceKeyName] + '.ts',
              func: serviceMethod
            })
          }
        })
      }
    } else {
      // 匹配对应的函数名称
      const controllerMethod = methodList.find(body => body.key.name === controllerFunc)
      const contentBody = get(controllerMethod, 'value.body.body', [])
      // 找到函数里面的所有service文件
      const asyncArr = this.getArrByCondition(contentBody, { type: 'AwaitExpression' })
      asyncArr.forEach(item => {
        const requireCallee = get(item, 'argument.callee.object.callee.name', '')
        const func = get(item, 'argument.callee.property.name', '')
        if (requireObj[requireCallee]) {
          result.push({
            path: requireObj[requireCallee] + '.js',
            func
          })
        }
      })
    }
    return result
  }

  // 递归一个对象或者数组，将满足条件的筛选出来，返回一个数组
  getArrByCondition(body, condition = {}) {
    const proto = Object.prototype.toString.call(body)
    let result = []
    if (proto === '[object Object]') { // 对象
      let isSame = true
      for (const [key, value] of Object.entries(condition)) {
        if (body[key] !== value) {
          isSame = false
          break
        }
      }
      if (isSame) return [body]
      for (const [key, value] of Object.entries(body)) {
        result = [...result, ...this.getArrByCondition(value, condition)]
      }
    } else if (proto === '[object Array]') { // 数组
      body.forEach(item => {
        result = [...result, ...this.getArrByCondition(item, condition)]
      })
    }
    return result
  }
}

module.exports = AstGetter

// const test = new AstGetter('/Users/mazaoyong/Desktop/project/search-your-mother/app/static-project/wsc-h5-vis/app/services/api/uic/acl/OmniChannelService.ts')
// console.log(test.getJavaApi('getPlatformOauthUrl'))