const express = require('express');
const path = require('path')
const fs = require('fs')
const { getApiData } = require('./dataGetter')

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
      const totalApiData = getApiData()
      result.data = totalApiData.filter(item => {
        const { javaApi, jsonApi } = item
        return javaApi.indexOf(searchContent) + javaApi.indexOf(searchContent.replace(/\#/g, '.')) + jsonApi.indexOf(searchContent) > -3
      })
    }
    res.send(result)
  })

  // 安全检查
  app.get('/HB', (req, res) => {
    const { service } = req.query
    if (service === 'online') {
      res.send({
        "result": true,
        "code": 200,
        "message": null,
        "data": "ok"
      })
    } else if (service === 'offline') {
      res.send({
        "result": true,
        "code": 404,
        "message": null,
        "data": "ok"
      })
    } else {
      res.send({
        "result": true,
        "code": 200,
        "message": null,
        "data": "ok"
      })
    }
  })

  app.listen(8201, () => {
    console.log('Listening on port 8201')
  });
  app.use('', express.static(path.resolve(__dirname, '../../client/build')))
}
