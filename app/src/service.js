const express = require('express');
const path = require('path')
const fs = require('fs')

// 获取接口数据
const getApiData = () => {
  const DATA_PREFIX = ['wsc-h5-vis.json', 'wsc-pc-vis.json']
  return new Promise((resolve, reject) => {
    try {
      const data = DATA_PREFIX.reduce((initVal, dataName) => {
        const itemApiData = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../data/${dataName}`)))
        return [...initVal, ...itemApiData]
      }, [])
      resolve(data)
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = () => {
  const app = express();

  // 获取更新纪录
  app.get('/getUpdateLog', function (req, res) {
    fs.readFile(path.resolve(__dirname, '../update_log.json'), (err, updateLog) => {
      if (err) {
        res.send({
          code: 500,
          message: '读取更新日志数据失败'
        })
        return
      }
      const log = JSON.parse(updateLog)
      res.send({
        code: 200,
        data: log[0] || {},
        message: 'request:ok'
      })
    })
  });

  // 查询接口
  app.get('/getSearchResult', (req, res) => {
    const { searchContent = '' } = req.query
    const result = {
      code: 200,
      data: [],
      message: 'request:ok'
    }
    if (searchContent) {
      getApiData()
        .then(totalApiData => {
          result.data = totalApiData.filter(item => {
            const { javaApi, jsonApi } = item
            return javaApi.indexOf(searchContent) + javaApi.indexOf(searchContent.replace(/\#/g, '.')) + jsonApi.indexOf(searchContent) > -3
          })
        })
        .catch(err => {
          result.code = 500
          result.message = '读取接口数据失败'
        })
        .finally(() => {
          res.send(result)
        })
    } else {
      res.send(result)
    }
  })

  app.listen(8201, () => {
    console.log('Listening on port 8201')
  });
  app.use('', express.static(path.resolve(__dirname, '../../client/build')))
}
