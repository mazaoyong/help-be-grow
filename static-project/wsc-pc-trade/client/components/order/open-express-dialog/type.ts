export interface IExpressCompany {
  allType: number[];
  // 快递公司名称
  expressName: string;
  // 是否需要支付
  isPay: boolean;
  // 类型：1.电子面单  2.电子面单+上门取件
  type: number;
  // 快递公司编号
  expressId: number;
}

export interface IGetDeliveryAddressesReq {
  // 物流公司编号
  expressId?: number;
}

export interface IDeliveryAddresses {
  // 发货地址详细地址（不包含省市区）
  address: string;
  // 发货地址市
  cityName: string;
  // 审核单编号
  auditNo: string;
  // 发货地址省
  provinceName: string;
  // 发货地址区
  countyName: string;
}

export interface IDeviceLog {
  createdAt: string;
  // 设备ID
  peripheralManagementId: number;
  // 店铺ID
  kdtId: number;
  // 操作人
  adminId: number;
  // 操作类型
  operationType: number;
  // 布局ID
  id: number;
  // 操作内容
  content: string;
  // 扩展信息
  extraInfo: string;
  updatedAt: string;
}

export interface IPrinter {
  // 连接key
  equipmentKey: string;
  // 设备型号名称
  equipmentTypeName: string;
  // 操作日志
  deviceLogList: IDeviceLog[];
  // 店铺id
  kdtId: number;
  // 机身号
  equipmentNumber: string;
  // 版本号
  version: number;
  // 外设类型id
  peripheralTypeId: number;
  // 创建时间
  createdAt: string;
  // 设备型号
  equipmentTypeId: number;
  // 外设类型名称
  peripheralTypeName: string;
  // 设备名称
  name: string;
  // 设备id
  id: number;
  // 设备状态
  status: number;
  // 更新时间
  updatedAt: string;
  // 扩展信息
  extraInfo: string;
}

export interface IGetPrinterListRes {
  items: IPrinter[];
  paginator: {
    page: number;
    pageSize: number;
    totalCount: number;
  };
}

export interface IGetDeliveryFeeReq {
  orderNo: string;
  distWeight: number;
  expressId: number;
  auditNo: string;
  deliveryType: number;
}

export interface IGetDeliveryFeeRes {
  // 配送渠道
  distChannel: number;
  depositUrl?: string;
  // 运费(单位：分)
  fee: number;
  // 是否使用了智能发货推荐
  usrAlphaExpress: boolean;
  // 资费状态  -1：余额异常；1：余额充足；2：余额不足
  feeStatus: number;
  // 智能发货扩展信息
  extraAlphaMessage: string;
}

export interface IGetAlphaFeeReq {
  orderNo: string;
  alphaExpressEnable: boolean;
}

export type IGetAlphaFeeRes = Omit<IGetDeliveryFeeRes, 'depositUrl'>;

export interface ILocalPartnerWeightInfo {
  // 第三方同城配送渠道名称
  deliveryChannelName: string;
  // 第三方同城配送渠道id  {@link com.youzan.delivery.constants.TakeoutDeliveryChannelEnum}
  deliveryChannel: number;
  // 应用appId
  appId: string;
  // 是否是云服务商
  isCloudTag: boolean;
  // 重量上限，单位g
  maxWeight: number;
  // 首重重量，单位g
  initialWeight: number;
}

export interface IGetDepositExpressRes {
  canChangeQuota: number;
  canDeduct: number;
  canRejoin: number;
  depositAvl: number;
  depositQuota: number;
  depositState: number;
  depositStateName: string;
  depositType: number;
  depositTypeName: string;
  desc: string;
  isDefaultDeposit: boolean;
  isJoined: number;
  isQuitting: number;
  kdtId: string;
  remark: string;
  showDetail: number;
  showReceipt: number;
  sourceType: number;
  sourceTypeName: string;
  userNo: string;
  waterNo: number;
  waterNoStr: string;
}

export interface IPickTime {
  day: number | string;
  time: number;
}

export interface IExpressWayBill {
  accountNo?: string;
  expressWayBillType: number;
  expressId: number;
  auditNo: string;
  pickTime: IPickTime;
  expressFee: number;
  expressName: string;
  isPay: boolean;
  weight: number;
  printerId: number;
  printerKey?: string;
  printerDeviceNo?: string;
  printerChannel?: number;
  startAppointment?: number;
  endAppointment?: number;
}

export interface ICityChannelListItem {
  app_id: string;
  channel: number;
  is_cloud_tag: boolean;
  name: string;
  expired?: boolean;
}

export interface IDeliveryWindowItemDetailInfo {
  // 配送公司名称
  dist_company_name: string;
  // 配送单号
  dist_id: string;
  // 物流单号
  express_no: string;
  // 商品ID
  goods_id: number;
  // 商品数量
  num: number;
  // 单品多运其他包裹数量
  other_num: number;
  // 发货类型
  delivery_type: number;
  // 配送状态描述
  dist_status_desc: string;
  // 商品是否可选发货
  allow_check: boolean;
  // 商品发货状态描述
  delivery_status_desc: string;
  // 商品链接
  url: string;
  // 商品图片
  img_url: string;
  // 订单商品ID
  item_id: string;
  // 退款状态码  无退款中记录 no_refund  有退款中记录 had_process_refund  申请中退款都已经全部处理 all_done_refund
  refund_status_code: string;
  // 商品的配送状态
  dist_status: number;
  // 商品名称
  name: string;
  // 加料商品
  cy_ingredient_items: IDeliveryWindowItemDetailInfo[];
  // 配送公司编号
  dist_company_id: number;
  // 商品类目
  category: string;
  // 商品sku_iD
  sku_id: number;
  // 商品发货状态
  delivery_status?: number;
  weight: number;

