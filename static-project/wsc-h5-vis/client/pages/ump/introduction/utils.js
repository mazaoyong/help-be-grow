/**
 * 随机头像抽取，copied from wsc-h5-components: trade-carousel
 */

import { Toast } from 'vant';
import Clipboard from 'clipboard';
import isFunction from 'lodash/isFunction';
import { DEFAULT_AVATAR } from './constants';

export function getAwardTip(awards) {
  let tip = [];
  awards.map((item) => {
    switch (item.type) {
      case 3:
        tip.push(`${item.awardAmount}个${item.awardCopywriting}`);
        break;
      case 2:
        tip.push(`${item.awardAmount}张${item.awardCopywriting}`);
        break;
      case 1:
        tip.push(`${item.awardAmount}${_global.visPointsName || '积分'}`);
        break;
      default:
        break;
    }
  });
  return tip.length > 0 ? tip.join('、') : '';
}

export function classifyAwards(awards = []) {
  const presentList = [];
  const couponList = [];
  const offlineList = [];
  const point = {
    type: 1,
    awardAmount: 0,
  };
  awards.map((rewardItem) => {
    switch (rewardItem.type) {
      case 1:
        point.awardAmount = rewardItem.awardAmount;
        break;
      case 2:
        couponList.push(rewardItem);
        break;
      case 3:
        presentList.push(rewardItem);
        break;
      case 5:
        offlineList.push(rewardItem);
        break;
      default:
        break;
    }
  });
  return {
    couponList,
    presentList,
    point,
    offlineList,
  };
}

export function getCurrentUserInfo() {
  const { visBuyer = {} } = window._global || {};
  const defaultAvatar = visBuyer.finalAvatar || DEFAULT_AVATAR;
  const defaultName = visBuyer.finalUsername || '小伙伴';
  return {
    avatar: defaultAvatar,
    name: defaultName,
    buyerId: visBuyer.buyerId,
  };
}

export function copyLink(target, url, callback) {
  const clipboard = new Clipboard(target, {
    text: () => {
      return url;
    },
  });
  clipboard.on('success', () => {
    Toast.success('复制成功');
    clipboard.destroy();
    isFunction(callback) && callback();
  });
  clipboard.on('error', () => {
    Toast('复制失败，请选择其他分享方式~');
    clipboard.destroy();
  });
}

export function getRewardDesc({ prefix = '', awardDesc, awards }) {
  const { freestyleDesc = '', descriptionMode = 0, awardTotalValue = 0, awardValueDesc } = awardDesc;
  switch (descriptionMode) {
    case 0:
      return `${prefix}价值 ${awardTotalValue} 元${awardValueDesc}`;
    case 1:
      return `${prefix}${freestyleDesc}`;
    case 2:
      return `${prefix}${getAwardTip(awards)}`;
    default:
      break;
  }
}
