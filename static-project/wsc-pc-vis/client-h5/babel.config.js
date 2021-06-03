module.exports = {
  'plugins': [
    [
      '@babel/plugin-transform-runtime',
      {
        'corejs': 2
      }
    ],
    [
      'import',
      {
        'libraryName': 'vant',
        'libraryDirectory': 'es',
        'style': true
      },
      'vant'
    ],
    [
      'import',
      {
        'libraryName': 'captain-ui',
        'libraryDirectory': 'es',
        'style': true
      },
      'captain-ui'
    ],
    [
      'import',
      {
        'libraryName': '@youzan/captain-showcase',
        'libraryDirectory': 'es',
        'style': true
      }
    ],
    [
      'import',
      {
        'libraryName': '@youzan/vis-ui',
        'libraryDirectory': 'es',
        'style': true
      },
      '@youzan/vis-ui'
    ],
    [
      'import',
      {
        'libraryName': '@youzan/zan-media-sdk'
      },
      'youzan/zan-media-sdk'
    ]
  ],
  'presets': [
    '@babel/preset-env',
    '@babel/preset-typescript',
    '@vue/cli-plugin-babel/preset',
    [
      '@vue/babel-preset-jsx',
      {
        'compositionAPI': true,
        'functional': false,
        'injectH': true
      }
    ]
  ]
};
