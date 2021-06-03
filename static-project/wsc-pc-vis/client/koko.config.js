const { resolve } = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

function isDev() {
  return process.env.NODE_ENV !== 'production';
}

function getOutputPath() {
  return resolve(__dirname, isDev() ? '../static/local' : '../static/build');
}

module.exports = {
  // 应用名称
  name: 'wsc-pc-vis',
  outputPath: getOutputPath(),
  baseScripts: ['./pages/global/main.js'],
  configureWebpack: {
    devtool: isDev() ? 'source-map' : 'none',
  },
  alias: {
    '@ability-center': resolve(__dirname, 'ability-center'),
    '@decorate-components': resolve(__dirname, 'decorate-components'),
    '@hooks': resolve(__dirname, 'hooks'),
    '@arthur': resolve(__dirname, 'arthur'),
    common: resolve(__dirname, 'common'),
    fns: resolve(__dirname, 'fns'),
    // polyfill: resolve(__dirname, 'polyfill'),
    domain: resolve(__dirname, 'domain'),
    hooks: resolve(__dirname, 'hooks'),
    constants: resolve(__dirname, 'constants'),
    components: resolve(__dirname, 'components'),
    definitions: resolve(__dirname, '../definitions'),
    shared: resolve(__dirname, 'shared'),
    sass: resolve(__dirname, 'sass'),
    pages: resolve(__dirname, 'pages'),
    templates: resolve(__dirname, 'templates'),
  },
  presetOptions: {
    pc: {
      libraryDll: {
        include: [
          'zan-jquery', 'react-router', './pages/global/main.js',
        ],
      },
      componentDll: {
        include: [
          '@youzan/ebiz-components', '@youzan/sam-components'
        ],
      },
    },
  },
  plugins: {
    // lint: {
    //   prettier: false
    // },
    // dll: [{
    //   name: 'vendor',
    //   include: ['zan-jquery', 'react-router', '@youzan/ebiz-components', '@zent/compat'],
    // },{
    //   name: 'base',
    //   include: ['@youzan/sam-components'],
    // }],
    style: {
      loaderOptions: {
        sass: {
          // sass-loader 选项
          sassOptions: {
            includePaths: [resolve(__dirname, 'sass'), resolve(__dirname, 'shared/sass')],
          },
          sourceMap: isDev(),
        },
      },
    },
  },
  // 预设配置名称，根据应用类型填写
  presets: ['pc'],
  preCommit: {
    eslint: false,
    stylelint: false,
    prettier: true,
  },
};
