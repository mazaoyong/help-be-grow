import { get } from 'lodash';
import { Dialog, Toast } from 'vant';
import * as SafeLink from '@youzan/safe-link';
import * as customeSafeLink from '@/common/utils/custom-safe-link';
import { navigateEnv } from '@/common/utils/env';
import { openCollectInfoPopup } from '@/components/info-collect-popup';
import { openFollowMp } from '@/components/follow-mp/open-follow-mp';
import { getMpFollowStatus, getCommonWeappCode } from '@/common-api/utils/index';
import { getVuePoster } from '@/common/apis/poster';
import buildUrl from '@youzan/utils/url/buildUrl';

import api from '../../apis/new-student';
import { getActivityParticipatePeople, getCollectZanUserStatus } from '../../apis/index';
import { REWARD_TYPE, GET_REWARD_STATUS, POSTER_DEFAULT_BG, REFEREE_SHARE_IMG, ACTIVITY_STATUS } from '../../constants';
import { getCurrentUserInfo, copyLink, getRewardDesc } from '../../utils';

export default {
  fetchRefereeActivity({ state, commit, dispatch }) {
    const { alias, introducerUserId, refereeUserId, hasMp, isWeapp } = state;
    api
      .getRefereeActivityInfo({
        alias,
        introducerUserId,
      })
      .then((res) => {
        const { activityInfo = {}, introducer = {}, reward = {}, referee = {} } = res;
        const { type, status: rewardStatus } = reward;
        const showJoinNum = activityInfo.showJoinNum;
        const showRecommendGoods = activityInfo.showRecommendGoods;
        if (type !== REWARD_TYPE.NO_THRESHOLD && !isWeapp) {
          commit('SET_ACTIVITY_GUIDE');
        } else if (activityInfo.status !== ACTIVITY_STATUS.STARTED) {
          commit('SET_ERROR', '你来晚了，活动结束啦！');
        } else {
          commit('SET_SHOW_RECOMMEND_GOODS', showRecommendGoods);
          commit('SET_INTRODUCTION_INFO', activityInfo);
          commit('SET_INTRODUCER', introducer);
          commit('SET_REFEREE', referee);
          commit('SET_REWARD', reward);
          commit('SET_TRACK_PARAMS');
          commit('SET_REWARD_DETAIL', reward.rewardDetail);
          if (refereeUserId) {
            dispatch('boostCheck');
          }
          dispatch('setShareInfo');
          dispatch('copyLink');
          if (rewardStatus && hasMp) {
            dispatch('fetchMpFollowStatus').then((res) => {
              commit('SET_MP_FOLLOW_STATUS', res);
              commit('SET_BUTTON');
            });
          } else {
            commit('SET_BUTTON');
          }

          dispatch('showHasJoinTip');

          if (showJoinNum) {
            getActivityParticipatePeople({
              alias,
              bizScene: 1,
            }).then((data) => {
              commit('SET_COUNT', data || 0);
            });
          }
        }
        commit('MAKE_LOG', 'enterpage');
      })
      .catch(() => {
        commit('SET_ERROR', '机构暂无活动 去看看其他课程');
      })
      .finally(() => {
        state.fetched = true;
      });
  },

  fetchHelperList({ state, commit }) {
    const { alias } = state;
    api
      .getHelperList({
        alias,
      })
      .then((res) => {
        commit('SET_HELPER_LIST', res);
      });
  },

  onButtonClick({ dispatch, state, commit }, btnType) {
    const { reward, alias, introducerUserId } = state;
    const { type, status } = reward;
    switch (btnType) {
      case 'home':
        dispatch('toHome');
        break;
      case 'getReward':
        // 领取奖励
        if (type === REWARD_TYPE.BOOST) {
          dispatch('receiveAward');
        } else {
          dispatch('doSubmitInfo');
        }
        break;
      case 'submitInfo':
        // 生成助力活动
        dispatch('doSubmitInfo');
        break;
      case 'share':
        // 分享
        if (type === REWARD_TYPE.SHARE) {
          dispatch('doShare');
          dispatch('showShareGuide');
        } else if (type === REWARD_TYPE.BOOST && status === GET_REWARD_STATUS.UN_GET) {
          commit('SHOW_SHARE_POP');
          dispatch('getBoostPoster');
          commit('MAKE_LOG', 'share_boost');
        } else {
          dispatch('showShareGuide');
        }
        break;
      case 'join':
        // 助力场景下，助力后的人也要创建活动
        commit('MAKE_LOG', 'go_join');
        customeSafeLink.redirect({
          url: `/wscvis/ump/introduction/new-student?alias=${alias}&introducerUserId=${introducerUserId}&from=newJoin`,
        });
        break;
      case 'mp':
        dispatch('showFollowMp');
        break;
      default:
        break;
    }
  },

  // 提交信息并生成助力活动
  doSubmitInfo({ state, dispatch, commit }) {
    const { alias, introducerUserId, refereeUserId, reward } = state;
    const kdtId = window._global.kdt_id;
    api
      .getIntroductionAttribute({ alias })
      .then((res) => {
        openCollectInfoPopup({
          props: {
            infoCollectionItems: res.attributeItems || [],
            infoCollectDto: state.infoCollect.data,
            title: '提交信息后领取奖励',
            submitText: '提交并领取奖励',
            needVerifyCode: !!res.needVerifyCode,
            scene: 3,
          },
          on: {
            sendCaptcha: (mobile, callBack) => {
              return dispatch('sendCaptcha', { mobile, callBack });
            },
          },
        }).then((data) => {
          const { attributeItems, verifyCode } = data;
          const phoneItem = attributeItems.find((item) => item.attributeKey === 'edu_stuContractPhone');
          const nameItem = attributeItems.find((item) => item.attributeKey === 'edu_stuName');
          if (!phoneItem.value || !nameItem.value) {
            Toast('姓名和手机号不能为空');
            return;
          }
          api
            .studentIdentityCheck({
              alias,
              mobile: phoneItem.value,
            })
            .then((res) => {
              if (!res.isNewStudent) {
                if (res.isOldStudent) {
                  Dialog.confirm({
                    message: '你不满足领取条件，暂时不能领取好友送你的奖励。现在有其他活动可领奖励，快去参与吧！',
                    confirmButtonText: '参加邀请有礼活动',
                  }).then(() => {
                    let url = `/wscvis/ump/introduction/old-student?kdt_id=${kdtId}&from=invite_reward&alias=${alias}`;
                    SafeLink.redirect({
                      url: buildUrl(url, 'h5', kdtId),
                      kdtId,
                      redirectType: 'replace',
                    });
                  });
                } else {
                  Dialog.confirm({
                    message: '你不满足领取条件，暂时不能领取好友送你的奖励。',
                    confirmButtonText: '进店逛逛',
                  }).then(() => {
                    navigateEnv('', 'replace');
                  });
                }
                return;
              }
              const params = {
                attributeItems,
                alias,
                introducerUserId,
                verifyCode,
              };

              api
                .confirmIntroductionAttributeItem(params)
                .then((res) => {
                  const { code, msg } = res;
                  if (code === 0) {
                    state.isSuccess = 1;
                    if (reward.type === REWARD_TYPE.BOOST) {
                      customeSafeLink.redirect({
                        url: `/wscvis/ump/introduction/new-student?alias=${alias}&introducerUserId=${introducerUserId}&refereeUserId=${refereeUserId}`,
                      });
                    } else {
                      customeSafeLink.redirect({
                        url: location.href + '?time=' + new Date().getTime(),
                      });
                    }
                  } else if (code === 320500043) {
                    state.isSuccess = 0;
                    Toast(msg);
                    customeSafeLink.redirect({
                      url: location.href + '?time=' + new Date().getTime(),
                    });
                  } else if (code === 320500054) {
                    state.isSuccess = 0;
                    Toast(msg);
                    customeSafeLink.redirect({
                      url: location.href + '?time=' + new Date().getTime(),
                    });
                  } else {
                    state.isSuccess = 0;
                    Toast(msg);
                  }
                  commit('MAKE_LOG', 'submit_infocollect');
                })
                .catch((msg) => {
                  Toast(msg);
                  state.isSuccess = 0;
                  commit('MAKE_LOG', 'submit_infocollect');
                });
            });
        });
      })
      .catch((err) => {
        Toast(err || '网络错误，请重试');
      });
  },

  // 提交分享信息
  doShare({ state, commit }) {
    const { alias } = state;
    commit('MAKE_LOG', 'share');
    api.refereeShareActivity({ alias });
  },

  // 领取奖励 -- 助力成功后
  receiveAward({ state, commit }) {
    const { alias } = state;
    api
      .receiveAward({ alias })
      .then((res) => {
        const { code, msg } = res;
        if (code === 0) {
          state.isSuscess = 1;
          Toast('领取成功');
          customeSafeLink.redirect({
            url: location.href + '?time=' + new Date().getTime(),
          });
        } else if (code === 320500043) {
          state.isSuccess = 0;
          Toast(msg);
          customeSafeLink.redirect({
            url: location.href + '?time=' + new Date().getTime(),
          });
        } else if (code === 320500055) {
          state.isSuscess = 0;
          Toast(msg);
          customeSafeLink.redirect({
            url: location.href + '?time=' + new Date().getTime(),
          });
        } else {
          state.isSuscess = 0;
          Toast(msg);
        }
        commit('MAKE_LOG', 'recieve_award');
      })
      .catch((msg) => {
        Toast(msg || '网络错误，请重试');
        state.isSuscess = 0;
        commit('MAKE_LOG', 'recieve_award');
      });
  },

  toHome({ commit }) {
    commit('MAKE_LOG', 'home');
    navigateEnv();
  },

  sendCaptcha({ state }, payload) {
    const { alias } = state;
    const { mobile, callBack } = payload;
    api
      .sendVerifyCode({
        alias,
        mobile,
      })
      .then((data) => {
        callBack(data);
      })
      .catch((err) => {
        callBack(false, err);
      });
  },

  // 绘制好友助力海报
  getBoostPoster({ state, commit }) {
    const { introductionInfo, shareUrl, boostPoster } = state;
    if (boostPoster) {
      Toast('海报已生成，长按即可保存海报');
      return;
    }
    const shopName = get(window._global, 'mp_data.shop_name', '');
    const awardDesc = get(introductionInfo, 'refereeAward.awardDesc', {});
    const awards = get(introductionInfo, 'refereeAward.awards', []);
    const tip = 'Hi! 我需要你的助力！送你';
    const newStuRewardTip = getRewardDesc({ prefix: tip, awardDesc, awards });
    const currentUserInfo = getCurrentUserInfo();

    getCommonWeappCode({
      page: '/packages/edu/webview/index',
      targetUrl: encodeURIComponent(shareUrl),
    }).then((res) => {
      if (res) {
        getVuePoster({
          pathname: 'ump/introduction/default',
          data: {
            name: currentUserInfo.name,
            avatar: currentUserInfo.avatar,
            poster: POSTER_DEFAULT_BG[introductionInfo.pageStyle - 1].bg,
            qrCode: res,
            shopName,
            newStuRewardTip,
          },
          snapshotConfig: {
            width: 240,
            height: 330,
            type: 'png',
          },
        }).then((res) => {
          let url = res.img;
          if (res.msg === 'error' || !url) {
            Toast(res.data || '生成海报失败，请稍后再试');
          } else {
            commit('SET_BOOST_POSTER_POP', url);
            commit('MAKE_LOG', 'share_boost_poster');
          }
        });
      }
    });
  },

  showShareGuide({ state, commit }) {
    const { reward } = state;
    commit('SHOW_SHARE_GUIDE');
    if (reward.type === REWARD_TYPE.BOOST) {
      commit('MAKE_LOG', 'share_boost_link');
    }
  },

  onShareGuideHide({ commit }) {
    commit('HIDE_SHARE_GUIDE');
  },

  fetchMpFollowStatus({ commit }) {
    return getMpFollowStatus()
      .then((res = {}) => {
        return res;
      })
      .catch(() => {
        return {};
      });
  },

  showFollowMp() {
    openFollowMp({
      onPopupClose: () => {
        customeSafeLink.redirect({
          url: location.href + '?time=' + new Date().getTime(),
        });
      },
    })();
  },

  copyLink({ state }) {
    const { shareUrl } = state;
    copyLink('.new-student', shareUrl);
  },

  setShareInfo({ state, commit }) {
    const { introductionInfo } = state;
    const currentUserInfo = getCurrentUserInfo();
    const bg = REFEREE_SHARE_IMG[introductionInfo.pageStyle || 1];
    getVuePoster({
      pathname: 'ump/introduction/share',
      data: {
        name: currentUserInfo.name,
        avatar: currentUserInfo.avatar,
        img: bg,
      },
      snapshotConfig: {
        width: 250,
        height: 200,
        quality: 100,
        type: 'png',
      },
    })
      .then((res) => {
        let url = res.img || bg;
        commit('SET_SHARE_INFO', url);
      })
      .catch(() => {
        commit('SET_SHARE_INFO', bg);
      });
  },

  boostCheck({ state, commit }) {
    const { refereeUserId, alias, currentUserId } = state;
    if (String(refereeUserId) === String(currentUserId)) {
      return;
    }
    getCollectZanUserStatus({
      alias: alias,
      refereeUserId: refereeUserId,
    }).then((res) => {
      const { isAchieve = false, status = false } = res;
      if (status) {
        setTimeout(() => {
          Toast.success({
            message: '你已经助力过了',
            overlay: true,
          });
        }, 1000);
      } else if (isAchieve) {
        setTimeout(() => {
          Toast.success({
            message: '好友已无需助力',
            overlay: true,
          });
        }, 1000);
      } else {
        commit('SET_SHOW_BOOST', true);
      }
    });
  },

  showHasJoinTip() {
    const hasJoin = get(_global, 'introStuCheck.hasNewStudentInstance', false);
    if (hasJoin) {
      setTimeout(() => {
        Toast({
          message: '你已经参加过活动',
          duration: 1000,
        });
      }, 1000);
    }
  },
};
