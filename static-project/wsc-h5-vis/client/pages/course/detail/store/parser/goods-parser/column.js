import { get } from 'lodash';
import { GOODS_STATUS } from '@/constants/course/goods-status';
import { ShowCollectInfoEnum } from '@/constants/course/collect-info-type';

export default function column(data) {
  let status = get(data, 'status', GOODS_STATUS.DELETE);
  const needOrder = get(data, 'needOrder', false);

  // 抹平专栏和线下课状态差异
  if (status === 2) {
    status = GOODS_STATUS.UNSELL;
  }

  return {
    // 是否拥有资产
    isOwnAsset: get(data, 'isOwnAsset', false),

    /* 是否需要信息采集 */
    showCollectInfo: get(data, 'showCollectInfo', ShowCollectInfoEnum.HIDE),

    /* 针对0元课程，信息采集前是否需要领取（生成订单） */
    needOrder,

    /* 商品属性 */
    alias: get(data, 'alias', ''),

    goodsId: get(data, 'goodsId', 0),

    title: get(data, 'title', ''),

    // 简介
    summary: get(data, 'summary', ''),

    pictures: [
      {
        id: get(data, 'picId', 0),
        url: get(data, 'cover', ''),
        width: get(data, 'picWidth', 0),
        height: get(data, 'picHeight', 0),
      },
    ],

    origin: get(data, 'origin', ''),

    sku: {
      hasSku: false,

      minPrice: get(data, 'price', 0),

      maxPrice: get(data, 'price', 0),
    },

    status,

    publishAt: get(data, 'publishAt', 0),

    /* 知识付费属性 */
    // 信息采集设置
    collectInfoSetting: get(data, 'collectInfoSetting', {}),

    // 订阅人数
    subscriptionsCount: get(data, 'subscriptionsCount', 0),

    // 讲师
    author: get(data, 'author', ''),

    // 是否更新过
    isUpdate: get(data, 'isUpdate', 0),

    // 已更新专栏数
    contentsCount: get(data, 'contentsCount', 0),

    // 加粉推广配置
    joinGroupSetting: get(data, 'joinGroupSetting', {}),

    // 专栏详情
    intro: get(data, 'fullContent', ''),
  };
}
