module.exports = {
  presets: ['@youzan/babel-preset-pc'],
  plugins: [
    '@babel/plugin-proposal-numeric-separator',
    [
      'import',
      { libraryName: '@youzan/vis-ui', libraryDirectory: 'es', style: true },
      '@youzan/vis-ui',
    ],
    [
      'import',
      {
        libraryName: '@youzan/ebiz-components',
        libraryDirectory: 'es',
        style: name => `${name}/style/index.css`,
      },
      '@youzan/ebiz-components',
    ],
    [
      'import',
      {
        libraryName: '@youzan/react-components',
        libraryDirectory: 'es/components',
        style: true,
      },
      '@youzan/react-components',
    ],
    [
      'babel-plugin-zent',
      { libraryName: '@zent/compat', automaticStyleImport: true, noModuleRewrite: true },
      '@zent/compat',
    ],
  ],
};
