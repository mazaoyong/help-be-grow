import ajax from 'zan-pc-ajax'; // eslint-disable-line
import { IGetIsOnlineShopRes } from './type';

export const getBranchShopList = () => {
  return ajax<IGetIsOnlineShopRes[]>('/v4/trade/order/findShopNodeList.json', {
    method: 'GET',
  });
};
