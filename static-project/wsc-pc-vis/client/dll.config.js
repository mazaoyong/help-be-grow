module.exports = {
  /*
  isVendorPackage(pkg) {},

  isBasePackage(pkg) {},

  extraBasePackages: [],

  extraVendorPackages: [],
  */

  extraBasePackages: ['@youzan/sam-components', 'zan-utils', '@youzan/ebiz-components'],

  exclude(pkg) {
    return ['@youzan/captain-showcase', '@youzan/vis-ui'].indexOf(pkg) !== -1;
  },
  extraVendorPackages: ['zan-jquery', 'react-router', 'zent', '@youzan/react-components'],
};
