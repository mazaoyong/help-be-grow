import { Toast } from 'vant';
import { setShareData, getShareLink, ZNB } from '@youzan/wxsdk';
import format from 'zan-utils/money/format';
import isEmpty from 'lodash/isEmpty';
import { SELLER_TYPE, ACTIVITY_TYPE, SHARE_TEXT_MAP, ICON, PRESENT_TYPE } from 'pct/constants';
import apis from 'pct/api';
import { getShareParamStr, appendLogParamsTo, secondsToColonTimeStr } from 'pct/utils';
import mixinPackage from 'components/package-entry/mixin';
// 复用教育活动mixin的部分方法，后面重构在一起
import mixinActivity from '../../edu/mixins/mixinActivity';
import { findPresentByCondition } from '../../ump/recieve-present/api';
import * as SafeLink from '@youzan/safe-link';
import Args from '@youzan/utils/url/args';
import compareVersions from '@youzan/utils/string/compareVersions';
import { checkAndLogin } from '@/common/utils/login';

import { COLLECT_ZAN_UPGRADING_ONLINE_TIME } from '../../edu/constant';

const global = window._global;
const salesmanInfo = global.salesmanInfo || {};
const sls = salesmanInfo.seller || '';
const miniprogram = global.miniprogram || {};
const isWeapp = miniprogram.isWeapp;
const buyerId = (global.visBuyer || {}).buyerId || 0;

