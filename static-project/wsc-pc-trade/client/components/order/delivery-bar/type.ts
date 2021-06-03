export interface IQueryCancelReasonReq {
  // 接入的物流渠道方：1.达达，2.蜂鸟，3.点我达 不允许为null
  deliveryChannel?: number;
  // appid
  appId?: string;
  // 云标
  isCloudTag?: boolean;
}

export interface IOrderCancelReason {
  // 取消原因
  reason: string;
  // 取消原因id
  id: number;
}

export interface IGetCancelDeductFeeReq {
  orderId: string;
}

export interface IGetCancelDeductFeeRes {
  deductFee: number;
}

export interface IFetchCityDetailReq {
  orderNo: string;
  packId: string;
  location?: boolean;
}

interface ICityDetailItem {
  business_code: string;
  category: string;
  img_url: string;
  item_id: string;
  name: string;
  num: number;
  url: string;
}

interface ICityDetailRecord {
  date_time: string;
  name: string;
  phone: string;
  status_str: string;
}

export interface IFetchCityDetailRes {
  address: string;
  buyer_lat: number;
  buyer_lng: number;
  channel: number;
  channel_str: string;
  deduct_fee: number;
  delivery_fee: number;
  items: ICityDetailItem[];
  kdt_id: number;
  order_no: string;
  pack_id: string;
  record: ICityDetailRecord[];
  shop_lat: number;
  shop_lng: number;
  shop_position_source: number;
  status: number;
  transporter_lat: number;
  transporter_lng: number;
  tip_fee: number;
}

export interface ICancelCallReq {
  orderNo: string;
  packId: string;
  cancelReasonId: number;
  cancelReason: string;
  currentStatus: number;
}

export interface IRecallDeliveryReq {
  packId: string;
  orderNo: string;
}

export interface IAddTipReq {
  orderNo: string;
  packId: string;
  tips: number;
}
