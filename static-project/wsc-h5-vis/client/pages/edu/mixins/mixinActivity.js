import format from 'zan-utils/money/format';
import isEqual from 'lodash/isEqual';
import map from 'lodash/map';
import { getActivityApi } from 'common-api/activity';
import minBy from 'lodash/minBy';
import maxBy from 'lodash/maxBy';
import get from 'lodash/get';

export default {
  data() {
    return {
      activityBannerInfo: {},
      isShowActivityBanner: false,
      activityPrices: {},
      // 活动限购情况
      activityQuota: {
        quota: 0,
        quotaUsed: 0,
        isAllowContinueBuy: true,
        type: '',
      },
      // 促销活动信息
      promotionInfo: [],
      showPromotionWrapper: false,
    };
  },

  methods: {
    fetchNewActivities(alias = '') {
      return getActivityApi({
        alias,
        productType: 31,
      })
        .then(res => {
          const data = res || [];
          if (data.length > 0) {
            return data;
          }
        })
        .catch(errMsg => {
          return [];
        });
    },

    parseTimelimitedDiscount(data) {
      const { min, max, startAt, endAt, isStarted, quota, quotaUsed, isAllowContinueBuy, description } = data;
      this.isShowActivityBanner = isStarted;
      if (isStarted) {
        this.activityBannerInfo = {
          tagName: description || '限时折扣',
          activityPrice: min === max ? min : [min, max],
          startAt: +startAt * 1000,
          endAt: +endAt * 1000,
        };
        this.activityPrices = {
          minPrice: min,
          maxPrice: max,
          skuPrices: this.formatSkuPrices(data.skus),
          price: min,
        };
        this.computeActivityQuota(quota, quotaUsed, isAllowContinueBuy, 'timelimitedDiscount');
      }
    },

    parseSeckillDiscount(data) {
      const { status, skuInfos } = data;
      if (status === 1) {
        const min = minBy(skuInfos, item => item.seckillPrice);
        const max = maxBy(skuInfos, item => item.seckillPrice);
        const formated = this.formatSeckillSku(skuInfos);
        this.activityPrices = {
          minPrice: min.seckillPrice,
          maxPrice: max.seckillPrice,
          skuPrices: formated.prices,
          skuStocks: formated.stocks,
          price: min.seckillPrice,
        };
      }
    },

    computeActivityQuota(quota, quotaUsed, isAllowContinueBuy, type) {
      this.activityStarted = true;
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

    formatSkuPrices(skus = []) {
      let skuPrices = [];
      skus.forEach(item => {
        skuPrices[item.id] = item.discountPrice;
      });
      return skuPrices;
    },

    // 处理促销活动信息
    parsePromotionInfo(activity = {}, skuIds = []) {
      const formatTemp = {
        tags: '',
        descriptions: '',
        presentList: [],
        activityType: '',
        skuId: [],
      };
      skuIds.length > 0 && (skuIds.sort((a, b) => a - b));
      if (activity.type === 'meetReduce') {
        const data = activity.data || [];
        if (data.length > 0) {
          const presentList = data[0].presentInfoList || [];
          const pointsName = _global.visPointsName || '积分';
          const presentGoodsList = presentList.length > 0 ? get(presentList[0], 'presentGoodsList', []) : [];
          formatTemp.tags = '赠品';
          formatTemp.activityType = activity.type;
          let activitySkuIds = map(presentList, 'skuId');
          let activitySkuName = map(presentList, 'skuDesc');
          activitySkuIds.sort((a, b) => a - b);
          formatTemp.skuId = activitySkuIds;
          let promotionStr = [];
          const activityData = data[0];
          // 目前仅支持多sku送相同的赠品，故如此处理；后续支持多sku送不同赠品时，需要修改
          if (presentList.length > 0 && (presentList[0].presentGoodsList || []).length > 0) {
            if (skuIds.length === 0) {
              promotionStr.push('购课送课程大礼包');
            } else if (isEqual(activitySkuIds, skuIds)) {
              promotionStr.push('购课送课程大礼包');
            } else {
              promotionStr.push(`购${activitySkuName.join(',')}送课程大礼包`);
            }
          }
          const {
            couponId,
            couponValue,
            couponTitle,
            couponDiscount,
            couponNum,
            score,
          } = activityData;

          score && promotionStr.push(`${score}${pointsName}`);

          if (couponId) {
            const promotionValue = couponValue ? format(couponValue, true) : 0;
            const promotionDiscout = (couponDiscount / 10).toFixed(1);
            let couponStr = couponNum ? `${couponNum}张` : '';
            if (promotionValue) {
              couponStr += `${promotionValue}元`;
            } else {
              couponStr += `${promotionDiscout}折`;
            }
            couponStr += `${couponTitle}`;
            promotionStr.push(couponStr);
          }
          formatTemp.descriptions = promotionStr.join(',');
          formatTemp.presentGoodsList = presentGoodsList;
        }
      }
      this.promotionInfo.push(formatTemp);
      this.showPromotionWrapper = this.promotionInfo.length > 0;
    },

    formatSeckillSku(skus = []) {
      let prices = [];
      let stocks = [];
      skus.forEach(item => {
        prices[item.skuId] = item.seckillPrice;
        stocks[item.skuId] = item.currentStock;
      });
      return {
        prices,
        stocks,
      };
    },

    // 格式化处理公众号涨粉活动数据
    formatFansBenefit(fansBenefit = {}) {
      let content;
      const { preferentialType, description = '' } = fansBenefit;
      // 粉丝专享
      if (preferentialType === 1) {
        content = description.replace(/\d+(\.\d+)?\S*$/, function(reText) {
          return `<span class="fans-benefit__text-red">${reText}</span>`;
        });
      // 首次关注有礼
      } else if (preferentialType === 2) {
        content = description.replace(/^(\S)(\S+)$/, `$1<span class="fans-benefit__text-red">$2</span>`);
      }
      return {
        content,
        ...fansBenefit,
      };
    },
  },
};
