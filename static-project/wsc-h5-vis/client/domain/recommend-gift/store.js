/* eslint-disable jsdoc/require-returns */
/* eslint-disable jsdoc/require-param */
import { get, isEmpty } from 'lodash';
import formatDate from '@youzan/utils/date/formatDate';
import format from '@youzan/utils/money/format';
import { ZNB } from '@youzan/wxsdk';
import showSharePoster from './components/share-poster';
import getWeappShareImg from './components/share-wechat';
import openShareMask from '@/components/share-mask/main.js';
import API from './api';
import * as GoodsAPI from '@/pages/course/detail/store/api';
import * as PayAPI from '@/common-api/pay';
import { redirect } from '@/common/utils/custom-safe-link';
import { isGetHighestPhase, getDisplayPrice } from './utils';
import goodsParser from '@/pages/course/detail/store/parser/goods-parser';

const { miniprogram = {} } = window._global;
const isWeapp = miniprogram.isWeapp;

const EmptyRewardDetail = {
  // 积分
  bonusPoint: 0,
  // 奖励
  presentList: [],
  // 优惠券
  couponList: [],
  helpCount: 0,
  phaseNo: '',
  rewardName: '课程大礼包',
};

const hasNextPage = (pageRequest) => {
  const { pageNumber, totalPages, pageSize } = pageRequest;
  // 初始化
  if (!pageNumber) {
    return {
      pageNumber: 1,
      pageSize,
    };
  } else {
    if (totalPages > pageNumber) {
      return {
        pageNumber: pageNumber + 1,
        pageSize,
      };
    } else {
      return false;
    }
  }
};

/**
 * 独立出来的store
 */