  // 前端使用字段
  isLocalDelivery?: boolean;
  isSend: boolean;
}

export interface IGetDeliveryDetailRes {
  // 是否开启单品多运
  open_multiple_delivery?: boolean;
  // 是否开启智选发货
  alpha_express_enable?: boolean;
  // 自提信息
  self_fetch?: {
    fetch_address: string;
    fetch_name: string;
    fetch_time: string;
    user_tel: string;
    user_name: string;
  };
  // 配送方式描述
  dist_type_desc?: string;
  // 商品明细
  item_detail_info_list?: IDeliveryWindowItemDetailInfo[];
  // 是否整单发货
  is_whole_send?: boolean;
  // 无需发货
  no_need_to_deliver?: boolean;
  // 配送方式
  dist_type?: number;
  // 门店ID
  store_id?: number;
  // 是否开启同城配送
  open_city_delivery?: boolean;
  // 电子面单异常信息
  electronic_sheet_exception_info?: {
    electronic_sheet_exception_desc: string;
    electronic_sheet_exception_code: number;
  };
  // 开通的同城配送渠道
  city_channel_list: ICityChannelListItem[];
  // 周期购信息
  multi_period_delivery_info?: {
    delivery_time: string;
    last_estimate_delivery_time: string;
    period: number;
  };
  // 店铺余额，同城配送呼叫三方配送需要用到（单位：分）
  balance?: number;
  // 支持发货列表
  support_delivery_types?: string[];
  // 收货人信息
  consignee_info?: {
    consignee_name: string;
    consignee_tel: string;
    consignee_address: string;
  };
  // 待发货数量
  un_delivery_count?: number;
  delivery_count?: number;
  deliveryAutomaticThirdCall?: {
    appointedDeliveryTime?: number;
  };
}

export interface IModel extends IGetDeliveryDetailRes {
  hasRefund?: boolean;
  // 是否是换货 仅前端使用
  isExchange: boolean;
}

interface IExpressItem {
  expressId?: number | '';
  expressNo?: string;
  expressName?: string;
}

export interface IItemPack {
  express: IExpressItem;
  num: number | string;
}

export interface ILocalDelivery {
  distWeight: number;
  tip: number | string;
  fee: number;
  totalFee: number | string;
  channel?: IGetAlphaFeeRes['distChannel'];
  appId?: string;
  isCloudTag: boolean;
  channelName?: string;
  feeStatus: number;
  depositUrl?: string;
}

export interface ISelfFetchInfo {
  selfFetchNo: string;
}

export interface IDeliveryInfo {
  deliveryType: number;
  isSingleGoodsMultiExpress?: boolean;
  expressWayBill?: IExpressWayBill;
  express?: IExpressItem;
  itemPackList?: IItemPack[];
  localDelivery?: Partial<ILocalDelivery>;
  selfFetchInfo?: ISelfFetchInfo;
}

export interface IExchangeGoodsRequest {
  // 物流公司编号
  companyCode?: number;
  // 物流公司运单号
  logisticsNo?: string;
  // 订单号
  orderNo: string;
  // 售后维权单单号
  refundId: string;
  // 售后流程版本号
  version: number;
}

export enum BindStatus {
  Success = 0,
  Waiting = 1,
  Failed = 2,
  Unbind = 3,
}

export interface IWechatServiceType {
  // 服务类型ID
  serviceType: number;
  // 服务类型名称
  serviceName: string;
}

export interface ISenderAddress {
  // 联系人
  contactUserName: string;
  // 详细地址
  address: string;
  // 市
  cityName: string;
  // 联系电话
  contactUserPhone: string;
  // 省
  provinceName: string;
  // 县/区
  countyName: string;
  // 完整地址
  name?: string;
}

export interface IWechatDeliveryBindAccount {
  // 该账号已选择的服务类型
  selectedServiceType: IWechatServiceType;
  // 该账号关联的发货地址
  addressDTO: ISenderAddress;
  // 商家绑定的快递账号在物流侧的编码  由logistics生产、维护
  bindNo: string;
  // 商家在快递公司的客户编码(或者账号)
  bizId: string;
  // 快递公司账号绑定审核状态
  bindStatusMsg: string;
  bindStatusCode: BindStatus;
}

export interface IWechatDeliveryExpress {
  // 快递公司名称
  expressName: string;
  deliveryBindAccountDTOS: IWechatDeliveryBindAccount[];
  // 该快递公司支持的所有服务类型
  allSupportedServiceTypes: IWechatServiceType[];
  // 快递公司ID
  expressId: number;
}

export interface IWechatDeliveryConfigResponse {
  // 商家是否将其小程序的快递配送权限集授权给有赞
  isWxLogisticsAuthorized: boolean;
  // 商家所有通过微信公众平台绑定的快递公司账号
  wechatDeliveryExpressAggDTOS: IWechatDeliveryExpress[];
  // 商家是否开通微信小程序
  isWxappOpened: boolean;
  // 商家所有可用的发货地址
  allSenderAddress?: ISenderAddress[];
}

export interface IWechatDeliveryConfigReqeust {
  // 是否查询打印员信息
  includePrinterInfo?: boolean;
  // 是否返回店铺的所有发货地址
  includeAllSupportDeliveryAddress?: boolean;
}

export interface IWechatExpressWayBill {
  expressId: number;
  expressName: string;
  accountNo: string;
  weight: number;
}
