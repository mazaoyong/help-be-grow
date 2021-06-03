import { get } from 'lodash';
import { GOODS_STATUS } from '@/constants/course/goods-status';
import { ShowCollectInfoEnum } from '@/constants/course/collect-info-type';

export default function fxColumn(data) {
  const sellerColumn = get(data, 'sellerColumn', {});
  const needOrder = get(data, 'needOrder', false);

  let status = get(sellerColumn, 'status', GOODS_STATUS.DELETE);

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
    alias: get(sellerColumn, 'alias', ''),

    goodsId: get(sellerColumn, 'goodsId', 0),

    title: get(sellerColumn, 'title', ''),

    // 简介
    summary: get(sellerColumn, 'summary', ''),

    pictures: [
      {
        id: get(sellerColumn, 'picId', 0),
        url: get(sellerColumn, 'cover', ''),
        width: get(sellerColumn, 'picWidth', 0),
        height: get(sellerColumn, 'picHeight', 0),
      },
    ],

    origin: get(sellerColumn, 'origin', ''),

    sku: {
      hasSku: false,

      minPrice: get(sellerColumn, 'price', 0),

      maxPrice: get(sellerColumn, 'price', 0),
    },

    status,

    publishAt: get(sellerColumn, 'publishAt', 0),

    /* 知识付费属性 */
    // 信息采集设置
    collectInfoSetting: get(sellerColumn, 'collectInfoSetting', {}),

    // 订阅人数
    subscriptionsCount: get(sellerColumn, 'subscriptionsCount', 0),

    // 讲师
    author: get(sellerColumn, 'author', ''),

    // 是否更新过
    isUpdate: get(sellerColumn, 'isUpdate', 0),

    // 已更新专栏数
    contentsCount: get(sellerColumn, 'contentsCount', 0),

    // 加粉推广配置
    joinGroupSetting: get(sellerColumn, 'joinGroupSetting', {}),

    // 专栏详情
    intro: get(sellerColumn, 'previewContent', ''),
  };
}
