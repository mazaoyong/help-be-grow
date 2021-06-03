import { cloneDeep } from 'lodash';

const mapFieldNameToDisaledMsg = {
  groupon: '该商品正在参加多人拼团活动，活动结束或失效后才能修改信息',
  ladderGroupon: '该商品正在参加阶梯拼团活动，活动结束或失效后才能修改信息',
  collectzan:
    '该商品正在参加好友助力活动，该商品正在参加多人拼团活动，活动结束或失效后才能修改信息',
  packageBuy: '该课程正在参加优惠套餐活动，活动结束或失效后才能修改信息',
  timeLimitedDiscount: '该课程正在参加限时折扣活动，活动结束或失效后才能修改信息',
  seckill: '该商品正在参加秒杀活动，活动结束或失效后才能修改信息',
  pointsExchange: '该商品正在参加积分商城活动，活动结束或失效后才能修改信息',
  recommendPolite: '该商品正在参加推荐有奖活动，活动结束或失效后才能修改信息',
};

export const checkFieldDisabled = (params: {
  key: string;
  productLock: any[];
  // TODO(meijing): 暂时增加的过滤机制，后续日常跟进
  /** 前端已全类型课程支持商品锁，因测试资源投入不足，目前仅「推荐有奖」在内容、专栏、直播中支持商品锁，其他活动需过滤“暂不支持”。 */
  needFilter?: boolean;
}): {
  disabled?: boolean;
  disabledMsg?: string;
} => {
  const { key, productLock, needFilter } = params;

  const fieldNameList = needFilter ? ['recommendPolite'] : Object.keys(mapFieldNameToDisaledMsg);

  if (Array.isArray(productLock)) {
    const _productLock = cloneDeep(productLock);

    for (const lockField of _productLock) {
      let fields = lockField?.fields;
      // 容错处理
      if (fields && fieldNameList.includes(lockField.name)) {
        // 商品锁前置处理，sku -> sku && stockDetail
        if (fields.includes('sku')) {
          fields = fields.concat(['stockDetail', 'courseTypeDetail']);
        }
        // 兼容开售时间字段不统一
        if (fields.includes('publish')) {
          fields = fields.concat(['publishData']);
        }
        // 商品锁校验
        if (fields.includes(key)) {
          return {
            disabled: true,
            disabledMsg: mapFieldNameToDisaledMsg[lockField.name],
          };
        }
      }
    }
  }
  return {};
};
