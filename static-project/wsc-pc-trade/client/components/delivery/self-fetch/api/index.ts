import ajax from 'zan-pc-ajax'; // eslint-disable-line
import args from '@youzan/utils/url/args';

import { IDeliverySetting } from 'definitions/self-fetch';
import { ISelfFetchPointDTO } from 'definitions/self-fetch/api';

import {
  IUpdateSettingReq,
  IFetchSelfFetchPointsListReq,
  IFetchSelfFetchPointsListRes,
  ISelfFetchCodesRes,
  ISelfWriteOffReq,
} from 'definitions/self-fetch/api';

const WWW_URL = _global.url.www;

const V4_API = '/v4/trade/api/self-fetch';

const assignKdtId = (data = {} as any) => {
  const kdtId = args.get('kdtId', window.location.href);

  if (Number(kdtId) > 0) {
    data.kdtId = kdtId;
  }

  return data;
};

/**
 * 获取上门自提状态
 */
export const getSettingInfo = () => {
  return ajax<IDeliverySetting>(`${V4_API}/getSetting.json`, {
    method: 'GET',
    data: assignKdtId(),
  });
};
/**
 * 更新上门自提状态
 */
export const updateSettingInfo = (data: IUpdateSettingReq) => {
  return ajax<boolean>(`${V4_API}/updateSetting.json`, {
    method: 'PUT',
    // 新接口请使用 contentType: 'application/json'
    contentType: 'application/x-www-form-urlencoded',
    data: assignKdtId(data),
  });
};
/**
 * 获取是否有上门自提点
 */
export const fetchHasSelfFetchPoints = () => {
  return ajax<boolean>(`${V4_API}/has-self-fetch-points`, {
    method: 'GET',
    data: assignKdtId(),
  });
};
/**
 * 获取上门自提点列表
 */
export const fetchSelfFetchPointsList = (data: IFetchSelfFetchPointsListReq) =>
  ajax<IFetchSelfFetchPointsListRes>(`${V4_API}/fetch-self-fetch-points`, {
    method: 'GET',
    data,
  });
/**
 * 获取提货码图片
 */
export const fetchSelfFetchCodes = async () =>
  ajax<ISelfFetchCodesRes>(`${WWW_URL}/trade/selffetch/codes.json`, {
    method: 'GET',
  });

/**
 * 设置自主核销开启或关闭
 */
export const setWriteOffConfig = (data: ISelfWriteOffReq) => {
  const url = '/v4/trade/order/setWriteOffConfig.json';
  return ajax<boolean>(url, {
    method: 'POST',
    // 新接口请使用 contentType: 'application/json'
    contentType: 'application/x-www-form-urlencoded',
    data,
  });
};
export const getWriteOffConfig = () => {
  const url = '/v4/trade/order/getWriteOffConfig.json';
  return ajax<boolean>(url, {
    method: 'GET',
  });
};
/**
 * 创建自提点
 */
export const createSelfFetchPoint = data => {
  return ajax<number>(`${V4_API}/create-self-fetch-point`, {
    method: 'POST',
    data: assignKdtId(data),
    contentType: 'application/json',
  });
};
/**
 * 删除自提点
 */
export const deleteSelfFetchPoint = data =>
  ajax<boolean>(`${V4_API}/delete-self-fetch-point`, {
    method: 'POST',
    // 新接口请使用 contentType: 'application/json'
    contentType: 'application/x-www-form-urlencoded',
    data,
  });
/**
 * 更新自提点
 */
export const updateSelfFetchPoint = data => {
  return ajax<boolean>(`${V4_API}/update-self-fetch-point`, {
    method: 'POST',
    data: assignKdtId(data),
    contentType: 'application/json',
  });
};
/**
 * 获取自提点信息
 */
export const getSelfFetchPoint = data => {
  return ajax<ISelfFetchPointDTO>(`${V4_API}/get-self-fetch-point`, {
    method: 'GET',
    data: assignKdtId(data),
  });
};
