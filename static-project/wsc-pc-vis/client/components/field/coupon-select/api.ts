import ajax from 'zan-pc-ajax';

const isSuperStore = _global.isSuperStore;
const BASE_URL = `${isSuperStore ? _global.url.store : _global.url.base}/v4`;

interface PaginationParams {
  pageSize: number;
  page: number;
  totalCount: number;
}

interface DataResponse<T> {
  paginator: PaginationParams;
  items: T[];
}

export interface ICouponListItem {
  /** 活动展示类型描述文案 */
  activityDisplayTypeCopywriting?: string;
  /** 活动类型 */
  activityType?: number;
  /** 适用商品范围描述 */
  applicableGoodRangeDesc?: string;
  /** 适用店铺文案描述 例如：部分店铺，全部店铺 */
  applicableShopRangeDesc?: string
  /** 活动平台类型 0:通用平台 1:三方平台 */
  externalPlatformType?: number;
  /** 创建者店铺类型： 0：总店创建，1：网店创建，2：门店创建, 3：合伙人创建 */
  founder?: number;
  /** 优惠活动id */
  id: number;
  /** 是否可以选择 */
  isSelectable?: boolean;
  /** 优惠内容描述文案 */
  preferentialCopywriting: string;
  /** 剩余库存-这里指剩余发放库存 */
  remainStock?: number;
  /** 活动备注 */
  remark?: string;
  /** 活动创建者 店铺名称 */
  shopName?: string;
  /** 领取链接 */
  takeUrl: string;
  /** 优惠券title */
  title: string;
  /** 不可选择的原因 */
  unSelectReason?: string;
  /** 用户身份限制文案 */
  userIdentityLimitCopywriting?: string;
  /** 用户限领次数描述文案 */
  userTakeLimitCopyWriting?: string;
  /** 有效时间文案 */
  validTimeCopywriting?: string;
  /** 选择的优惠券数量（非接口返回） */
  amount?: string;
}

interface IGetCouponListParams {
  titleKeyword: string;
  pageNum: number;
  pageSize: number;
  activityTypeGroup: number;
  refActivityScene: string;
}

export function getNewCouponList(data: IGetCouponListParams) {
  return ajax<DataResponse<ICouponListItem>>({
    method: 'get',
    url: `${BASE_URL}/ump/common/api/coupon-list`,
    data,
  });
}
