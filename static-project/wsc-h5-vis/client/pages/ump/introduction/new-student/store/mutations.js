import accSub from '@youzan/utils/number/accSub';
import { setShareData } from '@youzan/wxsdk';
import { REWARD_TYPE, GET_REWARD_STATUS, REFEREE_SHARE_TITLE, BOOST_STATUS, SHARE_H5_ICON } from '../../constants';
import { formatTrackParam, makePointLog, NEW_EVENT_NAME } from '../../log';
import * as customeSafeLink from 'common/utils/custom-safe-link';

const { miniprogram = {} } = _global;

const isMiniProgram = miniprogram.isMiniProgram;

export default {
  SET_SHOW_RECOMMEND_GOODS(state, payload = 0) {
    state.showRecommendGoods = payload;
  },
  SET_INTRODUCTION_INFO(state, payload = {}) {
    state.introductionInfo = payload;
  },

  SET_INTRODUCER(state, payload = {}) {
    state.introducer = payload;
  },

  SET_REFEREE(state, payload = {}) {
    state.referee = payload;
  },

  SET_REWARD(state, payload = {}) {
    state.reward = payload;
  },

  SET_ERROR(state, activityError) {
    state.activityError = activityError;
  },

  SET_COUNT(state, payload) {
    state.count = payload;
  },

  SET_ACTIVITY_GUIDE(state, payload) {
    const { alias, introducerUserId } = state;
    let share = `/wscvis/ump/introduction/new-student?alias=${alias}&introducerUserId=${introducerUserId}`;
    let guideUrl = customeSafeLink.getSafeUrl({ url: share });
    state.guideUrl = guideUrl;
    state.isShowActivityGuide = true;
  },

  SET_BUTTON(state) {
    const { refereeUserId, introducer, isFollowMp, hasMp, reward, rewardDetail = {} } = state;
    const { type, status } = reward;
    let btnText = '';
    let btnType = '';
    let subBtnText = '';
    let subBtnType = '';
    let tipInfo = '';
    let btnTip = '';
    let gap = 0;
    let isShowCollectList = true;
    let inviteUserInfo = introducer;
    if (type === REWARD_TYPE.BOOST) {
      const { collectNum = 10, joinNum = 0, zanStatus } = rewardDetail;
      gap = accSub(collectNum, joinNum);
      btnTip = gap > 0 ? `还需${gap}人助力` : '';

      if (refereeUserId) {
        if (zanStatus !== BOOST_STATUS.BOOSTED) {
          btnText = '分享给好友';
          btnType = zanStatus === BOOST_STATUS.NO_BOOST ? 'submitInfo' : 'share';
        } else if (status === GET_REWARD_STATUS.HAS_GOT) {
          tipInfo = '领取成功';
          if (hasMp && !isFollowMp) {
            btnText = '关注公众号，获取课程信息';
            btnType = 'mp';
            subBtnText = '邀请好友免费领';
            subBtnType = 'share';
          } else {
            btnText = '邀请好友一起领';
            btnType = 'share';
            subBtnText = '进店逛逛';
            subBtnType = 'home';
          }
        } else {
          btnTip = '能量已满，快来领取奖励吧！';
          btnText = '立即领取';
          btnType = 'getReward';
        }
      } else if (status === GET_REWARD_STATUS.HAS_GOT) {
        tipInfo = '领取成功';
        if (hasMp && !isFollowMp) {
          btnText = '关注公众号';
          btnType = 'mp';
          subBtnText = '分享给好友，好友免费领';
          subBtnType = 'share';
        } else {
          btnText = '分享给好友，好友免费领';
          btnType = 'share';
          subBtnText = '进店逛逛';
          subBtnType = 'home';
        }
      } else if (zanStatus === BOOST_STATUS.BOOSTED) {
        btnTip = '能量已满，快去领取奖励吧！';
        btnText = '立即领取';
        btnType = 'getReward';
      } else {
        btnText = '分享给好友';
        btnType = zanStatus === BOOST_STATUS.NO_BOOST ? 'submitInfo' : 'share';
      }
    } else if (type === REWARD_TYPE.SHARE) {
      // 需分享
      const { shareStatus } = rewardDetail;
      if (status === GET_REWARD_STATUS.HAS_GOT) {
        tipInfo = '领取成功';
        if (hasMp && !isFollowMp) {
          btnText = '关注公众号';
          btnType = 'mp';
          subBtnText = '分享给好友，好友免费领';
          subBtnType = 'share';
        } else {
          btnText = '分享给好友，好友免费领';
          btnType = 'share';
          subBtnText = '进店逛逛';
          subBtnType = 'home';
        }
      } else {
        btnText = shareStatus === 0 ? '立即分享，领取奖励' : '立即领取';
        btnType = shareStatus === 0 ? 'share' : 'getReward';
      }
    } else {
      if (status === GET_REWARD_STATUS.HAS_GOT) {
        tipInfo = '领取成功';
        if (hasMp && !isFollowMp) {
          btnText = '关注公众号';
          btnType = 'mp';
          subBtnText = '分享给好友，好友免费领';
          subBtnType = 'share';
        } else {
          btnText = '分享给好友，好友免费领';
          btnType = 'share';
          subBtnText = '进店逛逛';
          subBtnType = 'home';
        }
      } else {
        btnText = '立即领取';
        btnType = 'getReward';
      }
    }

    state.gap = gap;
    state.tipInfo = tipInfo;
    state.isShowCollectList = isShowCollectList;
    state.inviteUserInfo = Object.assign(state.inviteUserInfo, inviteUserInfo);
    state.buttonInfo = Object.assign({
      btnText,
      btnType,
      subBtnText,
      subBtnType,
      btnTip,
    });
  },

  SET_SHARE_INFO(state, shareImg) {
    const { reward, alias, introducerUserId, currentUserId } = state;
    const { type, status, rewardDetail } = reward;
    let shareUrl = `/wscvis/ump/introduction/new-student?alias=${alias}&introducerUserId=${introducerUserId}&from=new`;
    let shareTitle = REFEREE_SHARE_TITLE.SHARE;
    let shareDesc = '立即领取 >';
    if (type === REWARD_TYPE.BOOST && status === GET_REWARD_STATUS.UN_GET) {
      const { zanStatus } = rewardDetail;
      shareUrl = `${shareUrl}&refereeUserId=${currentUserId}`;
      if (zanStatus !== BOOST_STATUS.NO_BOOST) {
        shareTitle = REFEREE_SHARE_TITLE.BOOSTING;
      }
    }
    shareImg = isMiniProgram ? shareImg : SHARE_H5_ICON;
    shareUrl = customeSafeLink.getSafeUrl({ url: shareUrl });
    state.shareUrl = shareUrl;
    setShareData({
      title: shareTitle,
      desc: shareDesc,
      link: shareUrl,
      cover: shareImg,
      weappPath: `/packages/edu/webview/index?targetUrl=${encodeURIComponent(shareUrl)}`,
    });
  },

  SHOW_SHARE_GUIDE(state) {
    state.isShowShareGuide = true;
  },

  HIDE_SHARE_GUIDE(state) {
    const { reward } = state;
    state.isShowShareGuide = false;
    if (reward.type === REWARD_TYPE.SHARE) {
      window.location.reload();
    }
  },

  SHOW_SHARE_POP(state) {
    state.isShowSharePop = true;
  },

  SET_BOOST_POSTER_POP(state, payload) {
    state.boostPoster = payload;
  },

  SET_TRACK_PARAMS(state) {
    const { introductionInfo, reward, introducerUserId } = state;
    const trackParams = formatTrackParam(introductionInfo, reward.type, introducerUserId);
    state.trackParams = trackParams;
  },

  SET_MP_FOLLOW_STATUS(state, payload) {
    const { isFollow } = payload;
    state.isFollowMp = isFollow;
  },

  SET_REWARD_DETAIL(state, payload = {}) {
    state.rewardDetail = payload;
  },

  CLEAR_REFEREE_USER(state) {
    state.refereeUserId = '';
  },

  SET_SHOW_BOOST(state, payload) {
    state.isShowBoost = payload;
  },

  SET_HELPER_LIST(state, payload) {
    state.helperList = payload;
  },

  MAKE_LOG(state, payload) {
    let { trackParams, from, rewardDetail, isSuccess } = state;
    switch (payload) {
      case 'enterpage':
        trackParams.from = from;
        makePointLog('display', payload, NEW_EVENT_NAME[payload], 'introductionNewDetail', trackParams);
        break;
      case 'share_boost':
      case 'share_boost_poster':
      case 'share_boost_link':
      case 'boost_collect':
      case 'go_join':
        trackParams.collectNum = rewardDetail.collectNum;
        makePointLog('click', payload, NEW_EVENT_NAME[payload], 'introductionNewDetail', trackParams);
        break;
      case 'share':
      case 'recieve_award':
      case 'home':
        makePointLog('click', payload, NEW_EVENT_NAME[payload], 'introductionNewDetail', trackParams);
        break;
      case 'submit_infocollect':
        trackParams.isSuccess = isSuccess;
        makePointLog('custom', payload, NEW_EVENT_NAME[payload], 'introductionNewDetail', trackParams);
        break;
    }
  },
};
