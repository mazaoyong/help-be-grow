// eslint-disable-next-line no-undef
const isProd = process.env.NODE_ENV === 'production';

const prodDllConfig = {
  /*
  isVendorPackage(pkg) {},

  isBasePackage(pkg) {},

  exclude(pkg) {},

  extraBasePackages: [],

  extraVendorPackages: [],

  extraEntry: {
    echarts: ['echarts']
  }
  */

  extraVendorPackages: ['@youzan/utils-shop'],

  extraBasePackages: [
    '@youzan/react-components/es/components/blank-link/index',
    '@youzan/react-components/es/components/blank-link/style',
    '@youzan/react-components/es/components/pop-ellipsis-text/index',
    '@youzan/react-components/es/components/pop-ellipsis-text/style',
    '@youzan/react-components/es/components/region-select/index',
    '@youzan/react-components/es/components/region-select/style',
    '@zent/compat',
    'zent/es/grid',
    'zent/es/table',
    'zent/es/notify',
    'fns/base',
    'fns/make-request',
  ],
};

module.exports = isProd ? prodDllConfig : {};
