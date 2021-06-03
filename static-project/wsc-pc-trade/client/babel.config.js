module.exports = {
  plugins: [
    [
      'import',
      {
        libraryName: '@youzan/ebiz-components',
        libraryDirectory: 'es',
        style: name => `${name}/style/index.css`,
      },
      '@youzan/ebiz-components',
    ],
  ],
};
