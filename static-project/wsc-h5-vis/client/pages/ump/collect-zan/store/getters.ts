import { get } from 'lodash';
import { IZanGetters, IZanStatus } from './types';
import {
  isCourseReward,
  isCouponReward,
  getZanStatus,
  getRemainCount,
  getTotalCount,
  isBuilder,
  getCountDownMS,
  getRecordList,
  getCouponInfo,
  getHasSupported,
} from '../modules/collect-zan';
import { getCouponText } from '../modules/coupon';
import { ZanStatus } from '../modules/collect-zan/detail';

export default {
  isBuilder(state) {
    const { zanDetail } = state;

    return isBuilder(zanDetail);
  },

  hasSupported(state) {
    return getHasSupported(state.zanDetail);
  },

  hasReceived(state) {
    return get(state, 'zanDetail.zanSet.hasRewarded', false);
  },

  zanStatus(state) {
    return getZanStatus(state.zanDetail);
  },

  couponInfo(state) {
    return getCouponInfo(state.zanDetail);
  },

  couponText(_, getters) {
    return getCouponText(getters.couponInfo);
  },

  coupon(_, getters) {
    const {
      title,
      condition,
      denominations,
      preferentialType,
      valueRandomTo,
    } = getters.couponInfo;

    const convertUnit = (price: number) => {
      return price > 1000000 ? price / 1000000 : price / 100;
    };

    const getValue = () => {
      return preferentialType === 1
        ? valueRandomTo > 0 ? convertUnit(valueRandomTo) : convertUnit(denominations)
        : preferentialType === 2
          ? ''
          : '兑换商品';
    };

    const getUnit = () => {
      return preferentialType === 1
        ? (denominations > 1000000 ? '万' : '元')
        : preferentialType === 2
          ? '折'
          : '';
    };

    return {
      value: getValue(),
      unit: getUnit(),
      name: title,
      discountPrefix: valueRandomTo > 0 ? '最高' : '',
      validTime: getters.courseName + '可用',
      threshold: condition ? `满${convertUnit(condition)}可用` : '',
    };
  },

  courseName(state) {
    return get(state, 'goodsData.title', '');
  },
  courseCover(state) {
    return get(state, 'goodsData.pictures[0].url', '');
  },
  coursePrice(state) {
    return (get(state, 'goodsData.sku.maxPrice', 0) / 100).toFixed(2);
  },

  isCourseReward(state) {
    return isCourseReward(state.zanDetail);
  },
  isCouponReward(state) {
    return isCouponReward(state.zanDetail);
  },

  showCountDown(_, getters) {
    return getters.zanStatus === IZanStatus.PROCESSING || getters.zanStatus === IZanStatus.COMPLETED;
  },

  countDownTime(state) {
    return getCountDownMS(state.zanDetail);
  },

  countDownFormat(_, getters) {
    return getters.countDownTime > 86400000 ? 'DD天HH:mm:ss.S' : 'HH:mm:ss.S';
  },

  recordList(state) {
    return getRecordList(state.zanDetail);
  },

  totalCount(state) {
    return getTotalCount(state.zanDetail);
  },

  currentCount(_, getters) {
    return getters.recordList.length || 0;
  },

  remainCount(state) {
    return getRemainCount(state.zanDetail);
  },

  /**
   * 确定进度视图提示文案
   *
   * @return {string}
   */
  progressTipText(_, getters) {
    const { zanStatus } = getters;

    switch (zanStatus) {
      case IZanStatus.PROCESSING:
        if (getters.isBuilder) {
          const remain = getters.remainCount;
          if (getters.isCourseReward) {
            return `还需邀请 ${remain} 位好友，即可免费领课程`;
          } else {
            return `还需邀请 ${remain} 位好友，即可获得课程优惠`;
          }
        } else {
          return '感谢为我助力，你也快来加入吧！';
        }
      case IZanStatus.COMPLETED:
        if (getters.isBuilder) {
          if (getters.isCouponReward) {
            return '恭喜你助力完成，快去领取课程吧！';
          } else {
            return '恭喜你助力完成，快去报名吧！';
          }
        } else {
          return '感谢为我助力，你也快来加入吧！';
        }
      case IZanStatus.PROMOTION_END:
      case IZanStatus.COURSE_INVALID:
      default:
        return '活动已结束';
    }
  },
  progressPercent(_, getters) {
    // 如果进度大于50，调整进度基数，使得进度看起来更快
    const base = 0.7;
    let percent = getters.currentCount / getters.totalCount;
    percent = percent >= 0.5 ? percent * (1 - base) + base : percent;
    percent = percent > 1 ? 1 : percent;

    return getters.zanStatus === ZanStatus.PROMOTION_END ||
      getters.zanStatus === ZanStatus.COURSE_INVALID
      ? 1 : percent;
  },

  /**
   * 页面中的动作
   *
   * @param _
   * @param getters
   */
  actions(_, getters) {
    return {
      create: {
        text: '我也要好礼',
        action: 'createZan',
      },
      invite: {
        text: '邀请好友',
        action: 'inviteFriend',
      },
      receive: {
        text: getters.isCourseReward ? '领取课程' : '使用优惠报名',
        action: 'receiveReward',
      },
      received: {
        text: '查看课程',
        action: 'toMyPay',
      },
      poster: {
        text: '生成分享海报',
        action: 'openPoster',
      },
      follow: {
        text: '关注公众号',
        action: 'openMpPopup',
      },
      home: {
        text: '去店铺逛逛',
        action: 'toHome',
      },
      tip: {
        text: '优惠券可在“我的-我的券码”查看',
        action: 'toCouponList',
      },
      default: {},
    };
  },

  /**
   * 主按钮动作
   *
   * @param _
   * @param getters
   */
  mainAction(_, getters) {
    let actionKey = '';

    switch (getters.zanStatus) {
      case IZanStatus.PROCESSING:
        if (getters.isBuilder) {
          actionKey = 'invite';
        } else {
          actionKey = 'create';
        }
        break;
      case IZanStatus.COMPLETED:
        if (getters.isBuilder) {
          if (getters.isCourseReward && getters.hasReceived) {
            actionKey = 'received';
          } else {
            actionKey = 'receive';
          }
        } else {
          actionKey = 'create';
        }
        break;
      default:
        actionKey = 'default';
    }

    console.log('zanStatus', getters.zanStatus, actionKey);

    return getters.actions[actionKey];
  },

  /**
   * 副按钮动作
   *
   * @param _
   * @param getters
   */
  viceAction(_, getters) {
    let actionKey = '';

    switch (getters.zanStatus) {
      case IZanStatus.PROCESSING:
        if (getters.isBuilder) {
          actionKey = 'poster';
        } else {
          actionKey = 'home';
          actionKey = 'follow';

          if (_global.mp_data.mp_weixin) {
            actionKey = 'follow';
          }
        }
        break;
      case IZanStatus.COMPLETED:
        if (getters.isBuilder) {
          if (getters.isCourseReward) {
            return {};
          } else {
            actionKey = 'tip';
          }
        } else {
          if (_global.mp_data.mp_weixin) {
            actionKey = 'follow';
          }
          actionKey = 'poster';
        }
        break;
      case IZanStatus.PROMOTION_END:
      case IZanStatus.COURSE_INVALID:
      default:
        actionKey = 'home';
    }

    return getters.actions[actionKey];
  },

  /**
   * 确定主交互视图提示文案
   *
   * @return {string}
   */
  actionTipText(_, getters) {
    switch (getters.zanStatus) {
      case IZanStatus.PROMOTION_END:
        return '很遗憾，活动已结束';
      case IZanStatus.COURSE_INVALID:
        if (getters.isCourseReward) {
          return '课程已下架，去看看其他课程吧';
        } else {
          return '优惠券已领完，去看看其他课程吧';
        }
      default:
        return '';
    }
  },

  rules() {
    return [
      '集齐所有好友助力，即可免费获得对应的学习奖励，如免费课程或优惠券；',
      '每个人只能在1个课程里给1位好友助力，但可以给同一个好友分享的不同课程助力；',
      '商家如果关闭了助力活动，则无法为好友助力，以及无法再发起助力；',
      '每个用户针对单个商品只能发起1次助力。',
    ];
  },
} as IZanGetters;
