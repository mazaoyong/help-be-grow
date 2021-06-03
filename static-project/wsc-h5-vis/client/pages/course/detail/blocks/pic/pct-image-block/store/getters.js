import fullfillImage from '@youzan/utils/fullfillImage';
import { SHOP_LIFE_STATUS } from '@/constants/shop-life-status';
import { SELLER_TYPE } from '@/constants/course/seller-type';
import { MEDIA_TYPE } from '@/constants/course/media-type';
import { PLAY_STATUS } from '../constants';

export default {
  cover(state, getters, rootState) {
    return fullfillImage(rootState.goodsData.pictures[0].url, '!middle.jpg');
  },

  url(state, getters, rootState) {
    const {
      needOrder,
      isOwnAsset,
      fullContent,
      previewContent,
    } = rootState.goodsData;

    let url = isOwnAsset && !needOrder
      ? fullContent
      : previewContent;

    if (getters.lock) {
      url = '';
    }

    return url;
  },

  lock(state, getters, rootState, rootGetters) {
    if (rootGetters.isVideo) {
      if (rootState.shopLifeStatus === SHOP_LIFE_STATUS.PROTECT ||
        rootState.shopLifeStatus === SHOP_LIFE_STATUS.CLOSE ||
        rootState.shopLifeStatus === SHOP_LIFE_STATUS.PAUSE) {
        return true;
      }
    }
    if (rootState.goodsData.contentDeleted || rootState.goodsData.trafficExhausted) {
      return true;
    }
    if (rootState.goodsData.isOwnAsset) {
      return false;
    }
    if (rootState.goodsData.previewContent) {
      return false;
    }
    return true;
  },

  tip(state, getters, rootState, rootGetters) {
    const { playStatus } = state;
    const { goodsData } = rootState;
    const { isFree, isAudio } = rootGetters;

    const recieveText = isFree ? '领取' : '订阅';
    const shortActText = isAudio ? '听' : '看';
    const actText = isAudio ? '收听' : '观看';

    if (rootGetters.isVideo) {
      if (rootState.shopLifeStatus === SHOP_LIFE_STATUS.PROTECT ||
        rootState.shopLifeStatus === SHOP_LIFE_STATUS.CLOSE ||
        rootState.shopLifeStatus === SHOP_LIFE_STATUS.PAUSE) {
        return '店铺已到期，无法播放视频\n请联系商家';
      }
    }

    if (goodsData.contentDeleted) {
      return '该视频已被删除';
    }

    if (goodsData.trafficExhausted) {
      return '店铺流量不足，无法播放\n请联系商家处理';
    }

    if (goodsData.isOwnAsset && !goodsData.needOrder) {
      return '';
    }

    if (playStatus === PLAY_STATUS.BEFORE_PLAY) {
      if (goodsData.previewContent) {
        return `可以免费试${shortActText}部分内容，${recieveText}后可以${actText}完整${isAudio ? '音' : '视'}频`;
      }

      if (goodsData.sellerType === SELLER_TYPE.COLUMN) {
        return isFree ? `领取专栏后可免费${actText}` : `当前内容订阅专栏后才能${actText}`;
      }

      return isFree ? `领取后可免费${actText}` : `当前内容订阅后才能${actText}`;
    }

    if (playStatus === PLAY_STATUS.AFTER_PLAY) {
      if (goodsData.previewContent) {
        return goodsData.sellerType === SELLER_TYPE.COLUMN
          ? `试${shortActText}结束，${recieveText}专栏后可以${actText}完整内容`
          : `试${shortActText}结束，${recieveText}后可以${actText}完整内容`;
      }
    }

    return '';
  },

  startAt(state, getters, rootState) {
    const progress = rootState.contentProgress[`c-${rootState.goodsData.alias}`] || {};
    if (progress.latest) {
      let current = progress.latest.current;
      if (progress.latest.total - current < 1) {
        current = 0;
      }
      return current;
    }
    return 0;
  },

  nextTip(state, getters, rootState) {
    const { playStatus, networkType, cancelNext, willFinish } = state;
    const { goodsData, env } = rootState;

    if (playStatus === PLAY_STATUS.PLAYING) {
      // 用户点击了关闭
      if (cancelNext) {
        return '';
      }
      // 已拥有当前商品、有下一篇内容、下一篇内容不是直播
      if (goodsData.isOwnAsset &&
        !goodsData.needOrder &&
        goodsData.nextOwlInfo.alias &&
        goodsData.nextOwlInfo.mediaType !== MEDIA_TYPE.LIVE &&
        willFinish
      ) {
        let content = `即将播放：${goodsData.nextOwlInfo.title}`;
        if (env.isWeixin && networkType !== 'wifi' && goodsData.nextOwlInfo.materialSize) {
          content += `（${goodsData.nextOwlInfo.materialSize}M流量）`;
        }
        return content;
      }
    }

    return '';
  },
};
