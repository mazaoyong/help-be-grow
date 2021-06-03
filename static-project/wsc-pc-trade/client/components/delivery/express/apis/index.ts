import ajax from 'zan-pc-ajax';
import args from '@youzan/utils/url/args';
import { ITradeSetting } from 'definitions/delivery';
import { IExpressSetting, IExpressTemplate, IRegionMap } from 'definitions/delivery/express';
import {
  IGetExpressTemplateListReq,
  IGetExpressTemplateListRes,
  IUpdateExpressSettingReq,
  IGetTemplateDetailReq,
  IGetGoodsByIdReq,
  IGetGoodsByIdRes,
  IGetRegionMapReq,
  ICreateExpressTemplateReq,
  IUpdateExpressTemplateReq,
  IExpressCommonReq,
} from 'definitions/delivery/express/api';

const assignKdtId = (data = {} as any) => {
  const kdtId = args.get('kdtId', window.location.href);

  if (Number(kdtId) > 0) {
    data.kdtId = kdtId;
  }

  return data;
};

export function getTempList(data: IGetExpressTemplateListReq) {
  return ajax<IGetExpressTemplateListRes>({
    url: '/v4/trade/api/express/templates',
    method: 'GET',
    data: assignKdtId(data),
  });
}

export function getSetting() {
  return ajax<IExpressSetting>({
    url: '/v4/trade/api/express/setting',
    method: 'GET',
    data: assignKdtId(),
  });
}

export function updateSetting(data: IUpdateExpressSettingReq) {
  return ajax<boolean>({
    url: '/v4/trade/api/express/setting',
    method: 'POST',
    // 新接口请使用 contentType: 'application/json'
    contentType: 'application/x-www-form-urlencoded',
    data: assignKdtId(data),
  });
}

export function getTemplateDetail(data: IGetTemplateDetailReq) {
  return ajax<IExpressTemplate>({
    url: '/v4/trade/api/express/template',
    method: 'GET',
    data: assignKdtId(data),
  });
}

export function createTemp(data: ICreateExpressTemplateReq) {
  return ajax<number>({
    url: '/v4/trade/api/express/template',
    method: 'POST',
    contentType: 'application/json',
    data: assignKdtId({
      ...data,
      payType: 1, // 写死
    }),
  });
}

export function updateTemp(data: IUpdateExpressTemplateReq) {
  return ajax<number>({
    url: '/v4/trade/api/express/template',
    method: 'PATCH',
    contentType: 'application/json',
    data: assignKdtId(data),
  });
}

export function copyTemp(data: IExpressCommonReq) {
  return ajax<number>({
    url: '/v4/trade/api/express/template/replicate',
    method: 'POST',
    // 新接口请使用 contentType: 'application/json'
    contentType: 'application/x-www-form-urlencoded',
    data: assignKdtId(data),
  });
}

export function deleteTemp(data: IExpressCommonReq) {
  return ajax<number>({
    url: '/v4/trade/api/express/template',
    method: 'DELETE',
    contentType: 'application/json',
    data: assignKdtId(data),
  });
}

// 通过模板id获取商品，此接口在wsc-pc-trade中
export function getGoodsById(data: IGetGoodsByIdReq) {
  return ajax<IGetGoodsByIdRes>({
    url: '/v4/trade/delivery/goods.json',
    method: 'GET',
    data: assignKdtId(data),
  });
}

// 获取地址信息
export function getRegionList(data) {
  return ajax({
    method: 'GET',
    url: '/v4/trade/api/express/region',
    data,
  });
}

export function getTradeSetting() {
  return ajax<ITradeSetting>({
    method: 'GET',
    url: '/v4/trade/api/express/tradeSetting',
    data: assignKdtId(),
  });
}

export function getAllIdNameMap(data: IGetRegionMapReq) {
  return ajax<IRegionMap>({
    method: 'GET',
    url: '/v4/trade/api/express/regionmap',
    data,
  });
}

export const updateExpressDeliveryTicket = data => {
  return ajax({
    url: '/v4/trade/api/express/updateTicketprint',
    method: 'POST',
    contentType: 'application/json',
    data,
  });
};

// 获取自动打单设置
export const queryExpressDeliveryTicket = () => {
  return ajax({
    url: '/v4/trade/api/express/queryTicketprint',
    method: 'GET',
  });
};