export default {
  name: 'mixin-activity',

  mixins: [
    mixinPackage, mixinActivity,
  ],

  data() {
    return {
      // 买赠
      meetReduce: {},

      // 集赞
      collectPraise: {},
      collectPraiseNum: 0,
      prizeChannel: 0,

      // 推荐有礼
      showRefferal: false,
      referralInfo: {},

      // 送礼
      isPersentGift: false,
      isInviteFriend: false,
      // 送礼活动信息
      persentGiftInfo: {},
      isReceivedOver: false, // 请好友看是否领完了

      // 邀请卡
      // 邀请卡&分销活动信息
      inviteCardInfo: {},
      inviteCardQrUrl: '',
      isDistribution: false,

      // 拼团
      hasPromotion: false,
      promotionData: {},
      promotionButtonInfo: {},

      // 活动信息
      activityBannerInfo: {},

      // 是否展示活动banner
      isShowActivityBanner: false,

      // 活动类型
      activityType: '',
      // 活动价格
      activityPrice: 0,
      // 活动限购情况
      activityQuota: {
        quota: 0,
        quotaUsed: 0,
        isAllowContinueBuy: 1,
        type: '',
      },
      // 活动是否已开始
      activityStarted: false,
      // 促销信息，此时里面只包括买赠活动信息
      promotionInfo: [],
      // 已领取的赠品列表
      recievedPresent: [],
      // 待领取的赠品列表
      unRecievePresent: [],
      // 是否展示待领取弹框
      isShowUnrecievePresentPop: false,
      isFromPay: false,
      seckillInfo: {},
      // 积分活动
      showPoints: false,
      pointsInfo: {},
      fansBenefitData: {},
      isJoined: true,
      groupInfo: null,
      umpAlias: Args.get('ump_alias') || Args.get('ump_alias_bak'),
    };
  },

  created() {
    // this.fetchNewActivities();
    this.fetchGroupData();
  },

  computed: {
    showInviteFriendBtn() {
      // 积分活动，只允许积分兑换时，不显示送好友按钮
      return !(this.showPoints && this.pointsInfo.buyLimit);
    },
  },

  methods: {
    fetchNewActivities() {
      if (Args.get('activityType') === 'seckill') {
        return apis.getSeckillInfo(Args.get('ump_alias') || Args.get('ump_alias_bak'))
          .then(data => {
            this.showSeckill = true;
            this.activityType = 'seckill';
            this.seckillInfo = data;
            return [data];
          })
          .catch(err => {
            Toast.fail(err || '秒杀信息获取失败');
          });
      }
      return apis.getNewActivities({
        alias: this.$params.alias || '',
        productType: 31,
        activityType: this.activityType,
      })
        .then(res => {
          if (res) {
            // this.parseNewActivities(res);
            this.activityType = '';
            return res;
          }
        })
        .catch(errMsg => {
          return [];
        });
    },

    fetchGroupData() {
      const groupType = Args.get('groupType');
      const groupAlias = Args.get('groupAlias');
      if (groupType && groupAlias) {
        apis.getGroupOnDetail({
          group_alias: groupAlias,
          activity_type: groupType,
        }).then(res => {
          const { groupInfo = {}, joinRecords = [] } = res;
          if (!groupInfo.isGroupOnSuccess && !groupInfo.isGroupOnFailed && !groupInfo.isEnd) {
            this.groupInfo = {
              avatar: joinRecords[0] && joinRecords[0].fansPicture,
              name: joinRecords[0] && joinRecords[0].fansNickName,
              gapNum: groupInfo.gapNum,
              groupAlias: groupInfo.groupAlias,
            };
          }
        });
      }
    },

    parseNewActivities(rawData = [], goodsData = {}) {
      const { $page } = this;
      rawData.forEach(item => {
        switch (item.type) {
          case 'recommendPolite':
            // 有老客 buyerid 时才展示推荐有礼的价格
            this.showRefferal = Boolean(+$page.$params.bid);
            if (Array.isArray(item.data) && item.data.length) {
              this.referralInfo = item.data[0];
            }
            break;
          // 好友助力活动迁移到新接口
          case 'collectZan':
            this.collectPraise = item.data;
            const {
              processState,
              updatedAt,
              collectNum,
              prizeChannel,
            } = this.collectPraise;
            // 好友助力升级项目：小程序环境下展示，老数据的修改时间在上线时间之前也展示
            const shouldShowCollectZanButton = processState === 1 &&
            (global.miniprogram.isMiniProgram || updatedAt < COLLECT_ZAN_UPGRADING_ONLINE_TIME);

            this.collectPraiseNum = shouldShowCollectZanButton
              ? collectNum
              : 0;
            if (prizeChannel) {
              this.prizeChannel = prizeChannel;
            }
            break;
          case 'invite':
            this.inviteCardInfo = item.data;
            break;
          case 'packageBuy':
            this.packageData = item.data;
            break;
          case 'timelimitedDiscount':
            this.activityType = item.type;
            this.timelimitedDiscountData = item.data || {};
            const { quota, quotaUsed, isAllowContinueBuy, isStarted, min, description } = this.timelimitedDiscountData;
            this.isTimeLimited = isStarted;
            if (isStarted) {
              this.activityBannerInfo = {
                tagName: description || '限时折扣',
                activityPrice: this.timelimitedDiscountData.min === this.timelimitedDiscountData.max
                  ? this.timelimitedDiscountData.min
                  : [this.timelimitedDiscountData.min, this.timelimitedDiscountData.max],
                startAt: +this.timelimitedDiscountData.startAt * 1000,
                endAt: +this.timelimitedDiscountData.endAt * 1000,
                themeType: window._global.themeType,
              };
              isStarted && this.parseActivityInfoForGift(min, quota, quotaUsed, isAllowContinueBuy, 'timelimitedDiscount');
              this.isShowActivityBanner = isStarted;
            }
            break;
          case 'meetReduce':
            this.parsePromotionInfo(item);
            // this.promotionInfo.push(item);
            break;
          case 'pointsGoods': // 参与积分活动
            this.showPoints = true;
            this.activityType = item.type;
            this.pointsInfo = item.data;
            break;
          case 'fansBenefit':
            this.fansBenefitData = this.formatFansBenefit(item.data);
            break;
          case 'gift': // 送礼
          case 'share': // 请好友看
            this.praseNewPersentGiftActivity(item);
            this.setInviteFriendShareParam(goodsData);
            break;
          // 拼团
          case 'groupon':
            const { data } = item;
            const startAt = data.startAt * 1000;
            const endAt = data.endAt * 1000;
            let minPrice = null;
            let maxPrice = 0;
            Object.keys(data.skuPrices).forEach(key => {
              if (data.skuPrices[key] > maxPrice) {
                maxPrice = data.skuPrices[key];
              }
              if (minPrice === null || data.skuPrices[key] < minPrice) {
                minPrice = data.skuPrices[key];
              }
            });
            let status = 0;
            if (Date.now() > startAt) {
              status = 1;
            }
            if (Date.now() > endAt) {
              status = 2;
            }
            this.promotionData = {
              endAt,
              startAt,
              goodsId: +data.goodsId,
              promotionDetail: {
                ...data,
                groupList: data.onGoingGroupList,
                endAt,
                startAt,
                maxPrice,
                minPrice,
                price: minPrice,
                promotionType: 4,
                status,
              },
              userStatus: {
                groupAlias: data.joinedGroup && data.joinedGroup.alias,
                status: data.joinedGroup ? 1 : 0,
              },
              promotionId: +data.activityId,
              promotionPrice: minPrice,
              promotionType: 4,
            };
            this.isJoined = Boolean(this.promotionData.userStatus.status);
            this.hasPromotion = !isEmpty(rawData);
            if (this.hasPromotion) {
              this.promotionButtonInfo = {
                price: this.promotionData.promotionPrice,
                userGroupAlias: this.promotionData.userStatus.groupAlias,
                userStatus: this.promotionData.userStatus,
                promotionType: this.promotionData.promotionType,
                alias: goodsData.alias,
              };
              this.activityBannerInfo = {
                tagName: `${data.groupType === 1 ? '老带新' : ''}${this.promotionData.promotionDetail.conditionNum}人团`,
                activityPrice: this.promotionData.promotionPrice,
                orginPrice: goodsData.price,
                startAt: this.promotionData.startAt,
                endAt: this.promotionData.endAt,
                themeType: window._global.themeType,
              };
              this.isShowActivityBanner =
              (Date.now() > this.promotionData.startAt) &&
              (Date.now() < this.promotionData.endAt);
            }
            break;
          case 'ladderGroupOn':
            const ladderPriceMap = {};
            let ladderMinPrice = null;
            let ladderMaxPrice = 0;
            Object.keys(item.data.ladderPrice).forEach(key => {
              item.data.ladderPrice[key].forEach(sku => {
                if (sku.skuPrice > ladderMaxPrice) {
                  ladderMaxPrice = sku.skuPrice;
                }
                if (ladderMinPrice === null || sku.skuPrice < ladderMinPrice) {
                  ladderMinPrice = sku.skuPrice;
                }
                if (!ladderPriceMap[sku.scale]) {
                  ladderPriceMap[sku.scale] = [];
                }
                ladderPriceMap[sku.scale].push({
                  skuId: key,
                  skuPrice: sku.skuPrice,
                });
              });
            });

            const ladderStartAt = item.data.startAt * 1000;
            const ladderEndAt = item.data.endAt * 1000;
            this.promotionData = {
              startAt: ladderStartAt,
              endAt: ladderEndAt,
              promotionId: +item.data.activityId,
              promotionPrice: ladderMinPrice,
              promotionType: 26,
              promotionDetail: {
                ...item.data,
                groupList: item.data.onGoingGroupList,
                groupType: 2,
                startAt: ladderStartAt,
                endAt: ladderEndAt,
                maxPrice: ladderMaxPrice,
                minPrice: ladderMinPrice,
                price: ladderMinPrice,
                ladderPrice: ladderPriceMap,
              },
              userStatus: {
                status: item.data.joinedGroup ? 1 : 0,
                groupAlias: item.data.joinedGroup && item.data.joinedGroup.alias,
              },
            };
            this.isJoined = Boolean(this.promotionData.userStatus.status);
            this.hasPromotion = !isEmpty(rawData);
            if (this.hasPromotion) {
              this.promotionButtonInfo = {
                price: this.promotionData.promotionPrice,
                userGroupAlias: this.promotionData.userStatus.groupAlias,
                userStatus: this.promotionData.userStatus,
                promotionType: this.promotionData.promotionType,
                groupType: 2,
                ladderPrice: ladderPriceMap,
                maxPrice: ladderMaxPrice,
                minPrice: ladderMinPrice,
                cover: (this.contentData && this.contentData.cover) || (this.columnData && this.columnData.cover),
                alias: goodsData.alias,
              };
              this.activityBannerInfo = {
                tagName: '阶梯拼团',
                activityPrice: this.promotionData.promotionPrice,
                orginPrice: goodsData.price,
                startAt: this.promotionData.startAt,
                endAt: this.promotionData.endAt,
                themeType: window._global.themeType,
              };
              this.isShowActivityBanner =
              (Date.now() > this.promotionData.startAt) &&
              (Date.now() < this.promotionData.endAt);
            }
            break;
          default:
            break;
        }
      });
    },

    parsePromotionInfo(activity = {}) {
      this.promotionInfo = [];
      const formatTemp = {
        tags: '',
        descriptions: '',
        presentList: [],
      };
      if (activity.type === 'meetReduce') {
        const data = activity.data || [];
        if (data.length > 0) {
          // 偶发后端没有返回活动数据，做下兼容
          const pointsName = global.visPointsName || '积分';
          data.forEach(item => {
            formatTemp.tags = '赠品';
            const {
              couponId,
              couponValue,
              couponTitle,
              couponDiscount,
              couponNum,
              score,
              presentInfoList = [],
            } = item;

            const presentGoodsList = presentInfoList.length > 0 ? presentInfoList[0].presentGoodsList : [];
            let promotionStr = [];

            if (presentGoodsList.length > 0) {
              // ！是否是时尚芭莎店铺，过期可删除 ！
              // https://xiaolv.qima-inc.com/#/demand/search?show=true&ids=47630
              const isShopBaSha = +_global.kdt_id === 44691741;
              promotionStr.push(isShopBaSha ? '送峰会观众票' : '购课送课程大礼包');
            }

            score && promotionStr.push(`${score}${pointsName}`);

            if (couponId) {
              const promotionValue = couponValue ? format(couponValue, true) : 0;
              const promotionDiscout = (couponDiscount / 10).toFixed(1);
              let coupongStr = couponNum ? `${couponNum}张` : '';
              if (promotionValue) {
                coupongStr += `${promotionValue}元`;
              } else {
                coupongStr += `${promotionDiscout}折`;
              }
              coupongStr += `${couponTitle}`;
              promotionStr.push(coupongStr);
            }
            formatTemp.descriptions = promotionStr.join(',');
            formatTemp.presentGoodsList = presentGoodsList;
          });
          this.promotionInfo.push(formatTemp);
        }
      }
    },
    parseActivityInfoForGift(price, quota, quotaUsed, isAllowContinueBuy, type) {
      this.activityStarted = true;
      this.activityPrice = price;
      this.activityQuota = {
        // 限购件数
        quota,
        // 已占用名额
        quotaUsed,
        // 是否允许继续购买
        isAllowContinueBuy,
        type,
      };
    },

    parseActivities(data, goodsData, contentData) {
      const { $page } = this;
      data.forEach((item) => {
        switch (item.type) {
          case 'meetReduce':
            // 内容详情，免费试读和仅支持专栏不显示买赠信息
            if (
              contentData &&
              (contentData.isFree || contentData.sellerType === SELLER_TYPE.COLUMN)
            ) {
              break;
            }
            this.meetReduce = item;
            break;
          case 'share':
            this.prasePersentGiftActivity(item.activityData);
            this.setInviteFriendShareParam(goodsData);
            break;
          case 'recommendPolite':
            // 有老客 buyerid 时才展示推荐有礼的价格
            this.showRefferal = Boolean($page.$params.bid);
            this.referralInfo = item.activityData[0];
            break;
          // 拼团
          case 'groupon':
            this.promotionData = item.activityData;
            this.hasPromotion = !isEmpty(data);
            if (this.hasPromotion) {
              this.promotionButtonInfo = {
                price: this.promotionData.promotionPrice,
                userGroupAlias: this.promotionData.userStatus.groupAlias,
                userStatus: this.promotionData.userStatus,
                promotionType: this.promotionData.promotionType,
              };
              this.activityBannerInfo = {
                tagName: `${this.promotionData.promotionDetail.conditionNum}人团`,
                activityPrice: this.promotionData.promotionPrice,
                orginPrice: goodsData.price,
                startAt: this.promotionData.startAt,
                endAt: this.promotionData.endAt,
                themeType: window._global.themeType,
              };
              this.isShowActivityBanner =
              (Date.now() > this.promotionData.startAt) &&
              (Date.now() < this.promotionData.endAt);
            }
            break;
          default:
            break;
        }
      });
    },

    // 送礼&请好友看新接口处理
    praseNewPersentGiftActivity(activity = {}) {
      this.persentGiftInfo = activity.data || {};
      if (activity.type === 'gift') { // 送礼
        this.isPersentGift = true;
      } else if (activity.type === 'share') { // 请好友看
        this.isInviteFriend = true;
        const { everyContentFriendCount = null, receivedCount = null } = this.persentGiftInfo;
        // 请好友内容是否领取完
        this.isReceivedOver = everyContentFriendCount === receivedCount;
      }
    },

    // 已迁新方法，后续会下掉
    prasePersentGiftActivity(activityList) {
      activityList.forEach(element => {
        // 送礼
        const isPersentGift = element.channelType === ACTIVITY_TYPE.PERSENT_GIFT;
        // 请好友看
        const isInviteFriend = element.channelType === ACTIVITY_TYPE.INVITE_FRIEND;
        if (isPersentGift || isInviteFriend) {
          this.persentGiftInfo = element;
          // 请好友内容是否领取完
          this.isReceivedOver = element.everyContentFriendCount === element.receivedCount;
          this.isPersentGift = isPersentGift;
          this.isInviteFriend = isInviteFriend;
        } else if (element.channelType === ACTIVITY_TYPE.INVITE_CARD) {
          this.inviteCardInfo = element;
          this.inviteCardQrUrl = `${global.url.h5}/wscvis/knowledge/index?kdt_id=${global.kdt_id}&channel_type=${this.inviteCardInfo.channelType}&alias=${this.$page.$params.alias}&page=contentshow`;
          this.isDistribution = this.inviteCardInfo.isDistribution === 1;
        }
      });
    },

    // 设置送礼请好友分享内容
    setInviteFriendShareParam(goodsData) {
      if (this.isInviteFriend && !this.isReceivedOver) {
        this.setShareParam();
      } else {
        // 修改分享内容
        const { title, cover, summary } = goodsData;
        sls && (this.inviteCardQrUrl += `&sls=${sls}`);
        setShareData({
          notShare: false,
          desc: summary,
          link: getShareLink(appendLogParamsTo(this.inviteCardQrUrl)),
          title,
          cover,
        });
      }
    },

    // 设置请好友看分享内容
    setShareParam() {
      const { $page } = this;
      apis.getShareAlias({
        alias: $page.$params.alias,
      })
        .then(data => {
          const paramStr = getShareParamStr({
            gift_type: 2,
            channel_type: this.persentGiftInfo.channelType,
            share_alias: data,
            page: 'giftshow',
            alias: $page.$params.alias,
            kdt_id: window._global.kdt_id,
          });
          const shareUrl = `${window._global.url.wap}/ump/paidcontent?${paramStr}`;
          // 修改分享内容
          setShareData({
            notShare: false,
            desc: `${$page.contentData.summary}`,
            link: getShareLink(appendLogParamsTo(shareUrl)),
            title: `${SHARE_TEXT_MAP[$page.contentData.mediaType]}【${$page.contentData.author}：${$page.contentData.title}】`,
            cover: $page.contentData.cover,
          });
        });
    },

    createPraise(type) {
      const { $page } = this;
      /* 好友助力活动升级项目开始 */
      if (!global.miniprogram.isMiniProgram) {
        const url = `${global.url.h5}/wscvis/knowledge/activity-upgrading?alias=${$page.$params.alias}&type=${type}`;
        SafeLink.redirect({
          url,
          kdtId: window._global.kdt_id,
        });
        return;
      }
      /* 好友助力活动升级项目结束 */

      checkAndLogin(() => {
        const praiseParams = {
          zanId: this.collectPraise.id,
          targetAlias: $page.$params.alias,
        };

        apis.createPraiseActivity(praiseParams)
          .then((data) => {
            try {
              // 订阅消息二期迁回原生并且原生代码有改动需要判断小程序版本号（>2.48.0）
              if (isWeapp && compareVersions(global.weappVersion, '2.48.0') > 0) {
                const weappUrl = `/packages/paidcontent/support/index?alias=${$page.$params.alias}&zanAlias=${data}&type=${type}`;
                ZNB.navigate({
                  weappUrl,
                });
              } else {
                const url = `${global.url.wap}/ump/paidcontent/index?kdt_id=${global.kdt_id}&alias=${$page.$params.alias}&zanAlias=${data}&type=${type}&page=supportinvitation#/supportinvitation`;
                SafeLink.redirect({
                  url,
                  kdtId: window._global.kdt_id,
                });
              }
            } catch (err) {
              const url = `${global.url.wap}/ump/paidcontent/index?kdt_id=${global.kdt_id}&alias=${$page.$params.alias}&zanAlias=${data}&type=${type}&page=supportinvitation#/supportinvitation`;
              SafeLink.redirect({
                url,
                kdtId: window._global.kdt_id,
              });
            }
          })
          .catch(errMsg => {
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          });
      });
    },

    // 获取赠品列表
    fetchPresentList(query) {
      buyerId && findPresentByCondition(query)
        .then((res) => {
          if (res.code && res.code > 0) {
            return;
          }

          let recievedPresent = [];
          let unRecievePresent = [];
          (res || []).forEach(item => {
            item.receiveStatus === 1 &&
            (recievedPresent.push(item));
            if (item.receiveStatus === 0 &&
              (item.presentType === PRESENT_TYPE.GOODS ||
                (item.presentType === PRESENT_TYPE.EDU && item.owlType === 10))) {
              unRecievePresent.push(item);
            }
          });
          this.recievedPresent = this.parseRecievedPresent(recievedPresent);
          this.unRecievePresent = unRecievePresent;
          this.isShowUnrecievePresentPop = Boolean(this.isFromPay && this.unRecievePresent.length > 0);
        });
    },

    parseRecievedPresent(data = []) {
      let listTmp = [];
      data.forEach(item => {
        if (item.presentType === 1 && item.owlType !== 10) {
          if (item.owlType === 1) {
            item.thumbnailIcon = ICON.COLUMN;
          } else if (item.owlType === 2) {
            if (item.mediaType === 1) {
              item.thumbnailIcon = ICON.IMAGE;
            } else if (item.mediaType === 2) {
              item.thumbnailIcon = ICON.AUDIO;
            } else if (item.mediaType === 3) {
              item.thumbnailIcon = ICON.VIDEO;
            }
          } else if (item.owlType === 4) {
            item.thumbnailIcon = ICON.LIVE;
          }
          let subscriptionsDes = item.subscriptionsCount > 0 ? `${item.subscriptionsCount}人已学` : '';
          let videoDurationDes = item.videoDuration ? secondsToColonTimeStr(item.videoDuration) : '';
          if (subscriptionsDes && videoDurationDes) {
            item.summary = `${subscriptionsDes}|${videoDurationDes}`;
          } else {
            item.summary = `${subscriptionsDes}` || `${videoDurationDes}`;
          }
          listTmp.push(item);
        }
      });
      return listTmp;
    },
  },
};
