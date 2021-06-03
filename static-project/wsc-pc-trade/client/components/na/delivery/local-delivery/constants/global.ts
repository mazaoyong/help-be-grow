import _at from 'lodash/at';
import _every from 'lodash/every';
import _get from 'lodash/get';

import { baiduToGaode } from '../format';
import { versionCompare } from '../utils';

export interface IShopContact {
  address: string;
  areaCode: string;
  county: string;
  countyId: number;
  kdtId: number;
  lat: string;
  lng: string;
  phoneNumber: string;
  qq: string;
  setAddress: boolean;
  setAreaCode: boolean;
  setCounty: boolean;
  setCountyId: boolean;
  setKdtId: boolean;
  setLat: boolean;
  setLng: boolean;
  setPhoneNumber: boolean;
  setQq: boolean;
}

interface ILocalDeliveryGlobal extends IWscPcTradeGlobal {
  shopContact: IShopContact;
}

/**
 * 显示小程序升级提示
 */
export const showWeappWarning = _global.weappVersion
  ? versionCompare(_global.weappVersion, '1.19.7') < 0
  : false;

/**
 * 店铺联系方式
 */
export const shopContact = (_global as ILocalDeliveryGlobal).shopContact;

/**
 * 店铺联系方式中的经纬度信息是百度地图的信息，前端使用时转成高德地图的信息
 */
export const [gaodeLng, gaodeLat] = baiduToGaode([shopContact.lng, shopContact.lat]);

/**
 * 判断商家是否在 "设置-联系我们" 中设置过地址
 */
export const isExistAddr = _every(
  _at(shopContact, ['setAddress', 'setAreaCode', 'setCounty', 'setCountyId']),
);

const areaCode = shopContact.areaCode !== '' ? `${shopContact.areaCode}-` : '';
const province = _get(_global, 'shopInfo.province', '');
const city = _get(_global, 'shopInfo.city', '');
const county = _get(_global, 'shopInfo.county', '');
const addressDetail = _get(_global, 'shopInfo.address', '');
export const address = `${province}${city}${county}${addressDetail}（电话：${areaCode}${shopContact.phoneNumber}）`;
