// https://lbs.amap.com/api/javascript-api/reference/location#m_AMap.Geolocation
interface IPositionResult {
  addressComponent: object,
  message: string,
}

/**
 * @description 自动定位获取位置信息
 * @param {*} onComplete 定位完成的回调函数
 */
function getAutomaticGeolocation(onComplete: (r: IPositionResult) => void): void {
  // window amap挂载有延时，加个timeout
  setTimeout(() => {
    const AMap = window.AMap;
    if (!AMap) return;

    AMap.plugin('AMap.Geolocation', () => {
      let geolocation = new AMap.Geolocation({
        enableHighAccuracy: true, // 是否使用高精度定位，默认:true
        timeout: 10000, // 超过10秒后停止定位，默认：5s
      });
      geolocation.getCurrentPosition((status: string, result: IPositionResult) => {
        if (status === 'complete') {
        // 解析定位结果
          onComplete(result);
        } else {
          console.error(`定位失败原因排查信息:${result.message}`);
        }
      });
    });
  }, 1000);
};

export { getAutomaticGeolocation };
