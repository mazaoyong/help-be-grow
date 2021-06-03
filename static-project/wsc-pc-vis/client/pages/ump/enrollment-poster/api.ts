import { visAjax } from 'fns/new-ajax';
import { IPosterItemData, VersionEnum } from './types';
import ajax from 'zan-pc-ajax';

type TQuery = {
  id?: number;
  title?: string;
};

export interface IGetListParams {
  pageSize: number;
  pageNumber: number;
  query?: TQuery;
}

export interface IPosterDrawDTO {
  distanceX: number;
  distanceY: number;
  qrcodeWidth: number;
  qrcodeHeight: number;
  textUrl?: string;
}

export interface IBaseParams {
  templateType: number;
  relevantContext: string;
  relevantContextType: number;
  designId: string;
  title: string;
  templatePicUrl: string;
  qrcodeUrl: string;
  bgImageWidth?: number;
  bgImageHeight?: number;
  drawQrcodeDTO?: IPosterDrawDTO;
  drawTextDTO?: IPosterDrawDTO;
  version: VersionEnum;
}

export interface ICreateParams extends IBaseParams {
  resourceAlias: string;
}

export interface IEditParams extends IBaseParams {
  id: number;
}

// 获取列表
export function getList(params: IGetListParams) {
  return visAjax('GET', '/ump/enrollment-poster/list.json', params);
}

// 保存
export function createPoster(params: ICreateParams) {
  return visAjax('POST', '/ump/enrollment-poster/create.json', params);
}

// 编辑
export function editPoster(params: IEditParams) {
  return visAjax('POST', '/ump/enrollment-poster/edit.json', params);
}

// 获取详情
export function getById({ id }: { id: number }): Promise<IPosterItemData> {
  return visAjax('GET', '/ump/enrollment-poster/getById.json', { id });
}

// 删除
export function deletePoster({ id }: { id: number }) {
  return visAjax('POST', '/ump/enrollment-poster/delete.json', { id });
}

// 获取二维码
export function getQrcode(url: string, options: any = {}) {
  return visAjax('GET', '/pct/biz/getWscQrcode.json', {
    url: url,
    width: 280,
    height: 280,
    ...options,
  });
}

// 获取微页面列表
export function getMicroPageList(params) {
  return ajax({
    url: `${_global.url.www}/showcase/feature/shortList.json`,
    method: 'GET',
    data: params,
  });
}

// 商品选择器
// 查询知识列表
export function getGoodsList(data) {
  return visAjax('GET', '/goods-selector/goodslist.json', data);
}

// 获取sku列表
export function getSkuInfo(data) {
  return visAjax('GET', '/goods-selector/goodInfo.json', data);
}
