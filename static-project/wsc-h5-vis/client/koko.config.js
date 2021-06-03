const { join, resolve } = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  name: 'wsc-h5-vis',
  entry: ['pages', { path: 'assets/styles/theme', name: 'index.scss' }],
  outputPath: '../static/build/client',
  presets: ['ranta-h5', 'h5'],
  baseScripts: ['./common/global/global-entry.js'],
  plugins: {
    style: {
      loaderOptions: {
        sass: {
          sassOptions: {
            includePaths: ['assets/styles'],
          },
        },
      },
    },
  },
  alias: {
    'zanutil': '@youzan/zanutil/src',
    'zepto': join(__dirname, 'node_modules/webpack-zepto/index.js'),
    'Zepto': join(__dirname, 'node_modules/webpack-zepto/index.js'),
    'jquery': join(__dirname, 'node_modules/webpack-zepto/index.js'),
    'utils': '@youzan/utils',
    'pct': resolve(__dirname, 'pages/paid-content'),
    'pco': resolve(__dirname, 'pages/trade/paid-content-order'),
    'supv': resolve(__dirname, 'pages/supv'),
    '@': resolve(__dirname),
    'vue': join(__dirname, 'node_modules/vue'),
  },
  devServer: false,
  configureWebpack: {
    output: {
      publicPath: 'https://b.yzcdn.cn/wsc-h5-vis/',
    },
    resolve: {
      extensions: ['.js', '.ts', '.vue', '.scss', '.css'],
      modules: [resolve(__dirname), resolve(__dirname, 'node_modules'), 'node_modules'],
    },
    module: {
      rules: [
        {
          test: /\.svg$/,
          use: ['svg-sprite-loader'],
        },
      ],
    },
    plugins: [
      new webpack.ProvidePlugin({
        'Object.assign': 'object-assign',
      }),
    ],
    optimization: {
      minimize: process.env.NODE_ENV === 'production',
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          terserOptions: {
            compress: {
              drop_console: true,
            },
          },
        }),
      ],
    },
  },
  preCommit: {
    eslint: false,
    stylelint: false,
    prettier: true,
  },
};
