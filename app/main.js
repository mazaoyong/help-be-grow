const AstGetter = require('./src/AstGetter')
const fs = require('fs')
const { parse } = require('acorn')

const controllerFile = fs.readFileSync('./static-project/wsc-pc-vis/app/controllers/course/course/CourseProductV2Controller.js', 'utf-8')
const astObj = parse(controllerFile)
const test = new AstGetter(astObj)
console.log(test.getRequirePath())