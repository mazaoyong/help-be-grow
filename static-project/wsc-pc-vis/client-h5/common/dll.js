/**
 * 此处定义 webpack 打包的 DLL 模块
 * 为了有效利用缓存，DLL 模块只放入更新频率低的基础库
 */
module.exports = [
  'vue',
  'vant',
];
