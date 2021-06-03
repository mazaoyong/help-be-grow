/* eslint-disable */
/**
 * 检测组件依赖的基础组件版本跟项目依赖的是否一致
 */
const path = require('path');

// process.cwd(): ${project}/node_modules/@icedesign/notification
const projectDir = path.resolve(process.cwd(), '../../../');

try {
  const projectPkgData = require(path.resolve(projectDir, 'package.json'));
  const { dependencies = {} } = projectPkgData;

  const useIcedesignBase = dependencies['zent'];

  if (useIcedesignBase) {
    //
  }
} catch (err) {}
