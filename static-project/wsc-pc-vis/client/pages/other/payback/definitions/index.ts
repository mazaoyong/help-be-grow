/**
 * @description 申请状态
 * @enum {number}
 */
export enum AuditStatus {
  待开通 = 0,
  已开通 = 1,
  审核中 = 2,
}

/**
 * @description 查询担保相关数额数据 结果字段
 * @export
 * @interface ISecuredInfoResult
 */
export interface ISecuredInfoResult {
  calcOrders: {
    /** 快速回款订单 */
    orderCount: number;

    /** 快速回款金额 */
    totalAmount: number;
  };
  joinTime: string;
  records: {
    content: Array<{
      /** 动作:加入或者退出 */
      recordDesc: string;
      /** 操作日期 */
      createTime: number;
      /** 操作人员手机号码 */
      operator: {
        mobile: string;
        userId: number;
        nickName: string;
      }
    }>;
    pageable: {
      pageSize: number;
      pageNumber: number;
    };
    total: number;
  },
  status: number;
}

/**
 * @description 检查店铺是否符合开通条件 结果字段
 * @export
 * @interface ICheckApplyResult
 */
export interface ICheckApplyResult {
  kdtId: number;
  list: Array<{
    check: string;
    result: boolean;
    type: string;
  }>;
}
