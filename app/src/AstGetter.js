const get = require('lodash/get')

class AstGetter {
  constructor(astObj) {
    this.astObj = astObj
    this.astBody = get(astObj, 'body', [])
  }

  // 获取变量require的路径
  getRequirePath() {
    const astBody = this.astBody || []
    const requirePathArr = []
    astBody.forEach(body => {
      const isRequireType = get(body, 'declarations.init.callee.name')
      const requirePath = get(body, 'declarations.init.arguments[0].value')
      console.log(isRequireType, body)
      if (isRequireType === 'require' && requirePath) {
        requirePathArr.push({
          require: requirePath
        })
      }
    })
    return requirePathArr
  }
}

module.exports = AstGetter