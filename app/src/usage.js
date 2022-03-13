const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const chalk = require('chalk')
const http = require('http')
const { format, addDays } = require('date-fns')
const CDN = require('@youzan/superman-cdn')
const { delDir } = require('../utils')

const filterComponents = ['@youzan/ebiz-components', '@youzan/vis-ui']

const createUsageFile = usageResult => {
  const usageDirPath = path.join(__dirname, '../usage')
  const ifExistDir = fs.existsSync(usageDirPath)
  if (!ifExistDir) fs.mkdirSync(usageDirPath)
  const date = format(new Date(), 'yyyy-MM-dd')
  const filePath = path.join(__dirname, `../usage/${date}.json`)
  fs.writeFileSync(filePath, JSON.stringify(usageResult))
  return filePath
}

const createComponentsLibraryUsage = () => {
  const fileList = fs.readdirSync(path.join(__dirname, '../output'))
  const usageResult = []
  fileList.forEach(item => {
    const name = item.replace(/(TEST-COMPONENT-LIST-)|(\.json)/g, '')
    const file = fs.readFileSync(path.join(__dirname, `../output/${item}`), {
      encoding: 'utf-8',
    })
    const json = JSON.parse(file.toString())
    Object.entries(json)
      .filter(([key]) => filterComponents.includes(key))
      .forEach(([key, val]) => {
        const allValue = Object.values(val).reduce(
          (total, v) => [...total, ...v],
          []
        )
        const value = {}
        allValue.forEach(v => (value[v] = value[v] ? value[v] + 1 : 1))
        usageResult.push({
          name,
          key,
          value,
        })
      })
  })
  return usageResult
}

const createLocalUsage = () => {
  const fileList = fs.readdirSync(
    path.join(__dirname, '../localComponentsOutput')
  )
  const usageResult = []
  fileList.forEach(item => {
    const name = item.replace(/(TEST-COMPONENT-LIST-)|(\.json)/g, '')
    const file = fs.readFileSync(
      path.join(__dirname, `../localComponentsOutput/${item}`),
      {
        encoding: 'utf-8',
      }
    )
    const json = JSON.parse(file.toString())
    Object.entries(json).forEach(([key, val]) => {
      const allValue = Object.values(val).reduce(
        (total, v) => [...total, ...v],
        []
      )
      const value = {}
      allValue.forEach(v => (value[v] = value[v] ? value[v] + 1 : 1))
      usageResult.push({
        name,
        key,
        value,
      })
    })
  })
  return usageResult
}

const uploadToCdn = filePath => {
  CDN.upload({
    cdnPath: '/edu/components/usage/file',
    filePath,
  }).then(() => {
    console.log('done')
  })
}

const createUsageAndUploadToCdn = () => {
  const libraryUsage = createComponentsLibraryUsage()
  const localUsage = createLocalUsage()
  const usageResult = [...libraryUsage, ...localUsage]
  const filePath = createUsageFile(usageResult)
  uploadToCdn(filePath)
}

const downloadUsageFiles = async () => {
  console.log(chalk.blue(`开始下载组件库使用情况数据`))
  const usageDirPath = path.join(__dirname, '../usage')
  if (!fs.existsSync(usageDirPath)) {
    delDir(usageDirPath)
    fs.mkdirSync(usageDirPath)
  }
  function getCurrentUri(date) {
    return `http://su.yzcdn.cn/edu/components/usage/file/${date}.json`
  }
  async function downloadFile(uri, date) {
    return new Promise((resolve, reject) => {
      http.get(uri, res => {
        if (res.statusCode !== 200) {
          reject(res.statusCode)
          return
        }
        const file = fs.createWriteStream(
          path.join(usageDirPath, `${date}.json`)
        )
        file
          .on('finish', () => {
            console.log(`${date}使用数文件生成成功`)
            resolve()
          })
          .on('error', err => {
            fs.unlink(usageDirPath)
            reject(err.message)
          })
        res.pipe(file)
      })
    })
  }
  const startDate = '2022-03-01'
  const endDate = format(new Date(), 'yyyy-MM-dd')
  let currentDate = startDate
  while (currentDate < endDate) {
    currentDate = format(addDays(new Date(currentDate), 1), 'yyyy-MM-dd')
    await downloadFile(getCurrentUri(currentDate), currentDate).catch(e => {
      console.log(`cdn不存在${currentDate}的使用数文件`)
    })
  }
  console.log(chalk.blue(`下载组件库使用情况数据完成`))
}

module.exports = {
  createUsageAndUploadToCdn,
  downloadUsageFiles,
}
