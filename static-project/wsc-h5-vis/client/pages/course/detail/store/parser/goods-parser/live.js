import { get } from 'lodash';
import { GOODS_STATUS } from '@/constants/course/goods-status';
import { MEDIA_TYPE } from '@/constants/course/media-type';
import { SELLER_TYPE } from '@/constants/course/seller-type';
import { LIVE_TYPE } from '@/constants/course/live-type';
import { LIVE_STATUS } from '@/constants/course/live-status';
import { ShowCollectInfoEnum } from '@/constants/course/collect-info-type';

export default function live(data) {
  // 直播没有返回status，需要根据现有字段判断，保证逻辑与其他商品类型统一
  // 后面可以让后端直接返回这个字段
  let status = GOODS_STATUS.DELETE;
  // 下架
  if (data.sellStatus === 2) {
    // 定时上架
    if (data.sellTimeType === 2) {
      status = GOODS_STATUS.PRESELL;
    } else {
      status = GOODS_STATUS.UNSELL;
    }
  }
  // 上架中
  if (data.sellStatus === 1) {
    status = GOODS_STATUS.SELLING;
  }
  // 删除
  if (data.liveStatus === LIVE_STATUS.DELETE) {
    status = GOODS_STATUS.DELETE;
  }

  const sellerType = get(data, 'sellerType', SELLER_TYPE.SINGLE);
  const price = get(data, 'price', 0);
  const columnPrice = get(data, 'columnPrice', 0);
  const needOrder = get(data, 'needOrder', false);

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

    summary: get(data, 'summary', ''),

    mediaType: MEDIA_TYPE.LIVE,

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

      minPrice: sellerType === SELLER_TYPE.COLUMN ? columnPrice : price,

      maxPrice: sellerType === SELLER_TYPE.COLUMN ? columnPrice : price,
    },

    subTitle: get(data, 'summary', ''),

    status,

    publishAt: get(data, 'publishAt', 0),

    /* 知识付费属性 */
    // 信息采集设置
    collectInfoSetting: get(data, 'collectInfoSetting', {}),

    // 售卖方式
    sellerType,

    // 学习次数
    pageView: get(data, 'pageView', 0),

    // 直播讲师
    author: get(data, 'lecturer', ''),

    // 直播状态
    liveStatus: +get(data, 'liveStatus', LIVE_STATUS.DELETE),

    // 直播类型
    liveType: +get(data, 'liveType', LIVE_TYPE.VOICE_PICTURE_TEXT),

    // 直播开始时间
    liveStartAt: get(data, 'liveStartAt', 0),

    // 直播时长(分钟)
    liveDuration: get(data, 'liveDuration', 0),

    // 加粉推广配置
    joinGroupSetting: get(data, 'joinGroupSettingDTO', {}),

    // 直播详情
    intro: get(data, 'detail', ''),

    // 直播提醒关注公众号二维码
    focusQr: get(data, 'focusQr', ''),

    // 关联专栏
    column: {
      alias: get(data, 'columnAlias', ''),
      title: get(data, 'columnTitle', ''),
      cover: get(data, 'columnCover', ''),
      contentsCount: get(data, 'contentsCount', 0),
      sales: get(data, 'columnSales', 0),
      price: columnPrice,
    },

    // 下一篇
    nextOwlInfo: {},
  };
}
