import ajax from 'zan-pc-ajax';
import {
  IQueryCancelReasonReq,
  IOrderCancelReason,
  IGetCancelDeductFeeReq,
  IGetCancelDeductFeeRes,
  IFetchCityDetailReq,
  IFetchCityDetailRes,
  ICancelCallReq,
  IRecallDeliveryReq,
  IAddTipReq,
} from './type';

export default {
  fetchCityDetail(data: IFetchCityDetailReq) {
    return ajax<IFetchCityDetailRes>({
      url: '/v4/trade/delivery/local/cityDetail.json',
      method: 'GET',
      data,
    });
  },
  queryCancelReason(data: IQueryCancelReasonReq) {
    return ajax<IOrderCancelReason[]>({
      url: '/v4/trade/delivery/local/getOrderCancelReasons.json',
      method: 'GET',
      data,
    });
  },
  getCancelDeductFee(data: IGetCancelDeductFeeReq) {
    return ajax<IGetCancelDeductFeeRes>({
      url: '/v4/trade/delivery/local/getCancelDeductFee.json',
      method: 'GET',
      data,
    });
  },
  // 达达配送取消
  cancelCall(data: ICancelCallReq) {
    return ajax({
      url: '/v4/trade/delivery/local/cancelCall.json',
      method: 'POST',
      // 新接口请使用 contentType: 'application/json'
      contentType: 'application/x-www-form-urlencoded',
      data,
    });
  },
  // 同城送第三方配送重新呼叫
  recallDelivery(data: IRecallDeliveryReq) {
    return ajax({
      url: '/v4/trade/delivery/local/reCall.json',
      method: 'POST',
      // 新接口请使用 contentType: 'application/json'
      contentType: 'application/x-www-form-urlencoded',
      data,
    });
  },
  // 加小费
  addTip(data: IAddTipReq) {
    return ajax({
      url: '/v4/trade/delivery/local/addTip.json',
      method: 'POST',
      // 新接口请使用 contentType: 'application/json'
      contentType: 'application/x-www-form-urlencoded',
      data,
    });
  },
};
