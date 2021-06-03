// Copy form wsc-h5-trade/client/shared/common/gps-transformer.js

/**
 * 坐标系转换函数
 * 后端统一使用百度坐标系
 * 因此需要在前端进行坐标转换
 */

const ee = 0.00669342162296594323;
const a = 6378245.0;

function outOfChina(lng, lat) {
  return (lng < 72.004 || lng > 137.8347) && (lat < 0.8293 || lat > 55.8271);
}

function transformLat(x, y) {
  let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
  ret += ((20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin((y / 3.0) * Math.PI)) * 2.0) / 3.0;
  ret += ((160.0 * Math.sin((y / 12.0) * Math.PI) + 320 * Math.sin((y * Math.PI) / 30.0)) * 2.0) / 3.0;
  return ret;
}

function transformLng(x, y) {
  let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
  ret += ((20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(x * Math.PI) + 40.0 * Math.sin((x / 3.0) * Math.PI)) * 2.0) / 3.0;
  ret += ((150.0 * Math.sin((x / 12.0) * Math.PI) + 300.0 * Math.sin((x / 30.0) * Math.PI)) * 2.0) / 3.0;
  return ret;
}

/**
 * 84 to 火星坐标系 (GCJ-02) World Geodetic System ==> Mars Geodetic System
 *
 * @param lat
 * @param lng
 * @return object
 */
function gpsToGcj(lng, lat) {
  if (outOfChina(lng, lat)) {
    return {
      lng: lng,
      lat: lat,
    };
  }
  let dLng = transformLng(lng - 105.0, lat - 35.0);
  let dLat = transformLat(lng - 105.0, lat - 35.0);
  const radLat = (lat / 180.0) * Math.PI;
  let magic = Math.sin(radLat);
  magic = 1 - ee * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtMagic)) * Math.PI);
  dLng = (dLng * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * Math.PI);
  const mgLat = lat + dLat;
  const mgLng = lng + dLng;
  return {
    lng: mgLng,
    lat: mgLat,
  };
}

/**
 * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换算法 将 GCJ-02 坐标转换成 BD-09 坐标
 *
 * @param lat
 * @param lng
 * @return object
 */
function gcjToBaidu(lng, lat) {
  const delta = Math.PI * 3000.0 / 180.0;
  const x = lng;
  const y = lat;
  const z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * delta);
  const theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * delta);
  lng = z * Math.cos(theta) + 0.0065;
  lat = z * Math.sin(theta) + 0.006;
  return {
    lng: lng,
    lat: lat,
  };
}

/**
 * * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换算法 * * 将 BD-09 坐标转换成GCJ-02 坐标
 *
 * @param bd_lat
 * @param bd_lon
 * @return array
 */
function baiduToGcj(lng, lat) {
  const delta = Math.PI * 3000.0 / 180.0;
  const x = lng - 0.0065;
  const y = lat - 0.006;
  const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * delta);
  const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * delta);
  lng = z * Math.cos(theta);
  lat = z * Math.sin(theta);
  return {
    lng: lng,
    lat: lat,
  };
}

function gpsToBaidu(lng, lat) {
  const location = gpsToGcj(lng, lat);
  return gcjToBaidu(location.lng, location.lat);
}

export { gpsToGcj, gcjToBaidu, baiduToGcj, gpsToBaidu };
