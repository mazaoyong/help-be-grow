export interface IPaginator {
  total: number;
  page: number;
  pageSize: number;
}

/**
 * com.youzan.retail.shop.api.hq.vo.OrganizationVO
 * 设置 -> 店铺设置 -> 组织机构 查询返回的 VO
 */
export interface IOrganizationVO {
  /** 经营状态描述 */
  orgOperateStatusDesc?: string;
  /** 城市 */
  city?: string;
  /** 总部版kdt_id */
  hqKdtId?: number;
  /** 是否开启网店  true 开启  false 关闭 */
  isOnlineOpen?: boolean;
  /** 是否展示合伙人隔离开关 */
  partnerLimitSwitch?: boolean;
  /** 门店kdt_id */
  storeKdtId?: number;
  /** 区 */
  county?: string;
  /** 云pos点数量(optional appendPosPointNum=true时返回) */
  posPointNum?: number;
  /** 父类kdt_id */
  parentKdtId?: number;
  /** 门店状态 */
  storeStatus?: string;
  /** 客服电话区号 */
  customerServiceAreaCode?: string;
  /** 省份 */
  province?: string;
  /** 门店生命周期到期时间（optional，appendShopLifecycleEndTime=true时返回） */
  lifecycleEndTime?: string;
  /** 经营状态 */
  orgOperateStatus?: number;
  /** 店铺logo */
  logo?: string;
  /** 门店名称 */
  storeName?: string;
  /** 是否展示网店切换 */
  isShowOnlineShopSwitch?: boolean;
  /** 店长手机号码 */
  storeManagerPhone?: string;
  /** 门店类型：直营 1 or 加盟 2 */
  storeType?: number;
  /** 线下营业时间模式 1：全天 2：每天重复 3：每周重复  see HQStoreBusinessModeEnum */
  businessTimeStatus?: number;
  /** 客服电话或手机号。输入手机号时区号可为空 */
  customerServicePhoneNumber?: string;
  /** 门店地址（全地址） */
  storeAddress?: string;
  /** 库存同步模式：0:供货，1:铺货 */
  supplyModel?: number;
  /** 店长名称 */
  storeManagerName?: string;
  /** 是否开启线下店  true 开启  false 关闭 */
  isOfflineOpen?: boolean;
}

export interface IListWithPaginatorVO {
  paginator?: IPaginator;
  items?: IOrganizationVO[];
}
