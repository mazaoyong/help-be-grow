/**
 * @author 云舒
 * 该mixin主要是把唤起sku相关的方法，和从详情页或者活动页面去下单的逻辑抽离出来，方便复用
 * 目前有引用的页面有：课程商品详情页，拼团详情页
 * 几个参数说明：type：0->直接购买，1->拼团购买， 2->好友助力， 3->限时折扣， 4->秒杀
 */

import { Toast } from 'vant';
import UA from 'zan-utils/browser/ua_browser';
import format from 'date-fns/format';
import mapKeysToSnakeCase from 'zan-utils/string/mapKeysToSnakeCase';
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import map from 'lodash/map';
import Args from '@youzan/utils/url/args';
import * as SafeLink from '@youzan/safe-link';
import * as BuyApi from '@/common-api/buy';
import accountUnion from 'common/utils/account-union';
import checkFansBuy from '@/common/utils/checkFansBuy';
import { checkAndLogin } from '@/common/utils/login';
import showSkuModal from '../prod-detail/container/sku-modal';
import { includes, get } from 'lodash';
// import Api from '../api';
import '../prod-detail/event-bus';
import API from '../api';
import { parseURL } from '../utils';

export default {
  data() {
    return {
      skuModel: {},
      skuId: 0,
      grouponSkuId: 0,
      collectSkuId: 0,
      activityType: '',
      cache: {},
      referralData: {},
      promotionInfo: [],
      presentGoodList: [],
      isShowSkuPromotionPop: false,

      selectedSkuType: 0, // 选择的 sku 类型
      scale: null, // 阶梯团当前选择阶梯
    };
  },

  created() {
    this.initEvent();
  },

  methods: {

    initEvent() {
      this.$bus.$on('updateScale', scale => {
        this.scale = scale;
      });
      this.$bus.$on('updateSkuId', (skuId, type) => {
        if (type === 0) {
          this.skuId = skuId;
        } else if (type === 1 || type === 3 || type === 4 || type === 5) {
          this.grouponSkuId = skuId;
        } else if (type === 2) {
          this.collectSkuId = skuId;
        }
      });
      this.$bus.$on('updateSkuInfo', (obj) => {
        this.chooseContent = obj.skuInfo || this.cache.chooseContent;
        this.chooseText = obj.skuInfo && this.cache.chooseText
          ? '已选'
          : this.cache.chooseText;
        this.chooseStockText = obj.stock ? `（剩余${obj.stock}名）` : '';
        this.cache.priceStr = obj.price || '';
        this.pointsPrice = obj.pointsPrice || '';
      });
      this.$bus.$on('updateSelectedSku', (selectedSku, type) => {
        if (type === 0) {
          this.cache.selectedSku = selectedSku;
        } else if (type === 1) {
          this.cache.selectedGrouponSku = selectedSku;
        } else if (type === 2) {
          this.cache.selectedCollectSku = selectedSku;
        } else if (type === 4) {
          this.cache.selectedSeckillSku = selectedSku;
        } else if (type === 5) {
          this.cache.selectedPointsSku = selectedSku;
        }

        this.selectedSkuType = type;
      });
      this.$bus.$on('toPay', (type, forcePay, groupAlias) => {
        this.toPay(type, forcePay, groupAlias);
      });
      this.$bus.$on('showSkuPromotionPop', presentGoodList => {
        this.presentGoodList = presentGoodList;
        this.isShowSkuPromotionPop = true;
      });
    },

    // 点击底部按钮
    toPay(type, forcePay = false, groupAlias) {
      if (!UA.isMobile()) {
        Toast('预览不支持进行购买，实际效果请在手机上进行。');
        return;
      }

      this.beforePay(type)
        .then(({ didLogin = false } = {}) => this.pay(type, didLogin, forcePay, groupAlias));
    },

    beforePay(type) {
      // 知识付费购买时先判断 acl 的场景值 是否需要手机号登录/微信授权
      // 查询店铺是否设置了购物门槛
      // 好友助力不需要
      if (+type === 2) {
        return Promise.resolve();
      } else {
        return accountUnion.checkUnion('paidcontent', {})
          // !!! productId 从页面组件的 cache 属性获取
          .then(({ didLogin = false }) => checkFansBuy({ didLogin, productId: this.cache && this.cache.productId }));
      }
    },

    /**
     * 支付或弹出sku面板
     *
     * @param {boolean} forcePay 直接跳转至下单页
     */
    pay(type, didLogin, forcePay = false, groupAlias) {
      if (type === 5 && this.pointsLimit && this.pointsUsed >= this.pointsLimit) {
        Toast(`限购${this.pointsLimit}件，你已兑换${this.pointsLimit}件`);
        return;
      }

      if ((!this.cache.sku.hasSku || forcePay) && type !== 2) {
        // 课程进行中，如果选择了某个具体的sku或无规格商品，直接跳确认订单页
        // 处理各种字段，传给下单页
        // 课程信息
        const startAt = this.cache.courseStartAt;
        const endAt = this.cache.courseEndAt;
        let url = `https://cashier.youzan.com/pay/wscvis_edu_pay?alias=${this.alias}&servicePledge=${this.servicePledge}&kdt_id=${this.kdtId}`;
        // let url = `/wscvis/edu/order-confirm?alias=${this.productAlias}&servicePledge=${this.servicePledge}&kdt_id=${this.kdtId}`;
        if (this.skuId || this.grouponSkuId) {
          const skuId = type === 0 ? this.skuId : this.grouponSkuId;
          url += `&skuId=${skuId}`;
        }
        if (startAt) {
          url += `&startAt=${startAt}`;
        }
        if (endAt) {
          url += `&endAt=${endAt}`;
        }
        if (this.storeIds) {
          const storeIds = JSON.stringify(this.storeIds) || '[]';
          url += `&storeIds=${storeIds}`;
        }
        if (this.courseType !== undefined) {
          url += `&courseType=${this.courseType}`;
        }
        // 拼团下单
        if (type === 1) {
          url += `&promotionType=${this.grouponInfo.promotionType}&promotionId=${this.grouponInfo.promotionId}&groupAlias=${groupAlias || ''}&ladderNum=${this.scale ? this.scale : ''}`;
        }

        // 限时折扣下单
        if (type === 3) {
          url += `&promotionId=${this.timelimitedDiscountInfo.activityId}`;
        }

        // 秒杀下单
        if (type === 4) {
          url += `&promotionType=6&promotionId=${this.activityInfo.activityId}`;
        }

        // 积分下单
        if (type === 5) {
          url += `&promotionType=5&promotionId=${this.activityInfo.id}&pointsPrice=${this.pointsPrice}`;
        }

        // 推荐有奖下单
        if (this.referralData.isShowReferral) {
          url += `&bid=${this.bid}&fid=${this.fid}&aid=${this.referralData.activityId}&channelType=${this.referralData.channelType}`;
        }

        if (Args.get('resourceAlias')) {
          url += `&fromType=enrollment_poster&fromId=${Args.get('resourceAlias')}`;
        }

        // @TODO gaotian
        // 下单页白名单
        Promise.resolve().then(() => {
          const product = {
            alias: this.alias,
            id: get(this, 'cache.productId') || this.productId,
            skuId: type === 0 ? this.skuId : this.grouponSkuId,
            num: 1,
            owlType: 10,
          };

          const channelType = this.referralData.isShowReferral
            ? this.referralData.channelType
            : undefined;

          const params = {
            productInfoList: [product],
            channelType,
          };

          const query = parseURL(url);
          const umpInfo = {};
          umpInfo.promotionType = query.promotionType;
          umpInfo.promotionId = query.promotionId;
          // 拼团下单
          if (type === 1 && query.groupAlias) {
            umpInfo.groupAlias = query.groupAlias;
          } else if (type === 1 && query.ladderNum) {
            umpInfo.ladderNum = query.ladderNum;
          }

          // 秒杀下单
          if (type === 4) {
            umpInfo.promotionAlias = Args.get('ump_alias') || Args.get('ump_alias_bak');
          }

          // 积分下单
          if (type === 5) {
            umpInfo.pointsExchange = {
              pointsPrice: query.pointsPrice,
              usePoints: true,
            };
          }
          // 推荐有奖
          if (this.referralData.isShowReferral) {
            umpInfo.recommend = {
              recommendActivityId: query.aid,
              recommendFansId: query.fid,
              recommendBuyerId: query.bid,
            };
          }
          params.umpInfo = umpInfo;

          const sourceInfo = Args.get('resourceAlias') ? {
            from_type: 'enrollment_poster',
            from_id: Args.get('resourceAlias'),
          } : null;
          return BuyApi.postBookKey(params).then(({ bookKey }) => {
            BuyApi.goTradeBuy({
              book_key: bookKey,
              channel_type: channelType,
              ...sourceInfo,
            });
          });
        });
      } else if (type === 2 && this.collectSkuId) { // 好友助力
        if (!didLogin) {
          setTimeout(() => {
            checkAndLogin(() => {
              this.__buildZan();
            });
          }, 500);
        } else {
          this.__buildZan();
        }
      } else { // 课程进行中， 如果没有选中具体的sku，弹起sku选择弹窗
        this.onShowSku(type, groupAlias);
      }
    },

    // 教育一期新增4中售卖类型，对 sku 需要做处理
    __formatSku(cacheSku) {
      const {
        courseSellType,
        courseType,
      } = this.cache;

      // 正式课
      if (courseType === 1) {
        // 按课时、按时段
        if (courseSellType === 1 || courseSellType === 2) {
          cacheSku.list.forEach((item, index) => {
            const sku = JSON.parse(item.sku);
            const courseSkuDesc = item.courseSkuDesc;

            if (courseSkuDesc) {
              sku[0].v = courseSkuDesc;
              item.sku = JSON.stringify(sku);
              const cacheSkuValueList = cacheSku.tree[0].v;
              const kS = cacheSku.tree[0].k_s;

              const treeValueIndex = findIndex(cacheSkuValueList, function(o) { return item[kS] === o.id; });
              treeValueIndex > -1 && (cacheSkuValueList[treeValueIndex].name = courseSkuDesc);
            }
          });
          // 按期
        } else if (courseSellType === 3) {
          cacheSku.list.forEach((item, index) => {
            const sku = JSON.parse(item.sku);
            const originSkuValue = sku[0].v;
            const courseSkuDesc = item.courseSkuDesc;
            const { startTime, endTime } = item.eduClassDTO || {};
            const timeRangeStr = `${format(+startTime, 'YYYY-MM-DD')} 至 ${format(+endTime, 'YYYY-MM-DD')}`;
            const skuValue = courseSkuDesc ? `${courseSkuDesc} ${timeRangeStr}` : `${originSkuValue} ${timeRangeStr}`;

            sku[0].v = skuValue;
            item.sku = JSON.stringify(sku);

            const cacheSkuValueList = cacheSku.tree[0].v;
            const kS = cacheSku.tree[0].k_s;
            const treeValueIndex = findIndex(cacheSkuValueList, function(o) { return item[kS] === o.id; });
            treeValueIndex > -1 && (cacheSkuValueList[treeValueIndex].name = skuValue);
          });
        }
      }
    },

    // 好友助力
    __buildZan() {
      API.buildZanSet({
        kdt_id: this.kdtId || 0,
        zanId: this.activityInfo.id || 0,
        targetAlias: this.alias || '',
        skuId: this.cache.sku.hasSku ? this.collectSkuId : 0,
      }).then(res => {
        if (res && res.data) {
          const zanAlias = res.data || '';
          if (zanAlias) {
            SafeLink.redirect({
              url: `https://h5.youzan.com/wscvis/knowledge/support-invitation?kdt_id=${this.kdtId}&zanAlias=${zanAlias}&alias=${this.alias}`,
              kdtId: window._global.kdt_id,
            });
          } else {
            Toast('生成好友助力失败，请重试');
          }
        }
      })
        .catch(err => {
          Toast('生成好友助力失败，请重试');
          console.log('err: ', err);
        });
    },

    // 弹出sku弹窗
    onShowSku(type = -1, groupAlias) {
      // 处理sku商品图片
      const imgUrl = this.cache.pictures[0].url || '';

      // 克隆一下，防止污染 cache 的原始值
      const cacheSku = cloneDeep(this.cache.sku || {});

      // 教育一期新增4中售卖类型，对 sku 需要做处理
      // 直接改变了 cacheSku 对象
      this.__formatSku(cacheSku);

      const grouponSku = cloneDeep(cacheSku);
      const collectSku = cloneDeep(cacheSku);
      const seckillSku = cloneDeep(cacheSku);
      const pointsSku = cloneDeep(cacheSku);
      // 处理商品价格
      if (type === 1 || type === 3) {
        // const grouponPrice = this.grouponPrice || {};
        const grouponPrice = (type === 1 && this.grouponPrice) ||
          (type === 3 && this.activityPrices) || {};
        const grouponSkuPrice = grouponPrice.skuPrices || [];
        if (grouponPrice.maxPrice && grouponPrice.minPrice !== grouponPrice.maxPrice) {
          const minPrice = parseFloat(grouponPrice.minPrice / 100).toFixed(2) || 0;
          const maxPrice = parseFloat(grouponPrice.maxPrice / 100).toFixed(2) || 0;
          this.priceStr = `¥${minPrice} - ${maxPrice}`;
        } else {
          this.priceStr = parseFloat(grouponPrice.price) === 0 ? '免费' : `¥${parseFloat(grouponPrice.price / 100).toFixed(2)}`;
        }
        (grouponSku.list || []).forEach(item => {
          item.price = grouponSkuPrice[item.id];
        });
      } else if (type === 2) { // 商品的某些sku没有好友助力活动，这个时候就需要将这些过滤掉
        const { skuIds } = this.activityInfo.currentCollectZanProduct;
        const originSkuIds = [];
        for (let i = 0, skuLen = collectSku.list.length; i < skuLen; i++) {
          originSkuIds.push(collectSku.list[i].id);
        }
        const diffSkuIds = originSkuIds.concat(skuIds).filter(v => !includes(originSkuIds, v) || !includes(skuIds, v));
        // 只有skuIds列表中有的，才可选，否则强制库存为0不让用户选
        collectSku.list.forEach(item => {
          diffSkuIds.map(skuId => {
            if (item.id === skuId) {
              item.stock_num = 0;
            }
          });
        });
        if (collectSku.maxPrice && collectSku.minPrice !== collectSku.maxPrice) { // 有区间价
          const minPrice = parseFloat(collectSku.minPrice / 100).toFixed(2) || 0;
          const maxPrice = parseFloat(collectSku.maxPrice / 100).toFixed(2) || 0;
          this.priceStr = `¥${minPrice} - ${maxPrice}`;
        } else {
          this.priceStr = parseFloat(collectSku.price) === 0 ? '免费' : `¥${parseFloat(collectSku.price).toFixed(2)}`;
        }
      } else if (type === 4) {
        const skuIds = map(this.activityInfo.skuInfos, item => item.skuId);
        const activityPrices = this.activityPrices;
        const originSkuIds = [];
        for (let i = 0, skuLen = seckillSku.list.length; i < skuLen; i++) {
          originSkuIds.push(seckillSku.list[i].id);
        }
        const diffSkuIds = originSkuIds.concat(skuIds).filter(v => !includes(originSkuIds, v) || !includes(skuIds, v));
        // 只有skuIds列表中有的，才可选，否则强制库存为0不让用户选
        seckillSku.list.forEach(item => {
          diffSkuIds.map(skuId => {
            if (item.id === skuId) {
              item.stock_num = 0;
            }
          });
          if (activityPrices.skuStocks[item.id]) {
            item.stock_num = activityPrices.skuStocks[item.id];
            // 按期售卖取最小库存
            if (this.cache.courseSellType === 3) {
              item.stock_num = Math.min(item.stock_num, activityPrices.skuStocks[item.id]);
            }
          }
        });
        if (activityPrices.maxPrice && activityPrices.minPrice !== activityPrices.maxPrice) { // 有区间价
          const minPrice = parseFloat(activityPrices.minPrice / 100).toFixed(2) || 0;
          const maxPrice = parseFloat(activityPrices.maxPrice / 100).toFixed(2) || 0;
          this.priceStr = `¥${minPrice} - ${maxPrice}`;
        } else {
          this.priceStr = parseFloat(activityPrices.price) === 0 ? '免费' : `¥${parseFloat(activityPrices.price / 100).toFixed(2)}`;
        }
        (seckillSku.list || []).forEach(item => {
          item.price = activityPrices.skuPrices[item.id];
        });
      } else if (type === 5) { // 积分活动
        // 将计算好的sku的价格、限兑数量和已兑数量赋给sku列表
        pointsSku.list = (pointsSku.list || []).map(item => {
          if (this.pointsSkuInfo[item.id]) {
            return {
              ...item,
              ...this.pointsSkuInfo[item.id],
            };
          }
          // 如果积分活动不包含这个sku，则置灰
          return { ...item, stock_num: 0 };
        });
      } else {
        if (cacheSku.maxPrice && cacheSku.minPrice !== cacheSku.maxPrice) { // 有区间价
          const minPrice = parseFloat(cacheSku.minPrice / 100).toFixed(2) || 0;
          const maxPrice = parseFloat(cacheSku.maxPrice / 100).toFixed(2) || 0;
          this.priceStr = `¥${minPrice} - ${maxPrice}`;
        } else {
          this.priceStr = parseFloat(cacheSku.price) === 0 ? '免费' : `¥${parseFloat(cacheSku.price).toFixed(2)}`;
        }
      }

      // 处理库存数量
      let stock = cacheSku.restStock || '';

      if (type === 4) {
        stock = this.activityInfo.currentStock;
        // 按期售卖取最小库存
        if (this.cache.courseSellType === 3) {
          stock = Math.min(stock, this.activityInfo.currentStock);
        }
      }

      // 设置积分活动初始的剩余名额
      if (type === 5) {
        const {
          totalNum = 0,
          exchangedNum = 0,
        } = this.activityInfo;
        stock = exchangedNum >= totalNum ? 0 : totalNum - exchangedNum;
      }

      // 缓存选中的sku,入口不同，显示不同的选中结果 0：直接购买，1：拼团购买，2：好友助力 3:限时折扣 4:秒杀 5:积分
      const selectedSkuArr =
        [
          this.cache.selectedSku,
          this.cache.selectedGrouponSku,
          this.cache.selectedCollectSku,
          this.cache.selectedGrouponSku,
          this.cache.selectedSeckillSku,
          this.cache.selectedPointsSku,
        ];
      const selectedSku = selectedSkuArr[type];
      const skuDataArr = [cacheSku, grouponSku, collectSku, grouponSku, seckillSku, pointsSku];
      const skuData = skuDataArr[type];

      const sku = {
        kdtId: this.kdtId,
        imgUrl,
        price: this.priceStr,
        isVip: this.isVip || false,
        stock,
        storeIds: this.storeIds,
        servicePledge: this.servicePledge || 0,
        serviceMessage: this.serviceMessage || '',
        status: this.status,
        sku: skuData,
        selectedSku: selectedSku || {},
        type,
        courseType: this.courseType,
        courseActivityType: this.courseActivityType,
        courseTime: this.courseTime,
        courseSellType: this.cache.courseSellType,
        campusName: this.campusName,
        shopDetailInfo: this.shopDetailInfo,
        promotionInfo: this.promotionInfo,
        showLimit: this.showLimit,
        limit: this.limit,
        activityType: this.activityType,
        hideStock: this.cache.hideStock,
        groupAlias,
        ladderPrice: this.grouponInfo.promotionDetail && this.grouponInfo.promotionDetail.ladderPrice,
      };

      skuData.tree = mapKeysToSnakeCase(skuData.tree, true);
      skuData.list = mapKeysToSnakeCase(skuData.list, true);
      showSkuModal(sku);
    },
  },
};
