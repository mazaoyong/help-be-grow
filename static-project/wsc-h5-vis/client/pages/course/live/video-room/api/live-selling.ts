import { ajax } from '@youzan/vis-ui';
import type { ILiveCouponQuery, ILiveCouponDTO } from 'definitions/api/owl/api/LiveCouponFacade/findCouponList';
import type { ILiveItemQuery, IPageRequest, ILiveItemDTO, IPageable } from 'definitions/api/owl/api/LiveItemFacade/findPage';
import { ILiveCouponReceiveCommand } from 'definitions/api/owl/api/CouponFacade/receiveCoupon';

interface IAjaxParams<Data> extends Record<string, any> {
  method: 'GET' | 'POST';
  url: string;
  data?: Data;
}
function ajaxWithType<Response, Query = any>(ajaxParams: IAjaxParams<Query>): Promise<Response> {
  return ajax(ajaxParams);
}

export function getCouponList(query: ILiveCouponQuery) {
  return ajaxWithType<ILiveCouponDTO[], ILiveCouponQuery>({
    method: 'GET',
    url: '/wscvis/course/live/live-selling/findCouponList.json',
    data: query,
    loading: true,
  });
}

interface IGetGoodsListRes {
  content: ILiveItemDTO[];
  pageable: IPageable;
  total: number;
}
interface IGetGoodsListQuery {
  query: ILiveItemQuery,
  pageRequest: IPageRequest,
}
export function getGoodsList(query: ILiveItemQuery, pageRequest: IPageRequest) {
  return ajaxWithType<IGetGoodsListRes, IGetGoodsListQuery>({
    method: 'GET',
    url: '/wscvis/course/live/live-selling/findGoodsList.json',
    data: { query, pageRequest },
  });
}

export function receiveCoupon(data: ILiveCouponReceiveCommand) {
  return ajaxWithType<boolean>({
    method: 'POST',
    url: '/wscvis/course/live/live-selling/receiveCoupon.json',
    data,
  });
}
