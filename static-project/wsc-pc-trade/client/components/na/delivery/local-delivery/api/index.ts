import ajax from 'zan-pc-ajax';
import args from '@youzan/utils/url/args';
import { IPartner, IPartnerFeeInfo, ISetting } from 'definitions/local-delivery';
import {
  IEnableCommonPeq,
  IQuerySimulationReq,
  ISimulationRes,
  ITogglePartnersReq,
  IUpdateSettingReq,
} from 'definitions/local-delivery/api';
import {
  IDeliveryConfig,
  IDeliveryShop,
  IDeliveryShopClient,
} from 'definitions/local-delivery/config';

const V4_API = '/v4/trade/api/local-delivery';

const assignKdtId = (data = {} as any) => {
  const kdtId = args.get('kdtId', window.location.href);

  if (Number(kdtId) > 0) {
    data.kdtId = kdtId;
  }

  return data;
};

/**
 * 获取同城配送开关状态
 */
export const getSetting = () => {
  return ajax<ISetting>(`${V4_API}/getSetting.json`, {
    method: 'GET',
    data: assignKdtId(),
  });
};
/**
 * 更新同城配送开关状态
 */
export const updateSetting = (data: IUpdateSettingReq) => {
  return ajax<boolean>(`${V4_API}/updateSetting.json`, {
    method: 'PUT',
    contentType: 'application/json',
    data: assignKdtId(data),
  });
};
/**
 * 获取同城配送设置
 */
export const getConfig = () => {
  return ajax<IDeliveryConfig>(`${V4_API}/getAllConfig.json`, {
    method: 'GET',
    data: assignKdtId(),
  });
};

/**
 * 保存同城配送设置
 */
export const saveConfig = (data: Omit<IDeliveryConfig, 'deliveryShop'>) => {
  return ajax(`${V4_API}/saveAllConfig.json`, {
    method: 'POST',
    contentType: 'application/json',
    data: assignKdtId(data),
  });
};
/**
 * 保存业务类型（第一次，创建物流门店）
 */
export const createLocalShop = (data: Partial<IDeliveryShopClient>) => {
  return ajax(`${V4_API}/createLocalShop.json`, {
    method: 'POST',
    contentType: 'application/json',
    data: assignKdtId(data),
  });
};
/**
 * 保存业务类型（非第一次，只更新业务类型）
 */
export const updateShop = (data: IDeliveryShopClient) => {
  return ajax(`${V4_API}/updateShop.json`, {
    method: 'POST',
    contentType: 'application/json',
    data: assignKdtId(data),
  });
};
/**
 * 获取本地服务商列表
 */
export const getLocalPartnersList = () => {
  return ajax<IPartner[]>(`${V4_API}/getLocalPartnersList.json`, {
    method: 'GET',
    data: assignKdtId({
      provinceName: _global.shopInfo.province,
      cityName: _global.shopInfo.city,
      countyName: _global.shopInfo.county,
    }),
  });
};

/**
 * 获取服务商配费说明
 */
export const getLocalPartnerFeeInfo = (data: IEnableCommonPeq) => {
  return ajax<IPartnerFeeInfo>(`${V4_API}/getLocalPartnerFeeInfo.json`, {
    method: 'GET',
    data: assignKdtId(data),
  });
};
/**
 * 开关服务商服务
 */
export const togglePartners = (data: ITogglePartnersReq) => {
  return ajax<boolean>(`${V4_API}/togglePartners.json`, {
    method: 'POST',
    contentType: 'application/json',
    data: assignKdtId(data),
  });
};
/**
 * 申请开通服务商
 */
export const enablePartner = (data: IEnableCommonPeq & Partial<IDeliveryShop>) => {
  return ajax<boolean>(`${V4_API}/enablePartner.json`, {
    method: 'POST',
    contentType: 'application/json',
    data: assignKdtId(data),
  });
};
/**
 * 智能发货仿真请求
 */
export const querySimulation = (data: IQuerySimulationReq) => {
  return ajax<ISimulationRes>(`${V4_API}/querySimulation.json`, {
    method: 'GET',
    data: assignKdtId(data),
  });
};
