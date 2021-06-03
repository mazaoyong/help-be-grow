import { Toast } from 'vant';
import accAdd from '@youzan/utils/number/accAdd';
import buildUrl from '@youzan/utils/url/buildUrl';
import { setShareData, getShareLink } from '@youzan/wxsdk';
import { addSalesmanParams } from '@youzan/salesman-params-handler';
import FullGuide from '@/shared/components/fullguide';
import * as CustomSafeLink from '@/common/utils/custom-safe-link';
import { centToYuan } from '@/common/utils/helper';
import { postBookKey, goTradeBuy } from '@/common-api/buy';
import checkFansBuy from '@/common/utils/checkFansBuy';
import accountUnion from '@/common/utils/account-union';
import { GOODS_TYPE } from 'constants/course/goods-type';
import { GROUP_ACTIVITY_TYPE } from '../../constants';
import api from '../api';
import { fromatJoinList } from '../utils';
import { makePointLog } from '../log';
import openSkuPopup from '../../blocks/ump-sku';

import { checkCapitalLossForJoinGroupBuy } from '@/common/log/biz-log';

const { miniprogram } = window._global;

const actions = {
  // 初始化团详情数据
  async initData({ commit, state, dispatch }, payload) {
    const { grouponDetail, proType, isOwnAsset, alias, kdtId, activityType } = state;
    const {
      waitFlush,
      alertType,
      groupInfo = {},
    } = grouponDetail;

    try {
      makePointLog('display', 'enterpage', '浏览页面', 'eduGroupon', { alias, kdtId, activityType });
    } catch {}

    if (waitFlush || alertType === 1) {
      commit('INIT_ERROR_DATA', grouponDetail);
      payload.errCallback();
      return;
    }

    const { isJoinedGroup } = groupInfo;

    // 知识付费商品未参加当前团且未购买时需要查询下是否有参与其他团
    if (!isJoinedGroup && !isOwnAsset && proType !== GOODS_TYPE.COURSE) {
      return dispatch('fetchOtherGroup')
        .then(() => {
          commit('INIT_DATA');
          dispatch('setShareInfo');
        });
    }

    commit('INIT_DATA');
    dispatch('setShareInfo');
  },

  // 查询知识付费商品是否有其他进行中的团
  async fetchOtherGroup({ commit, state }, payload) {
    const groupInfo = state.grouponDetail.groupInfo;
    const { activityId, activityType } = groupInfo;
    return new Promise((resolve, reject) => {
      api.getJoinedGroupsByUser({
        activityId,
        activityType,
      })
        .then(res => {
          commit('OTHER_GROUP', res);
          resolve();
        });
    });
  },

  // 获取参团列表
  fetchMember({ state }, payload) {
    const params = state.params;
    let { groupInfo } = state.grouponDetail;
    const apiPramas = {
      groupId: groupInfo.groupId,
      umpType: groupInfo.activityType,
      pageNo: params.page,
      pageSize: params.pageSize,
    };
    return new Promise((resolve) => {
      api.getJoinFansInfoList(apiPramas)
        .then(res => {
          const { items } = res;
          const list = fromatJoinList(items);
          state.params.page++;
          resolve({ list, hasNext: items.length === params.pageSize });
        })
        .catch(() => {
          // 获取参团列表的接口访问失败时，展示团详情接口中的参团列表数据
          if (state.params.page === 1) {
            resolve({ list: state.joinRecords, hasNext: false });
          }
        });
    });
  },

  // 开/参团
  toGroup({ state, dispatch }, payload) {
    const { alias, grouponDetail, skuFormatModel, picture, proDetail, proType, selectedSku } = state;
    const { skuInfo } = grouponDetail.goodsInfo;
    const { activityType, gapNum, joinNum } = grouponDetail.groupInfo;

    if (proType === GOODS_TYPE.COURSE) {
      const { hasSku, collectionId } = skuFormatModel;
      if (hasSku) {
        let priceTag = activityType === GROUP_ACTIVITY_TYPE.LADDER ? '阶梯团' : `${accAdd(+gapNum, +joinNum)}人团`;
        openSkuPopup(alias, skuFormatModel, skuInfo, activityType, selectedSku, picture, priceTag, proDetail)
          .then(selectedSku => {
            state.selectedSku = selectedSku;
            dispatch('toPay', selectedSku.id);
          });
      } else {
        dispatch('toPay', collectionId);
      }
    } else {
      dispatch('toPay', null);
    }
  },

  toPay({ state }, skuId) {
    const { alias, grouponDetail, proDetail, proType } = state;
    const { goodsId } = proDetail;
    const { activityType, groupAlias, activityId } = grouponDetail.groupInfo;
    // 无sku
    const params = {
      productInfoList: [{
        alias,
        id: goodsId,
        owlType: proType,
        num: 1,
        skuId,
      }],
      umpInfo: {
        promotionType: activityType,
        promotionId: activityId,
        groupAlias,
      },
    };

    accountUnion.checkUnion('paidcontent', {
      needLogin: _global.need_ajax_login,
    })
      .then(({ didLogin }) => {
        return checkFansBuy({ didLogin });
      })
      .then(() => {
        postBookKey(params)
          .then(({ bookKey }) => {
            goTradeBuy({
              book_key: bookKey,
            });
          });
      });

    checkCapitalLossForJoinGroupBuy({ promotionId: activityId, groupAlias: groupAlias });
  },

  // 进入商详
  toProductDetail({ state }) {
    const { alias, kdtId, grouponDetail, isOwnAsset, isJoinedGroup } = state;
    const { groupAlias, isEnd } = grouponDetail.groupInfo;
    try {
      makePointLog('click', 'to_detail', '前往内容详情', 'eduGroupon', {});
    } catch {}
    let url = `/wscvis/course/detail/${alias}?kdtId=${kdtId}`;
    if (!isOwnAsset && !isJoinedGroup && !isEnd) {
      url = `${url}&groupAlias=${groupAlias}`;
    }
    CustomSafeLink.redirect({
      url,
      kdtId,
    });
  },

  // 引导分享
  toGuideShare({ state }) {
    FullGuide({
      viewType: 'share',
    });
  },

  // 生成海报
  toMakeCard({ state }) {
    const { inviteInfo, title, picture, originPrice, newGroupPrice, grouponDetail, shareUrl, poster } = state;
    if (poster) {
      state.showPosterPop = true;
    } else {
      const { activityType, gapNum, joinNum, isHead } = grouponDetail.groupInfo;
      let activityTag = activityType === GROUP_ACTIVITY_TYPE.LADDER ? '阶梯团' : `${accAdd(+gapNum, +joinNum)}人团`;
      const posterParams = {
        fansNickName: inviteInfo.fansNickName || '小伙伴',
        fansPicture: inviteInfo.fansPicture || 'https://img01.yzcdn.cn/public_files/2017/10/23/1321da81aa84d0539b0d5af73fbbf53b.png',
        picture,
        title,
        isHead,
        newGroupPrice: centToYuan(newGroupPrice[0]),
        originPrice: centToYuan(originPrice[0]),
        activityTag,
        shareUrl,
        newGroupPriceLength: newGroupPrice.length,
      };

      if (miniprogram.isWeapp) {
        posterParams.page = '/packages/edu/webview/index';
        posterParams.targetUrl = encodeURIComponent(shareUrl);
      } else if (miniprogram.isSwanApp) {
        posterParams.targetUrl = `/packages/edu/webview/index?targetUrl=${encodeURIComponent(this.shareUrl)}`;
      }

      api.getGrouponPoster(posterParams)
        .then(res => {
          if (res.img) {
            state.showPosterPop = true;
            state.poster = res.img;
          }
        })
        .catch(err => {
          Toast({
            message: err,
            duration: 3000,
          });
        });
    }
  },

  // 去首页
  toHome() {
    CustomSafeLink.redirect({
      url: '/wscshop/showcase/homepage',
    });
  },

  // 查看课程，线下课到已购买列表页，知识付费到详情页
  toPct({ state }) {
    const { proType, alias, kdtId } = state;
    let url = '';
    if (proType === GOODS_TYPE.COURSE) {
      url = `/wscvis/knowledge/index?p=mypay`;
    } else {
      url = `/wscvis/course/detail/${alias}`;
    }
    CustomSafeLink.redirect({
      url,
      kdtId,
    });
  },

  // 查看我的团，针对知识付费
  toSelfGroup({ state }) {
    const { oterGroup, alias, grouponDetail, kdtId } = state;
    const { activityType } = grouponDetail.groupInfo;
    const selfGroupUrl = `/wscvis/ump/groupon/groupon-detail?group_alias=${oterGroup.alias}&activity_type=${activityType}&alias=${alias}&kdt_id=${kdtId}`;
    CustomSafeLink.redirect({
      url: selfGroupUrl,
      kdtId,
    });
  },

  onClosePosterPop({ state }) {
    state.showPosterPop = false;
  },

  // 设置分享信息：1. 拼装分享链接；2. 设置 wxSdk 分享信息
  setShareInfo({ state, commit }) {
    const { grouponDetail, shareUserId, title, picture, desc, alias, maxDiscountPrice, isJoinedGroup } = state;
    const { groupAlias, activityType, gapNum } = grouponDetail.groupInfo;
    const currentShareUserId = isJoinedGroup ? _global.visBuyer.buyerId : shareUserId;
    const kdtId = _global.kdt_id;
    const url = `/wscvis/ump/groupon/groupon-detail?group_alias=${groupAlias}&alias=${alias}&activity_type=${activityType}&share_user_id=${currentShareUserId}&kdt_id=${kdtId}`;
    let shareUrl = buildUrl(url, 'h5', kdtId);
    let shareTitle = `【仅剩${gapNum}人】一起组队学习${title}，立省${centToYuan(maxDiscountPrice)}元。`;
    if (state.sl) {
      shareUrl = addSalesmanParams({
        kdtId,
        url: shareUrl,
        sl: state.sl,
      });
      shareTitle = `[分享]${shareTitle}`;
    }
    commit('SET_SHARE_URL', shareUrl);
    setShareData({
      notShare: false,
      link: getShareLink(shareUrl),
      title: shareTitle,
      desc,
      cover: picture,
    });
  },

  initSalesmanInfo({ state, commit, dispatch }, payload) {
    commit('SET_SL', payload);
    if (state.shareUrl) {
      // 如果已经已经初始化过 shareUrl，在 shareUrl 上添加销售员信息。
      dispatch('setShareInfo');
    }
  },
};
export default actions;
