const fs = require("fs");
const path = require("path");
const _ = require("lodash");

const filterComponents = ["@youzan/ebiz-components", "@youzan/vis-ui"];

const getDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month < 10 ? `0${month}` : month}-${
    day < 10 ? `0${day}` : day
  }`;
};

const createUsageFile = (usageResult) => {
  const usageDirPath = path.join(__dirname, "../usage");
  const ifExistDir = fs.existsSync(usageDirPath);
  if (!ifExistDir) fs.mkdirSync(usageDirPath);
  const date = getDate();
  const filePath = path.join(__dirname, `../usage/${date}.json`);
  fs.writeFileSync(filePath, JSON.stringify(usageResult));
};

const createComponentsLibraryUsage = () => {
  const fileList = fs.readdirSync(path.join(__dirname, "../output"));
  const usageResult = [];
  fileList.forEach((item) => {
    const name = item.replace(/(TEST-COMPONENT-LIST-)|(\.json)/g, "");
    const file = fs.readFileSync(path.join(__dirname, `../output/${item}`), {
      encoding: "utf-8",
    });
    const json = JSON.parse(file.toString());
    Object.entries(json)
      .filter(([key]) => filterComponents.includes(key))
      .forEach(([key, val]) => {
        const allValue = Object.values(val).reduce(
          (total, v) => [...total, ...v],
          []
        );
        const value = {};
        allValue.forEach((v) => (value[v] = value[v] ? value[v] + 1 : 1));
        usageResult.push({
          name,
          key,
          value,
        });
      });
  });
  return usageResult;
};

const createLocalUsage = () => {
  const fileList = fs.readdirSync(
    path.join(__dirname, "../localComponentsOutput")
  );
  const usageResult = [];
  fileList.forEach((item) => {
    const name = item.replace(/(TEST-COMPONENT-LIST-)|(\.json)/g, "");
    const file = fs.readFileSync(
      path.join(__dirname, `../localComponentsOutput/${item}`),
      {
        encoding: "utf-8",
      }
    );
    const json = JSON.parse(file.toString());
    Object.entries(json).forEach(([key, val]) => {
      const allValue = Object.values(val).reduce(
        (total, v) => [...total, ...v],
        []
      );
      const value = {};
      allValue.forEach((v) => (value[v] = value[v] ? value[v] + 1 : 1));
      usageResult.push({
        name,
        key,
        value,
      });
    });
  });
  return usageResult;
};

const createUsage = () => {
  const libraryUsage = createComponentsLibraryUsage();
  const localUsage = createLocalUsage();
  const usageResult = [...libraryUsage, ...localUsage];
  createUsageFile(usageResult);
};

module.exports = {
  createUsage,
};
