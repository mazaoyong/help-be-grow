import { Toast } from 'vant';
import { getDetail } from '../apis';
import {
  createZan,
  getZanDetail,
  setShareData,
  getSharePoster,
  inviteFriend,
  supportFriend,
  receiveReward,
  getInvited,
  setInvited,
} from '../modules/collect-zan';
import { toHome, toCouponList, toCourse, toMyPay } from '../modules/navigation';
import { showMpQrcode } from '../modules/weixin';
import { IZanActions, IZanStatus } from './types';
import openWeixinSharePopup from '@/components/share-mask/main.js';
import { uploadNetMaterial } from 'pct/utils';
import track from '../track';
import args from '@youzan/utils/url/args';
import parseGoodsData from '@/pages/course/detail/store/parser/goods-parser';
import { get } from 'lodash';

export default {
  async initState({ state, commit, dispatch, getters }) {
    const { zanAlias, alias } = state;

    // 获取活动信息
    let zanDetail, goodsData;
    try {
      [zanDetail, goodsData] = await Promise.all([
        getZanDetail(zanAlias),
        getDetail(alias),
      ]);
    } catch (errMsg) {
      Toast(errMsg || '获取活动信息错误');
    }
    commit('updateZanDetail', zanDetail);
    commit('updateGoodsData', parseGoodsData(goodsData.goodsType, goodsData.goodsData));

    // 决定是否需要展示弹窗
    const hasInvited = getInvited(zanAlias);
    if (getters.zanStatus === IZanStatus.PROCESSING) {
      if (getters.isBuilder) {
        if (hasInvited) {
          commit('updateShowHost', true);
        } else {
          setInvited(zanAlias);
        }
      } else {
        if (getters.hasSupported) {
          // setTimeout(() => {
          //   Toast.success('你已经助力过了');
          // }, 0);
        } else {
          commit('updateShowGuest', true);
        }
      }
    }

    try {
      const avatar = await dispatch('getAvatar', state.userInfo.avatar);
      commit('updateAvatar', avatar);
    } catch (err) { console.log(err); }

    // 决定提示和按钮状态
    // 交给 getters，这样能够根据状态动态决定

    dispatch('getSharePoster');

    // 设置分享信息
    setShareData({
      username: state.userInfo.username,
      userAvatar: state.userInfo.avatar,
      courseName: getters.courseName,
      couponText: getters.couponText,
      isCourseReward: getters.isCourseReward,
    });

    // 完成初始化
    commit('updateInited', true);

    // 埋点
    track.collect('activityId', state.zanAlias);
    track.collect('posterType', get(state, 'zanDetail.collectZan.style'));
    track.collect('rewardType', get(state, 'zanDetail.collectZan.prizeChannel', 0));
    track.collect('supporterCount', get(getters, 'recordList.length', 0));

    if (!getters.isBuilder) {
      let from = '';
      const posterStyle = args.get('poster') || '';
      if (posterStyle) {
        from = +posterStyle === 0 ? 'poster-course' : 'poster-reward';
      } else {
        from = 'share';
      }
      track.collect('source', from);
      track.trigger('guestEnter');
    }
  },
  getSharePoster({ state, commit, getters }) {
    const {
      collectZanQrCode = {},
      collectZan,
    } = state.zanDetail;

    const posterData = {
      pathname: collectZan.style === 1 ? 'ump/collect-zan/ailey' : 'ump/collect-zan/billy',
      username: state.userInfo.username,
      userAvatar: state.userInfo.avatar,
      rewardText: getters.isCourseReward ? '0元免费得' : getters.couponText,
      limitText: getters.isCourseReward ? getters.courseName : `${getters.courseName}可用`,
      courseCover: getters.courseCover,
      courseTitle: getters.courseName,
      coursePrice: getters.coursePrice,
    };
    const url = `${_global.url.h5}/wscvis/ump/collect-zan?kdt_id=${_global.kdt_id}&zanAlias=${state.zanAlias}&alias=${state.alias}&poster=${collectZan.style}`;
    getSharePoster(url, collectZanQrCode.h5 || '', posterData)
      .then((res: string) => {
        commit('updatePosterUrl', res);
      })
      .catch((errMsg: string) => {
        console.error(errMsg || '生成海报失败');
      });
  },
  inviteFriend() {
    inviteFriend(() => {
      const props = { show: true };
      openWeixinSharePopup('', {
        props,
        on: {
          close() {
            props.show = false;
          },
        },
      });
    });
  },
  supportFriend({ state }): Promise<any> {
    const {
      collectZan,
      zanSet,
    } = state.zanDetail;
    return supportFriend({
      zanId: collectZan.id || 0,
      zanSetId: zanSet.id || 0,
    }).then(() => window.location.reload());
  },
  createZan({ state }) {
    track.trigger('guestWant');

    createZan(state.alias);
  },
  openMpPopup() {
    showMpQrcode();
  },
  toHome() {
    // 导航至店铺首页
    toHome();
  },
  receiveReward({ state }) {
    receiveReward(state.alias, state.zanDetail);
  },
  openPoster({ commit }) {
    track.trigger('generatePoster');

    commit('updateShowPoster', true);
  },
  getAvatar(_, avatarImg) {
    return uploadNetMaterial(avatarImg)
      .then((res: any) => {
        let avatar = 'https://img01.yzcdn.cn/public_files/2017/10/23/1321da81aa84d0539b0d5af73fbbf53b.png';
        if (res && res.code === 0) {
          avatar = res.data.url;
          if (typeof avatar === 'string') {
            avatar = avatar.replace(/^http:/, 'https:');
          }
        }
        return avatar;
      });
  },
  toCouponList,
  toCourse({ state }) {
    toCourse(state.alias);
  },
  toMyPay,
} as IZanActions;
