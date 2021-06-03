import { GetterTree } from 'vuex';
import { SELLER_TYPE } from '@/constants/course/seller-type';
import { ShowCollectInfoEnum } from '@/constants/course/collect-info-type';
import { GOODS_TYPE } from '@/constants/course/goodsType';
import { PcDetailState } from './index';

const getters: GetterTree<PcDetailState, any> = {
  isContent(state) {
    return state.goodsType === GOODS_TYPE.CONTENT || state.goodsType === GOODS_TYPE.FX_CONTENT;
  },

  isLive(state) {
    return state.goodsType === GOODS_TYPE.LIVE;
  },

  // 是否是免费商品
  isFree(state, getters) {
    if (getters.isContent || getters.isLive) {
      switch (state.goodsData.sellerType) {
        case SELLER_TYPE.SINGLE:
          return state.goodsData.sku.maxPrice === 0;
        case SELLER_TYPE.COLUMN:
          return state.goodsData.column.price === 0;
        case SELLER_TYPE.BOTH:
          return state.goodsData.sku.maxPrice === 0 || state.goodsData.column.price === 0;
      }
    }
    return !state.goodsData.sku.maxPrice;
  },

  /** 判断是否需要信息采集 */
  needCollectInfo(state, getters) {
    const { isFree } = getters;
    const { goodsData } = state;
    const { showCollectInfo, isOwnAsset } = goodsData;

    const needShow = showCollectInfo === ShowCollectInfoEnum.SHOW;

    if (needShow) {
      // 已购买时需要采集
      if (isOwnAsset) {
        return needShow;
      }

      // 0元商品统一领取前采集
      if (isFree) {
        return needShow;
      }

      // 普通商品走下单采集
      return false;
    }

    return needShow;
  },
};

export default getters;
