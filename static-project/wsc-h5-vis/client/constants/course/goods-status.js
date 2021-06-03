/** 商品状态 */
export const GOODS_STATUS = {
  /** 删除 */
  DELETE: 0,
  /** 上架 */
  SELLING: 1,
  /** 售罄 */
  SOLDOUT: 2,
  /** 下架 */
  UNSELL: 3,
  /** 预售 */
  PRESELL: 4,
};

export const GOODS_STATUS_MESSAGE = {
  [GOODS_STATUS.DELETE]: '课程已经失效了，看看其他课程吧',
  [GOODS_STATUS.SOLDOUT]: '报名人数已满，看看其他课程吧',
  [GOODS_STATUS.UNSELL]: '课程停止报名了，看看其他课程吧',
};
