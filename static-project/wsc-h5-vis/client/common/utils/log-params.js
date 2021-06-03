// 获取环境标志
// 1 h5
// 2 小程序
export const getEnvH5OrMiniprogramType = () => {
  const miniprogram = _global.miniprogram || {};
  if (miniprogram.isMiniProgram) {
    return 2;
  }
  return 1;
};
