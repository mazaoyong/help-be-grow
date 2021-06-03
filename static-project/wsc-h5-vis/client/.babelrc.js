const snakeCase = require('lodash/snakeCase');

const presets = [
  '@youzan/babel-preset-istanbul',
  '@youzan/babel-preset-h5',
  '@vue/cli-plugin-babel/preset',
  [
    '@vue/babel-preset-jsx',
    {
      compositionAPI: true,
      functional: false,
      injectH: true,
      vOn: true,
    },
  ],
];

const plugins = [
  "@babel/plugin-transform-typescript",
  [
    "import",
    {
      "libraryName": "captain-ui",
      "libraryDirectory": "es",
      "style": true
    },
    "captain-ui"
  ],
  [
    'import',
    {
      libraryName: '@youzan/captain',
      libraryDirectory: 'es',
      style: true,
    },
    '@youzan/captain',
  ],
  "lodash",
  ['transform-imports', {
    'date-fns': {
      transform: importName => {
        return `date-fns/${snakeCase(importName)}`;
      },
      preventFullImport: true,
    },
  }],
  "@babel/plugin-syntax-dynamic-import",
  "@babel/plugin-proposal-class-properties",
  "transform-vue-jsx",
];

module.exports = { plugins, presets };