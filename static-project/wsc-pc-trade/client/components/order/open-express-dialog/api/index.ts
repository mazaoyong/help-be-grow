import ajax from 'zan-pc-ajax';
import { globalUrlBase } from '../const';
import {
  IExpressCompany,
  IGetDeliveryAddressesReq,
  IDeliveryAddresses,
  IGetPrinterListRes,
  IGetDeliveryFeeReq,
  IGetDeliveryFeeRes,
  IGetAlphaFeeReq,
  IGetAlphaFeeRes,
  ILocalPartnerWeightInfo,
  IGetDepositExpressRes,
  IExchangeGoodsRequest,
  IWechatDeliveryConfigReqeust,
  IWechatDeliveryConfigResponse,
} from '../type';

const makeRequest = <T = any>(method, path, data = {}) => {
  const options = {
    url: path.indexOf('v4') === -1 ? `${globalUrlBase}${path}` : path,
    method,
    data,
  };
  return ajax<T>(options);
};

export default {
  getDeliveryExpressCompanies() {
    const url = '/v4/trade/delivery/express.json';
    return makeRequest<IExpressCompany[]>('GET', url, {});
  },
  getDeliveryAddresses(data: IGetDeliveryAddressesReq) {
    const url = '/v4/trade/delivery/address.json';
    return makeRequest<IDeliveryAddresses[]>('GET', url, data);
  },
  getPrinterList() {
    const url = '/v4/trade/shop/device/printers.json';
    return makeRequest<IGetPrinterListRes>('GET', url, {});
  },
  getDepositExpress() {
    const url = '/v4/trade/shop/deposit/express.json';
    return makeRequest<IGetDepositExpressRes>('GET', url, {});
  },
  getDeliveryFee(data: IGetDeliveryFeeReq) {
    const url = '/v4/trade/delivery/fee.json';
    return makeRequest<IGetDeliveryFeeRes>('GET', url, data);
  },
  getAlphaFee(data: IGetAlphaFeeReq) {
    const url = '/v4/trade/delivery/alphaFee.json';
    return makeRequest<IGetAlphaFeeRes>('GET', url, data);
  },
  getLocalWeightInfo(data: { kdtId: number }) {
    const url = '/v4/trade/delivery/local/weights.json';
    return makeRequest<ILocalPartnerWeightInfo[]>('GET', url, data);
  },
  deliveryExchangeGoods(data: IExchangeGoodsRequest) {
    const url = '/v4/trade/refund/detail/deliveryExchangeGoods.json';
    return makeRequest<boolean>('POST', url, data);
  },
  searchWechatDeliveryConfig(data: IWechatDeliveryConfigReqeust) {
    return ajax<IWechatDeliveryConfigResponse>({
      url: '/v4/trade/delivery/wechat/config/search.json',
      method: 'GET',
      data,
    });
  },
  isAllowLocalExpress() {
    const url = '/v4/trade/delivery/isAllowLocalExpress.json';
    return makeRequest<boolean>('GET', url);
  },
};