export default {
  namespaced: true,
  state: {
    // env 环境信息
    env: {},
    // 积分别名
    pointName: _global.visPointsName || '积分',
    //  商品信息
    goodsDetail: {},
    // 活动信息
    recommendGift: {
      helpedCount: 0,
      currentPhase: 0,
      commissionPrice: 0,
      decreasePrice: 0,
      phasedRewardDetails: [],
      hasDistributorAddOn: false,
    },
    // 我的收益
    myProfit: {
      // 佣金总计
      commissionValue: 0,
      // 待结算佣金(不能提取的部分)
      noSettlementCommissionValue: 0,
      // 积分总计
      point: 0,
      // 赠品总计
      presentCount: 0,
      // 优惠券总计
      couponCount: 0,
    },
    // 我的收益明细
    myProfitDetail: {
      fetching: false,
      list: [],
      pageRequest: {
        total: 0,
        pageNumber: 0,
        pageSize: 10,
      },
    },
    // 邀请记录(活动维度)
    activityInviteRecord: {
      fetching: false,
      list: [],
      pageRequest: {
        total: 0,
        pageNumber: 0,
        pageSize: 5,
      },
    },
    // 邀请记录（店铺维度）
    inviteRecord: {
      fetching: false,
      list: [],
      pageRequest: {
        total: 0,
        pageNumber: 0,
        pageSize: 5,
      },
    },
    // 跑马灯信息
    carousel: [],
    // 推荐商品列表(不分页)
    recommendGoodsList: [],
  },
  actions: {
    async getGoodsDetail({ rootStore, commit }, alias) {
      if (alias) {
        const results = await GoodsAPI.getDetail(alias);
        commit('setGoodsDetail', goodsParser(results.goodsType, results.goodsData));
      }
    },
    async getActivityDetail({ state, rootStore, commit }, { goodsAlias }) {
      if (goodsAlias) {
        const result = await API.getGetDetailByGoodsAlias({ goodsAlias });
        commit('setActivityDetail', result);
      }
    },
    async getMyProfit({ commit }) {
      const results = await API.getProfitInfo();
      commit('setMyProfit', results);
    },
    async getMyProfitDetail({ commit, state }, data) {
      const { fetching, pageRequest } = state.myProfitDetail;
      if (fetching) return;
      commit('updateListFetching', 'myProfitDetail', true);
      const nextPage = hasNextPage(pageRequest);
      if (nextPage) {
        const results = await API.getProfitDetail({
          ...data,
          pageRequest: nextPage,
        });
        commit('setMyProfitDetail', results);
      }
    },
    async getCarousel({ commit }) {
      const results = await API.getGetRewardCarousel();
      commit('setCarousel', results);
    },
    async openSharePoster({ state, getters }) {
      const { recommendGift } = state;
      const { hasDistributorAddOn, activityId } = recommendGift;
      const { goodsData } = getters;
      const shareLink = await API.getGoodsActivityDetail(goodsData.alias, hasDistributorAddOn, activityId, 'poster');
      const { subscriptionsCount } = goodsData;
      recommendGift.soldNum = subscriptionsCount;
      const drawInfo = await API.createDrawInfo(recommendGift, shareLink);
      showSharePoster(drawInfo);
    },
    async openShareWechat({ state, getters, rootState }) {
      const { goodsData } = getters;
      const { decreasePrice, hasDistributorAddOn, activityId } = state.recommendGift;
      const price = getDisplayPrice(state.recommendGift);
      const {
        pictures,
        title,
      } = goodsData;
        // 课程图片
      const shareLink = await API.getGoodsActivityDetail(goodsData.alias, hasDistributorAddOn, activityId);
      const courseCover = get(pictures, '[0].url');
      const formatTitle = `${price ? '好友推荐好课' : '好友送你'} ${title}`;
      let desc = '';

      if (!price) {
        desc = '免费领取';
      } else {
        if (decreasePrice) {
          desc = `报名立减 ${format(decreasePrice, true, false)}, 去报名`;
        } else {
          desc = '立即报名';
        }
      }

      // 微信分享
      const shareData = {
        title: formatTitle,
        desc,
        imgUrl: courseCover,
        link: shareLink,
      };

      // 小程序分享
      if (isWeapp) {
        const data = await getWeappShareImg({
          userAvatar: get(_global, 'visBuyer.finalAvatar') || 'https://img01.yzcdn.cn/public_files/2017/10/23/1321da81aa84d0539b0d5af73fbbf53b.png',
          decreasePrice: decreasePrice ? format(decreasePrice, true, false) : 0,
          price: price ? format(price, true, false) : 0,
          img: courseCover,
        });
        shareData.title = formatTitle;
        shareData.imgUrl = data.img;
      }
      ZNB.configShare(shareData);
      openShareMask();
    },
    async fetchRecommendList({ commit }) {
      const items = await API.getRecommendGoods();
      commit('setRecommendGoodsList', items);
    },
    async getInviteRecord({ state, commit }, activityId) {
      if (activityId) {
        const { activityInviteRecord: { pageRequest, fetching } } = state;
        if (fetching) return;
        commit('updateListFetching', { key: 'activityInviteRecord', value: true });
        const nextPage = hasNextPage(pageRequest);
        if (nextPage) {
          const result = await API.getInviteRecord({ activityId,
            pageRequest: nextPage,
          });
          commit('setActivityInviteRecord', result);
        }
      } else {
        const { inviteRecord: { pageRequest, fetching } } = state;
        if (fetching) return;
        commit('updateListFetching', { key: 'inviteRecord', value: true });
        const nextPage = hasNextPage(pageRequest);
        if (nextPage) {
          const result = await API.getInviteRecord({
            pageRequest: nextPage,
          });
          commit('setInviteRecord', result);
        }
      }
    },
    // 提现跳转
    async withdraw({ commit, state }) {
      const { upgraded } = await PayAPI.getSalemanUpgradeResult();
      if (upgraded) {
        redirect({
          url: `/wscassets/change/profile?kdtId=${window._global.kdt_id}`,
          query: {
            kdtId: window._global.kdt_id,
          },
        });
      } else {
        redirect({
          url: `/wscassets/withdraw`,
          query: {
            kdtId: window._global.kdt_id,
          },
        });
      }
    },
    // 跳转至商品活动详情页
    async goActivityDetail({ commit, state }, { alias, fromPage }) {
      redirect({
        url: '/wscvis/ump/referral-invite',
        query: {
          alias,
          fromPage,
        },
      });
    },
  },
  mutations: {
    setRecommendGoodsList(state, data) {
      state.recommendGoodsList = state.recommendGoodsList.concat(data);
    },
    setGoodsDetail(state, data) {
      state.goodsDetail = data;
    },
    setActivityDetail(state, data) {
      state.recommendGift = { ...state.recommendGift, ...data };
    },
    setMyProfit(state, data) {
      state.myProfit = { ...state.myProfit, ...data };
    },
    setMyProfitDetail(state, data) {
      const { list, pageRequest } = state.myProfitDetail;
      const { content, pageable, ...others } = data;

      state.myProfitDetail = {
        fetching: false,
        list: list.concat(content.map(o => {
          let rewardName = o.rewardMode === 1 ? `￥${format(o.commissionValue, true, false)}` : `${o.rewardName || '课程大礼包'}`;

          return {
            title: `邀请${o.buyerNum}人下单，获得${rewardName}`,
            time: formatDate(o.rewardTime, 'YYYY-MM-DD HH:mm'),
            status: o.status,
            couponData: o.couponData || [],
            presentData: o.presentData || [],
            couponNum: o.couponNum || 0,
            pointsNum: o.pointsNum,
            hasContent: !!(o.couponData || o.presentData || o.couponNum),
          };
        })),
        pageRequest: {
          ...pageRequest,
          ...pageable,
          ...others,
        },
      };
    },
    setCarousel(state, data) {
      const lists = [];
      data.forEach(record => {
        const keyMap = {
          couponNum: '张优惠券',
          commissionValue: '佣金',
          presentNum: '个赠品',
          pointsNum: state.pointName,
        };

        for (let key in keyMap) {
          if (record[key] && record.oldCustomerName) {
            let rewardValue = record[key];
            if (key === 'commissionValue') {
              rewardValue = format(record[key], true, false);
            }
            const item = {
              avatar: record.avatar,
              content: `${record.oldCustomerName} 刚刚获得 ${rewardValue} ${keyMap[key]}`,
            };
            lists.push(item);
          }
        }
      });
      state.carousel = lists;
    },
    setInviteRecord(state, data) {
      const { content, pageable, ...others } = data;
      const { list, pageRequest } = state.inviteRecord;
      const newList = list.concat(content.map(item => {
        if (!item.profileUrl) {
          item.profileUrl = 'https://img01.yzcdn.cn/upload_files/2020/08/04/Fj1Bufd7kfFGdybb8P4Irqnc1RUv.png';
        }
        return item;
      }));

      state.inviteRecord = {
        fetching: false,
        list: newList,
        pageRequest: {
          ...pageRequest,
          ...pageable,
          ...others,
        },
      };
    },
    setActivityInviteRecord(state, data) {
      const { content, pageable, ...others } = data;
      const { list, pageRequest } = state.activityInviteRecord;
      const newList = list.concat(content.map(item => {
        if (!item.profileUrl) {
          item.profileUrl = 'https://img01.yzcdn.cn/upload_files/2020/08/04/Fj1Bufd7kfFGdybb8P4Irqnc1RUv.png';
        }
        return item;
      }));

      state.activityInviteRecord = {
        fetching: false,
        list: newList,
        pageRequest: {
          ...pageRequest,
          ...pageable,
          ...others,
        },
      };
    },
    updateListFetching(state, { key, value }) {
      state[key] = {
        ...state[key],
        fetching: value,
      };
    },
  },
  getters: {
    /* 聚合出口：商品详情 */
    goodsData(state, getters, rootState) {
      return isEmpty(state.goodsDetail) ? {
        ...rootState.goodsData,
        // 以goodsDetail接口为标准，补全数据
        price: rootState.goodsData ? rootState.goodsData.sku.minPrice : 0,
      } : state.goodsDetail;
    },
    /* 获得最大奖励 */
    getHighestPhase(state) {
      return isGetHighestPhase(state.recommendGift);
    },
    /* 下一阶段奖励 */
    nextPhaseReward(state, getters) {
      const { phasedRewardDetails, currentPhase, helpedCount } = state.recommendGift;
      const { getHighestPhase } = getters;

      if (getHighestPhase) {
        return phasedRewardDetails[currentPhase - 1];
      } else if (phasedRewardDetails && phasedRewardDetails.length) {
        if (helpedCount > 0) {
          const nextPhase = phasedRewardDetails.find(item => item.phaseNo === (currentPhase + 1));
          return { ...EmptyRewardDetail, ...nextPhase };
        } else {
          return { ...EmptyRewardDetail, ...phasedRewardDetails[0] };
        }
      } else {
        return EmptyRewardDetail;
      }
    },
    /* 仅阶梯奖励 */
    onlyPhaseReward(state) {
      const { recommendGift } = state;
      const { commissionPrice, phasedRewardDetails } = recommendGift;
      return !commissionPrice && phasedRewardDetails && !!phasedRewardDetails.length;
    },
  },
};
