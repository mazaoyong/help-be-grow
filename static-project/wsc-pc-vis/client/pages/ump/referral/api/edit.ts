import { visAjax } from 'fns/new-ajax';
import {
  ICreateActivityParams,
  IGoodsSkuItem,
  IUpdateActivityParams,
  IActivityDetail,
} from '../types';

// 创建活动
export function crateReferralActive(data: ICreateActivityParams) {
  return visAjax('POST', '/pct/referral/active.json', data);
}

// 修改活动
export function updateReferralActive(data: IUpdateActivityParams) {
  return visAjax('PUT', '/pct/referral/active.json', data);
}

// 活动详情
export function getReferralActive(data: { activityId: number }) {
  return visAjax<IActivityDetail>('GET', '/pct/referral/active.json', data);
}

export function getGoodsSku(data: { alias: string; kdtId: number }) {
  return visAjax<IGoodsSkuItem[]>('GET', '/goods-selector/goodSku.json', data);
}

// 获取分校详情
export function getCompusAPI(data) {
  return visAjax('GET', '/commom/shop/chain/findListByKdtIds.json', data);
}

// 商品列表
export function getGoodsList(data) {
  return visAjax('GET', '/pct/referral/goodsList.json', data);
}

// 查询分组列表
export function getGroupList(data) {
  return visAjax('GET', '/goods-selector/grouplist.json', data);
}

// 商品分组 X
export function getGoodsGroupList(data) {
  return visAjax('GET', '/pct/referral/goodsGroupList.json', data);
}
