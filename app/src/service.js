const express = require('express');
const path = require('path')
const fs = require('fs')
const rd = require('rd');
const history = require('connect-history-api-fallback');

const { getApiData, getConfig } = require('./dataGetter')

module.exports = () => {
  const app = express();

  // parse application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: false }))

  // parse application/json
  app.use(express.json())

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
        data: log || [],
        message: 'request:ok'
      })
    })
  });

  // 获取可查询的项目
  app.get('/getProjectConfig', (req, res) => {
    try {
      const configData = getConfig()
      res.send({
        code: 200,
        data: configData,
        message: 'request:ok'
      })
    } catch (err) {
      res.send({
        code: 500,
        message: '读取配置数据失败'
      })
    }
  })

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
      }).slice(0, 10)
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

  // 驼峰转换下划线
  function toLowerLine(name) {
    const res = name.replace(/([A-Z])/g,"-$1").toLowerCase();
    if (res[0] === '-') {
      return res.slice(1)
    }
    return res;
  }

  function toCamel(name) {
    return name.replace(/\-(\w)/g, function(all, letter){
        return letter.toUpperCase();
    });
  }

  function toAllCamel(name) {
    return name.replace(/\-(\w)/g, function(all, letter){
        return letter.toUpperCase();
    }).replace(/^(\w)/g, function(all, letter){
      return letter.toUpperCase();
    });
  }

  app.get('/findComponent', (req, res) => {
    const query = req.query;
    const componentName = query.component;
    const _targetName = query.name;
    const targetNameList = [
      _targetName,
      toLowerLine(_targetName),
      toCamel(_targetName),
      toAllCamel(_targetName)
    ];

    const existFilename = new Set();

    rd.eachFileFilterSync(path.resolve('app/output'), /\.json$/, (filename) => {
      const file = fs.readFileSync(filename, {
        encoding: 'utf-8',
      });
      const json = JSON.parse(file.toString());

      Object.entries(json).forEach(([cmpName, fileComponentRelationShip]) => {
        if (cmpName === componentName) {
          Object.entries(fileComponentRelationShip).forEach(([name, components]) => {
            if (targetNameList.some(targetName => components.includes(targetName))) {
              const getAppName = url => url.split('/')[0]
              const getBusiness = url => url.split('client/pages/')[1] || ''

              existFilename.add({
                fileUrl: name,
                appName: getAppName(name.split('/app/static-project/')[1] || ''),
                business: getBusiness(name.split('/app/static-project/')[1] || '')
              });
            }
          });
        }
      })
    })

    res.send({
      code: 200,
      data: Array.from(existFilename),
      message: 'request:ok'
    });
    return false;
  });

  app.listen(8201, () => {
    console.log('Listening on port 8201')
  });
  app.use(history(), express.static(path.resolve(__dirname, '../../client/dist')))
}
