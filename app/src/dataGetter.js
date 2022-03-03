const fs = require('fs');
const path = require('path');
const rootPath = process.cwd();

const getConfig = () => {
  const config = fs.readFileSync(`${rootPath}/config.json`).toString();
  return JSON.parse(config);
};

const getApiData = (appName = getConfig().map((item) => item.name)) => {
  let result = [];
  appName.forEach((appName) => {
    try {
      const dataPath = `${rootPath}/app/data/${appName}.json`;
      result = [...result, ...JSON.parse(fs.readFileSync(dataPath))];
    } catch (err) {
      console.log('获取数据失败：', appName + ':' + err);
    }
  });
  return result;
};

const getUsageData = () => {
  const result = [];
  const rootPath = process.cwd();
  const usagePath = `${rootPath}/app/usage`;
  const usageDir = fs.readdirSync(usagePath);
  usageDir.forEach((item) => {
    try {
      const file = fs.readFileSync(`${usagePath}/${item}`, {
        encoding: "utf-8",
      });
      const content = JSON.parse(file);
      result.push({
        time: item.replace(/\.json$/, ""),
        data: content,
      });
    } catch (e) {
      throw new Error("解析文件失败");
    }
  });
  return result;
};

module.exports = {
  getConfig,
  getApiData,
  getUsageData,
};
