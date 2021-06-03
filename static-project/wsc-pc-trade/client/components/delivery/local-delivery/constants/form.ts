import { IDeliveryShopClient } from 'definitions/local-delivery/config';

import { shopContact } from './global';

/**
 * 配送区域设置
 */
export const DELIVERY_MODE = {
  AREA: 1 as const, // 不同地区不同配送费
  DISTANCE: 2 as const, // 不同距离不同配送费
  SIMPLE: 3 as const, // 简易版
};

/**
 * 配送选择区域类型
 */
export const COVERS_TYPE = {
  Circle: 1 as const, // 圆形
  Polygon: 2 as const, // 自定义多边形
};

/**
 * 开通服务商和设置业务类型的共同参数
 */
const areaCode = shopContact.areaCode !== '' ? `${shopContact.areaCode}-` : '';
export const deliveryShopCommonParams: Omit<IDeliveryShopClient, 'business'> = {
  contactName: _global.shopInfo.contactName,
  provinceName: _global.shopInfo.province,
  countyName: _global.shopInfo.county,
  cityName: _global.shopInfo.city,
  idCard: '',
  lng: shopContact.lng,
  lat: shopContact.lat,
  phone: `${areaCode}${shopContact.phoneNumber}`,
  positionSource: 2, // 老的经纬度数据使用的是百度的地图源，线上数据无法辨识来自哪个地图源，无法兼容，继续保存为百度数据
  stationAddress: _global.shopInfo.address,
  stationName: _global.shopInfo.shopName as string,
};

export const CLOUD_CHANNEL = 9;
