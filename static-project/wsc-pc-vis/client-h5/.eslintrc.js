module.exports = {
  root: true,
  extends: ['@youzan/eslint-config-ebiz/jsdoc', '@youzan/eslint-config-ebiz/vue'],
  globals: {
    document: 'readonly',
    window: 'readonly',
    _global: 'readonly',
  },
  rules: {
    'comma-dangle': ['warn', 'never'],
  },
};
