import ajax from 'zan-pc-ajax';
import { IStoreListRequest, IStoreListItem } from './type';

// 获取线下门店列表
export function getStoreList(data: IStoreListRequest) {
  return ajax<IStoreListItem[]>('/v4/trade/order/offlinelist.json', {
    method: 'GET',
    data,
  });
}
