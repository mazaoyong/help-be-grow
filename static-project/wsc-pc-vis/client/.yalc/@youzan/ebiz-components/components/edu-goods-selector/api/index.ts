import { IFetchGoodsResult } from '../types';
import { ajaxVis } from './ajax-wrap';

/** 只适合于单纯选择教育商品的商品列表分页接口 */
export function fetchGoods(payload: any) {
  return ajaxVis<IFetchGoodsResult>('GET', '/edu-goods-selector/edu-goodslist.json', payload);
}

/** 商品列表分页接口（实际化接口，需要后端配置） */
export function fetchGoodsForUmp(payload: any) {
  return ajaxVis<IFetchGoodsResult>('GET', '/edu-goods-selector/goodslist.json', payload);
}

/** 获取商品选择器配置 */
export function getConfig(payload: any) {
  return ajaxVis('GET', '/edu-goods-selector/get-config.json', payload);
}

/** 商品分组分页接口 */
export function fetchFilterGroups(payload: any) {
  return ajaxVis('GET', '/edu-goods-selector/filter-groups.json', payload);
}
