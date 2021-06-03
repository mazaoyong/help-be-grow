/*
 * 参数配置
 * @author: yugang <yugang@youzan.com>
 */

// 最大展示商品数量
export const MAX_GOODS_NUM = 30;

// 查看教程链接
export const TUTORIAL_URL = 'https://help.youzan.com/displaylist/detail_4_4-2-13124';

// 添加方式：['手动添加'，'自动获取']
export const GOODS_SOURCE_MODE = ['1', '0'];

// 列表样式：['大图'，'详细列表']
export const SIZE = ['0', '2'];

// 图片填充方式: ['填充'，'留白']
export const IMAGE_FILL_STYLE = ['1', '2'];

export const SIZE_TYPE_MAP = {
  CARD: 0,
  WATERFALL: 1,
  SIMPLE: 2,
  PROMOTION: 3,
  MULTI: 4,
  CARD2: 5,
  POINTS: 6,
  CARD_SHADOW: 7,
  TAG_LEFT: 8,
};

export const LAYOUT_MAP = {
  BIG: 0,
  SMALL: 1,
  HYBRID: 2,
  LIST: 3,
  THREE: 5,
  SWIPE: 6,
};

export default {
  SIZE_TYPE_MAP,
  LAYOUT_MAP,
};
