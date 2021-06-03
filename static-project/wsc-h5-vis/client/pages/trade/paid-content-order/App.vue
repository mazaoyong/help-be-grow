<template>
  <div
    v-if="errorDesc"
    class="no-course"
  >
    <vis-no-course :desc="errorDesc">
      <a
        class="btn btn-goShop"
        @click="onGoShop"
      >
        进店逛逛
      </a>
    </vis-no-course>
  </div>
  <div
    v-else
    v-show="isInited"
  >
    <!-- 商品信息 -->
    <detail
      :detail="detail"
      :type="$params.type"
      :activity-tag="activityTag"
      :count="count"
      :points-info="pointsPrice > 0 ? pointsInfo : null"
    />

    <!-- 满减条 -->
    <promotion-section
      v-if="showPromotionBanner"
      :promotion-info="promotionInfo"
    />

    <!-- 优惠券 -->
    <coupon
      v-if="showCoupon"
      :coupon-list="couponList"
      :disabled-coupon-list="disabledCouponList"
      :chosen-coupon="chosenCoupon"
      @exchange="onExchangeCoupon"
      @change="onChange"
    />

    <!-- 积分活动 -->
    <points
      v-if="shouldUsePoints"
      :points-price="pointsPrice"
      :user-points="userPoints"
    />

    <!-- 储值卡 -->
    <pre-pay-card
      v-if="isShowPrePayCard"
      :gift-card="giftCard"
      :value-card="valueCard"
      :price="originPrice"
      :count="count"
      @updateSelectedPrePayCard="updateSelectedPrePayCard"
    />

    <!-- 信息收集 -->
    <info-collector
      v-if="collectInfoSetting && collectInfoSetting.customizeItems.length > 0"
      :info-collection-items="collectInfoSetting.customizeItems"
      :info-collect-dto="collectInfoDTO"
      @submit="handleSubmitCollectInfo"
    />

    <!-- 价格 -->
    <price
      :origin-price="originPrice"
      :discout-price="discoutPrice"
      :count="count"
      :use-points="shouldUsePoints"
      :points-info="pointsInfo"
    />

    <div>
      <a
        class="content-tip"
        href="//h5.youzan.com/wscvis/edu/attentions-in-purchase"
      >
        <img
          src="//img01.yzcdn.cn/publicPath/2019/07/17/warn.png"
          alt="注意"
        >
        购买须知
      </a>
    </div>

    <!-- 支付按钮 -->
    <action
      :alias="$params.alias"
      :type="$params.type"
      :kdt-id="$params.kdt_id"
      @pay="onPayProxy"
    />

    <!-- // 知识付费&教育屏蔽有赞担保 -->
    <!-- <tip
      :is-secured-transactions="isSecuredTransactions"
      :is-y-z-guarantee="isYZGuarantee"
    /> -->

    <pay
      v-model="showPayview"
      :loading-pay-way="loadingPayWay"
      :show-password="showPassword"
      :pay-ways="payWays"
      :on-pay-way-selected="onPayWaySelected"
      @update:show-password="onShowPassword"
    />
  </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty';
import { get as lodashGet } from 'lodash';
import difference from 'lodash/difference';

import { Dialog, Toast } from 'vant';
import { Pay, PayManager } from 'captain-ui';
import toSnakeCase from 'zan-utils/string/toSnakeCase';
import mapKeysToCamelCase from 'zan-utils/string/mapKeysToCamelCase';
import cookie from 'zan-utils/browser/cookie';
import Args from 'zan-utils/url/args';
import { ZNB } from '@youzan/wxsdk';
import * as SafeLink from '@youzan/safe-link';
import buildUrl from '@youzan/utils/url/buildUrl';

import { navigateEnv } from 'common/utils/env';
import { getUAKeyword, get } from 'common/utils/helper';
import mixinVisPage from 'common/mixins/mixin-vis-page';
import mixinActivity from 'pct/mixins/mixin-activity';
import {
  SECURITY_STATUS,
  YZ_GUARANTEE_STATUS,
  GIFT_CARD,
  COLLECT_INFO_KEYS,
} from './constants';

import Action from './components/Action';
import Detail from './components/Detail';
// import Tip from './components/Tip';
import Coupon from './components/Coupon';
import Price from './components/Price';
import Points from './components/Points';
import PromotionSection from './components/Promotion';
import InfoCollector from 'components/info-collector';
import PrePayCard from './components/PrePayCard';
import NoCourse from '../../edu/components/no-course';
import Api from './api';
import {
  getSchemePromise,
  parsePrePayCardInfo,
  disPatchSelectedCardAction,
  formatOrderParams,
  getGotoUrl,
  customizePostDataAdaptor,
} from './utils';

const global = window._global;

export default {
  name: 'app',

  components: {
    Detail,
    Action,
    // Tip,
    Coupon,
    Price,
    Points,
    PromotionSection,
    Pay,
    InfoCollector,
    PrePayCard,
    'vis-no-course': NoCourse,
  },

  mixins: [mixinVisPage, mixinActivity],

  params: {
    alias: String,
    // 购买商品类型
    type: String,
    kdt_id: String,
    dc_ps: String,
    live_id: String,
    qr: String,
    // 购买商品数量
    count: String,
    // 购买渠道
    channel_type: String,
    group_alias: String,
    promotion_type: String,
    promotion_id: String,
    bid: String,
    aid: String,
    fid: String,
  },

  provide: {
    pointsName: global.visPointsName || '积分',
  },

  data() {
    return {
      isInited: false,
      isPaying: false,
      // 原价
      originPrice: 0,
      // 打折价
      discoutPrice: 0,
      // 回调链接
      returnUrl: '',
      // 商品信息
      detail: {},

      // 展示支付面板
      showPayview: false,
      // 展示密码
      showPassword: false,
      // 支付方式
      loadingPayWay: {},
      // 支付方式
      payWays: [],

      // 积分价格
      pointsPrice: +Args.get('points_price') || 0,
      userPoints: global.userPoints || 0,

      // 是否展示优惠券
      showCoupon: false,
      // 选择的优惠券 index
      chosenCoupon: -1,
      // 优惠券列表
      couponList: [],
      // 不可用优惠券列表
      disabledCouponList: [],

      // 是不是拼团
      isGroupon: false,
      // 满减活动信息
      meetReduce: {},
      // 预订单信息
      preOrderInfo: {},
      // 活动标签，展示在内容简介
      activityTag: '',
      // 是否是请好友看
      isInviteFriend: false,

      // 信息收集设置
      collectInfoSetting: null,
      collectInfoDTO: null,
      // 预填信息
      buyerInfo: {},
      // 订单信息缓存
      orderInfo: {},

      // 店铺开通有赞认证
      isYZGuarantee: window._global['is_yz_guarantee'] === YZ_GUARANTEE_STATUS.GUARANTEE,
      // 店铺开通安全交易
      isSecuredTransactions: window._global['is_secured_transactions'] === SECURITY_STATUS.SECURE,

      // 支付组件
      payManager: null,
      // 缓存信息采集数据
      prevCollectedData: null,

      // 小程序 webview 下单需要用到
      isWeapp: _global.miniprogram && _global.miniprogram.isWeapp,
      appId: cookie('appId') || 0,
      openId: cookie('openId') || 0,

      isShowPrePayCard: false, // 是否显示礼品卡 / 储值卡入口
      giftCard: {}, // 礼品卡
      valueCard: {}, // 储值卡

      errorDesc: '',
    };
  },

  computed: {
    count() {
      const count = this.$params.count || 1;
      return parseInt(count, 10);
    },
    showPromotionBanner() {
      let promotionInfo = this.promotionInfo;
      // 积分兑换不显示赠品栏
      if (this.shouldUsePoints) {
        promotionInfo = this.promotionInfo.filter(item => {
          return item.tags !== '赠品';
        });
      }
      return promotionInfo.length > 0;
    },
    // 拼接collectInfoSetting 和 buyerinfo
    infoDefine() {
      if (!this.collectInfoSetting) return null;
      const infoDefine = {};
      Object.keys(this.collectInfoSetting).forEach(key => {
        if (COLLECT_INFO_KEYS.indexOf(key) >= 0 && this.collectInfoSetting[key]) {
          infoDefine[key] = this.buyerInfo[key] || '';
        }
      });
      return infoDefine;
    },
    // 是否使用积分
    shouldUsePoints() {
      return !!this.pointsPrice;
    },
  },

  created() {
    // 获取商品信息
    this.fetchDetailInfo()
      .then(_ => {
        // WARNING !!!!
        // TODO: 这个接口在infoCollector组件内部做了，需要后续下单页需要清除！！！
        this.$nextTick(() => {
          // 没有数据采集需求的，不查询预填信息
          if (this.infoDefine) {
            this.fetchBuyerInfo();
          }
        });
        // WARNING !!!

        // 获取预下单信息
        return this.fetchPreOrderProxy();
      })
      .then(_ => {
        // 设置回调链接
        this.returnUrl = this.getReturnUrl();
        this.isInited = true;
      });
    // 秒杀活动下单时不去查询其他活动
    +this.$params.promotion_type !== 6 && this.fetchActivities();
  },

  methods: {
    onGoShop() {
      navigateEnv();
    },

    handleSubmitCollectInfo(values) {
      if (!this.collectInfoDTO) {
        this.collectInfoDTO = {};
      }
      this.collectInfoDTO.customizeItems = customizePostDataAdaptor(
        lodashGet(this, 'collectInfoSetting.customizeItems'),
        values,
      );
    },
    fetchDetailInfo() {
      const { type } = this.$params;
      const funcEnum = {
        'column': Api.getColumn,
        'content': Api.getContent,
        'live': Api.getLiveDetail,
        'punch': Api.getPunchDetail,
      };
      const fetchFunc = funcEnum[type];

      // 获取专栏或内容信息
      return fetchFunc({
        alias: this.$params.alias,
        live_id: this.$params.live_id,
      })
        .then(data => {
          this.detail = data;
          if (!lodashGet(data, 'collectInfoSetting.customizeItems')) {
            return;
          }
          // 信息采集
          this.collectInfoSetting = data.collectInfoSetting;
        })
        .catch(errMsg => {
          Dialog.alert({
            message: errMsg,
          });
        });
    },

    fetchActivities() {
      this.fetchNewActivities()
        .then(data => {
          data.forEach(item => {
            switch (item.type) {
              case 'meetReduce':
                this.parsePromotionInfo(item);
                break;
              case 'pointsGoods':
                this.showPoints = true;
                this.pointsInfo = item.data;
                if (this.pointsPrice) {
                  this.pointsPrice = lodashGet(this.pointsInfo, 'pointsPrice', this.pointsPrice);
                }
                this.checkPointsEnough();
                break;
              default:
                break;
            }
          });
        });
    },

    // 代理原有preOrder方法
    fetchPreOrderProxy() {
      getSchemePromise
        .then(() => {
          this.fetchPreOrder();
        })
        .catch(() => {
          console.warn('[preOrder]: scheme获取失败');
        });
    },

    fetchPreOrder() {
      const params = formatOrderParams(this.getOrderParams());
      Api.postPreorder(params)
        .then(data => {
          this.preOrderInfo = data;
          // 是否为请好友看
          this.isInviteFriend = this.preOrderInfo.activity_type === 14;
          this.originPrice = this.isInviteFriend
            ? this.preOrderInfo.order_items[0].pay_price
            : this.preOrderInfo.order_payment.real_pay;
          this.detail.price = this.originPrice;
          // 是不是拼团
          this.isGroupon = this.preOrderInfo.activity_type === 4;

          // 设置下单页价格标签
          // 是否设置了团长优惠
          const checkHeadDiscount =
            this.preOrderInfo.activities &&
            this.preOrderInfo.activities[0].type === 'groupOnHeaderDiscount';
          if (
            this.preOrderInfo.group &&
            this.preOrderInfo.group.header &&
            checkHeadDiscount
          ) {
            this.activityTag = '团长价';
          } else if (
            this.preOrderInfo.activity_type === 1 &&
            this.preOrderInfo.order_items &&
            this.preOrderInfo.order_items[0] &&
            this.preOrderInfo.order_items[0].activity_type === 10
          ) {
            this.activityTag = '会员折扣';
          }

          if (!this.preOrderInfo.forbid_coupon && this.originPrice !== 0) {
            this.showCoupon = true;
            this.couponList = this.preOrderInfo.coupons || [];
            this.disabledCouponList = this.preOrderInfo.unavailable_coupons || [];

            if (this.couponList.length > 0) {
              this.chosenCoupon = 0;
              this.discoutPrice = this.couponList[this.chosenCoupon].value;
            } else {
              this.chosenCoupon = -1;
            }
          }

          this.handlePayPrice(data);
          // 增加储值卡逻辑
          this.setPrePayCard(data);
        })
        .catch(errMsg => {
          if (errMsg.indexOf && errMsg.indexOf('积分兑换活动已失效') > -1) { // 暂时这样写
            this.errorDesc = '积分活动已失效<br>买点其他东西犒劳下自己吧';
            return;
          }
          this.showCashierResult(errMsg);
        });
    },

    handlePayPrice(data) {
      const {
        pay_gift_cards: payGiftCards = [],
        pay_value_cards: payValueCards = [],
      } = data;
      let surplusAmount = Number(this.originPrice * this.count); // 剩余需要支付的金额
      if (this.discoutPrice) {
        this.$store.dispatch('updateCouponPrice', this.discoutPrice);
      }
      if (surplusAmount <= this.discoutPrice) { // 优惠的金额已经大于总价
        return;
      } else {
        surplusAmount = surplusAmount - this.discoutPrice;
      }

      if (payGiftCards.length > 0) { // 礼品卡
        disPatchSelectedCardAction(this.$store, mapKeysToCamelCase(payGiftCards), surplusAmount, 'giftCard');
      }

      if (payValueCards.length > 0) { // 储值卡
        disPatchSelectedCardAction(this.$store, mapKeysToCamelCase(payValueCards), surplusAmount, 'valueCard');
      }
    },

    setPrePayCard(data) {
      const {
        pay_gift_cards: payGiftCards = [],
        pay_value_cards: payValueCards = [],
        unavailable_pay_gift_cards: unavailablePayGiftCards = [],
        unavailable_pay_value_cards: unavailablePayValueCards = [],
        show_pre_pay_cards: showPrePayCards = false,
      } = data;
      const { giftCard, valueCard } = parsePrePayCardInfo(
        mapKeysToCamelCase(payGiftCards),
        mapKeysToCamelCase(payValueCards),
        mapKeysToCamelCase(unavailablePayGiftCards),
        mapKeysToCamelCase(unavailablePayValueCards),
      );
      this.giftCard = mapKeysToCamelCase(giftCard);
      this.valueCard = mapKeysToCamelCase(valueCard);
      this.isShowPrePayCard = Boolean(showPrePayCards);
    },

    /**
     * 获取预填信息
     */
    fetchBuyerInfo() {
      Api.getBuyerInfo({})
        .then(data => {
          this.buyerInfo = data;
        })
        .catch(errMsg => {
          console.warn('getBuyerInfo', errMsg);
        });
    },

    fetchExchangeCode(params) {
      return Api.exchangeCode(params)
        .catch(errMsg => {
          Dialog.alert({
            message: errMsg,
          });
        });
    },

    /*
    * 处理交易url，收银台url全部切换为新连接,监控老连接
    */
    getPayApiAddress(prepay) {
      if (prepay) {
        return {
          cashierRequestUrl: this.isWeapp ? '/wsctrade/pay/wscweapp/payChannels.json' : '/wsctrade/pay/wsc/payChannels.json',
          payRequestUrl: this.isWeapp ? '/wsctrade/pay/wscweapp/pay.json' : '/wsctrade/pay/wsc/pay.json',
        };
      }
      // 兜底非预下单情况，暂不删除
      const prefix = `/v2/pay/${prepay ? 'Preorder' : 'UnifiedCashier'}/`;
      return {
        cashierRequestUrl: prefix + (prepay ? 'query' : 'paytype') + '.json',
        payRequestUrl: prefix + (prepay ? 'pay' : 'dispatcherPay') + '.json',
      };
    },

    getPayParams(data) {
      const param = {};
      for (const key in data) {
        param[toSnakeCase(key)] = data[key];
      }

      return param;
    },

    getReturnUrl() {
      const { type, alias } = this.$params;
      if (type === 'punch') { // 如果是群打卡，直接跳群打卡页面
        const params = {
          'kdt_id': Number(global['kdt_id']) || 0,
          'alias': alias,
        };
        const punchUrl = Args.add(`${get(window, '_global.url.h5')}/wscvis/supv/punch/introduction`, params);
        return punchUrl;
      }
      const orderNo = lodashGet(this, 'orderInfo.tradeCreateResponse.orderResultDTOGroup[0].orderNo', '');
      if (this.isGroupon) {
        return `${window._global.url.h5}/wscvis/knowledge/index?kdt_id=${this.$params.kdt_id}&p=grouponinvitation&${orderNo ? `order_no=${orderNo}` : 'order_no={orderNo}'}&alias=${this.$params.alias}`;
      } else {
        // 如果购买了专栏、内容或直播，统一跳转到统一落地页
        return buildUrl(
          `https://h5.youzan.com/wscvis/order/paid-status?kdt_id=${this.$params.kdt_id}&${orderNo ? `orderNo=${orderNo}` : 'orderNo={orderNo}'}`,
          '',
          this.$params.kdt_id
        );
      }
    },

    getOrderParams() {
      return {
        kdt_id: this.$params.kdt_id,
        type: this.$params.type,
        alias: get(this.detail, 'alias', '') || this.$params.alias,
        dc_ps: this.$params.dc_ps,
        qr: this.$params.qr,
        url: this.returnUrl,
        num: this.count,
        channel_type: this.$params.channel_type,
        group_alias: this.$params.group_alias,
        promotion_type: this.$params.promotion_type,
        promotion_id: this.$params.promotion_id,
        recommend_buyer_id: this.$params.bid,
        recommend_activity_id: this.$params.aid,
        recommend_fans_id: this.$params.fid,
        outer_user_id: get(global, 'visBuyer.platform.platform_user_id', ''),
        orderMark: this.isWeapp ? 'wx_shop' : '',
        pointsPrice: this.pointsPrice, // 传入积分数，表示使用积分兑换
        ...this.getAppSchemeParam(),
      };
    },

    /**
     * 获取收集的信息
     */
    getCollectData() {
      return new Promise((resolve, reject) => {
        const { infoCollector } = this.$refs;
        if (!infoCollector || isEmpty(this.infoDefine)) resolve();
        infoCollector.save()
          .then(data => {
            resolve(data);
          })
          .catch(err => {
            this.isPaying = false;
            console.log('[collectData warning]', err);
          });
      });
    },

    startPay(orderResponse) {
      if (!orderResponse) return;

      const data = orderResponse.tradeCreateResponse;
      const { prePaymentPreparationDTO, preparePayResultDTO } = data;
      const { prepay } = prePaymentPreparationDTO;
      const payApi = this.getPayApiAddress(prepay);
      let params = prepay ? this.getPayParams(prePaymentPreparationDTO) : preparePayResultDTO;
      Object.assign(params, { scene: 'VALUE_COMMON' });

      this.payManager = new PayManager({
        ...payApi,
        fail: this.onPayFail,
      });
      this.payManager.createCashierOrder(params, () => {
        this.payWays = this.payManager.getPayWays();
        if (!this.payWays || this.payWays.length === 0) {
          Toast('支付方式列表为空');
        } else {
          this.showPayview = true;
        }
      });
    },

    showCashierResult(msg) {
      Dialog.alert({
        message: `<div class='paid-content__dialog--no-title'>${
          msg
        }</div>`,
        confirmButtonText: '确定',
      });
    },

    checkPointsEnough() {
      // 检查积分状态
      if (this.shouldUsePoints) {
        const userPoints = global.userPoints || 0;
        if (userPoints < this.pointsInfo.pointsPrice) {
          Dialog.alert({
            message: `积分不足，请返回重新下单。（当前积分余额：${userPoints}）`,
            confirmButtonText: '返回',
          }).then(() => {
            window.history.go(-1);
          });
          return false;
        }
      }
      return true;
    },

    // 代理原有onPay方法
    onPayProxy() {
      getSchemePromise
        .then(() => {
          this.onPay();
        })
        .catch(() => {
          console.warn('[startOrder]: scheme获取失败');
        });
    },

    /**
     * 生成交易订单
     */
    onPay() {
      const hasInfoCollect = get(this.collectInfoSetting, 'customizeItems.length', 0) > 0;
      if (
        hasInfoCollect &&
        (this.collectInfoDTO === null || isEmpty(this.collectInfoDTO))
      ) {
        Toast.fail('请检查信息填写是否有误');
        return;
      }
      if (this.isPaying) return;
      if (!this.checkPointsEnough()) return;

      if (this.shouldUsePoints) {
        if (this.pointsInfo.quotaUsed >= this.pointsInfo.quotaNum) {
          Toast(`限购${this.pointsInfo.quotaNum}件，你已兑换${this.pointsInfo.quotaUsed}件`);
          return;
        }
      }

      this.isPaying = true;

      window.scrollTo(0, 0);
      const orderParams = this.getOrderParams();
      // 设置优惠券
      orderParams.coupon_id = this.chosenCoupon === -1 ? 0 : this.couponList[this.chosenCoupon].id;
      orderParams.coupon_type = this.chosenCoupon === -1 ? '' : this.couponList[this.chosenCoupon].type;
      orderParams.pay_asset = JSON.stringify({
        giftCardNos: this.$store.getters['giftCardNos'] || [],
        kdtId: Number(global['kdt_id']) || 0,
        valueCardNos: this.$store.getters['valueCardNos'] || [],
      });

      // 下单打点
      if (window.yzlogInstance) {
        try {
          const globalParams = window.yzlogInstance.getGlobal();
          const analytics = {
            ...get(globalParams, 'context'),
            ...get(globalParams, 'plat'),
            uuid: get(globalParams, 'user.uuid'),
            platform: 'h5',
            biz: 'wsc',
            client: getUAKeyword(['micromessenger', 'youzan', 'kdtunion']),
          };
          orderParams.biz_trace_point_ext = JSON.stringify({
            ...analytics,
            dc_ps: orderParams.dc_ps || analytics.dc_ps,
            qr: orderParams.qr || analytics.qr,
          });
        } catch (err) {
          console.warn('order log error', err);
        }
      }

      Promise.resolve(this.collectInfoDTO)
        .then(collectedData => {
          let hasChanged = false;
          if (collectedData) {
            orderParams.buyer_info = collectedData || {};

            if (this.prevCollectedData) {
              hasChanged = difference(this.prevCollectedData, collectedData.customizeItems).length > 0;
            }
            this.prevCollectedData = [].concat(collectedData.customizeItems);
          }

          if (!isEmpty(this.orderInfo) && !hasChanged) {
            this.startPay(this.orderInfo);
            return Promise.reject({
              notRealPromiseException: true,
            });
          }
        })
        // 生成订单
        .then(() => {
          // 增加信息采集log来尝试排查信息采集丢失问题
          try {
            if (this.collectInfoSetting && isEmpty(orderParams.buyer_info)) {
              Api.postSkynetJson({
                log: {
                  key: 'pct-collect-info-log',
                  alias: this.$params.alias,
                  hasError: !isEmpty(this.infoDefine) && isEmpty(orderParams.buyer_info),
                  infoDefine: this.infoDefine,
                  collectInfoSetting: this.collectInfoSetting,
                  collectedData: orderParams.buyer_info,
                  user: window._global.visBuyer,
                  uaInfo: navigator.userAgent,
                },
              });
            }
          } catch (err) {}
          const params = formatOrderParams(orderParams);
          return Api.postSubscribe(params);
        })
        // 下单埋点
        .then(orderResponse => {
          try {
            const orderResult = orderResponse.tradeCreateResponse.orderResultDTOGroup;
            window.yzlogInstance && window.yzlogInstance.log({
              et: 'custom',
              ei: 'orderCreate',
              en: '创建订单',
              params: {
                order_no: (orderResult && orderResult[0]).orderNo || '',
              },
            });
          } catch (error) {
            Dialog.alert({
              message: error,
            });
            console.warn('orderCreate Log ERROR', error);
          }
          return orderResponse;
        })
        // 内容/专栏使用优惠券后价格为0，不走收银台，直接跳转到内容/专栏详情页
        .then(orderResponse => {
          if (!orderResponse) {
            return;
          }
          if (orderResponse.tradeCreateResponse.zeroOrder || orderResponse.tradeCreateResponse.showPayResult) {
            Toast('购买成功');
            // 如果是拼团，跳转到拼团分享页面
            if (this.isGroupon) {
              SafeLink.redirect({
                url: orderResponse.tradeCreateResponse.preparePayResultDTO.partnerReturnUrl,
              });
            } else {
              const url = getGotoUrl({
                type: orderParams.type,
                channelType: orderParams.channel_type,
                alias: orderParams.alias,
                kdtId: orderParams.kdt_id,
                isFromPay: true,
              }, orderResponse);
              SafeLink.redirect({
                url: Args.add(url, { isFromPay: true }),
              });
            }
            return false;
          }
          // 缓存订单信息，防止重复下单
          this.orderInfo = orderResponse;
          return orderResponse;
        })
        // 发起支付流程
        .then(this.startPay)
        .catch(error => {
          console.log('error: ', error);
          this.isPaying = false;

          if (error.notRealPromiseException) {
            return;
          }
          if (error.message || error) {
            const err = error.message || error;
            if (err.indexOf && err.indexOf('积分兑换活动已失效') > -1) {
              this.errorDesc = '积分活动已失效<br>买点其他东西犒劳下自己吧';
              return;
            }
            this.showCashierResult(err);
          }
        })
        .finally(_ => {
          this.isPaying = false;
        });
    },

    onPayWaySelected(data) {
      this.loadingPayWay = data.payWay;
      const returnUrl = this.getReturnUrl();

      if (this.isWeapp) {
        if (data.payWay.pay_channel === 'ECARD') {
          this.payManager.cashierOrderManager.payRequestUrl = '/wsctrade/pay/wsc/pay.json';
          this.payManager.doPayAction(data, () => {
            this.loadingPayWay = {};
          });
          return;
        }

        const outBizCtxData = {
          appId: this.appId,
          wxSubOpenId: this.openId,
        };
        const outBizCtx = JSON.stringify(outBizCtxData);
        this.payManager.doPayActionAllowCancel(Object.assign({}, data, { outBizCtx }), resp => {
          const payData = mapKeysToCamelCase((resp && resp.pay_data) || {});
          this.loadingPayWay = {};
          if (data.payWay.pay_channel === 'WX_APPLET') {
            payData.pageType = this.$params.type;
            payData.goToResult = true;
            payData.weappReturnUrl = `/packages/edu/webview/index?targetUrl=${encodeURIComponent(returnUrl)}`;
            ZNB.navigate({
              weappUrl: Args.add('/packages/pay/wx-request/index', payData),
            });
          } else if (data.payWay.pay_channel === 'BANK_CARD') {
            const { submit_url: submitUrl = '', submit_data: submitData } = (resp && resp.pay_data) || {};
            const _submitData = Object.assign({}, submitData, { is_from_weappwv: true });
            const viewUrl = Args.add(submitUrl, _submitData);
            ZNB.navigate({
              weappUrl: `/packages/pay/credit-card/index?viewUrl=${encodeURIComponent(viewUrl)}`,
            });
          } else {
            // 其他，如E卡等，支付成功跳转成功页
            SafeLink.redirect({
              url: returnUrl,
            });
          }
          return false;
        });
      } else {
        // 礼品卡用e卡形式支付
        if (data.payWay.pay_channel === GIFT_CARD) {
          this.payManager.cashierOrderManager.doPayAction(data, payData => {
            this.payManager._doPayWithChannel('ECARD', payData);
            this.loadingPayWay = {};
          });
        } else {
          this.payManager.doPayAction(data, () => {
            this.loadingPayWay = {};
          });
        }
      }
    },

    onPayFail(err) {
      this.loadingPayWay = {};
      const resp = err.resp || {};
      switch (resp.code) {
        // 需要密码
        case 117799001:
        case 117799511:
        case 117700511:
          this.showPassword = true;
          break;
        // 密码错误
        case 117799801:
        case 117701503:
          this.showPassword = true;
          Toast(err.message || '密码错误');
          break;
        default:
          Toast(err.message || '支付失败，请稍候再试');
          break;
      }
    },

    onChange(index) {
      this.chosenCoupon = index;
      this.discoutPrice = index === -1 ? 0 : this.couponList[this.chosenCoupon].value;
      this.$store.dispatch('updateCouponPrice', this.discoutPrice);
      this.updatePrePayCardPrice(); // 修改了优惠券，会影响储值卡选中的金额的变化
    },

    /**
     * 兑换优惠码
     */
    onExchangeCoupon(code) {
      code = code.replace(/\s/g, '');
      const params = {
        code: code,
        source: global.source,
      };
      this.fetchExchangeCode(params)
        .then(this.fetchPreOrderProxy);
    },

    // 更新选择的储值卡信息
    updateSelectedPrePayCard(cardInfo) {
      cardInfo = mapKeysToCamelCase(cardInfo);
      const cardType = cardInfo.cardType;
      const summaryCardNo = cardInfo.card.summaryCardNo;
      // 更新金额
      let surplusAmount = Number(this.originPrice * this.count); // 剩余需要支付的金额
      const usedCouponPrice = this.$store.getters['usedCouponPrice'] || 0;
      surplusAmount = surplusAmount - usedCouponPrice;

      if (cardType === 'giftCard') {
        this.giftCard.list = this.giftCard.list.map(item => {
          item.selected = summaryCardNo === item.summaryCardNo ? !item.selected : item.selected;
          return item;
        });
        this.valueCard.list = this.valueCard.list.map(item => {
          item.selected = false;
          return item;
        });

        disPatchSelectedCardAction(this.$store, this.giftCard.list, surplusAmount, 'giftCard');
      } else {
        this.giftCard.list = this.giftCard.list.map(item => {
          item.selected = false;
          return item;
        });
        this.valueCard.list = this.valueCard.list.map(item => {
          item.selected = summaryCardNo === item.summaryCardNo ? !item.selected : item.selected;
          return item;
        });

        disPatchSelectedCardAction(this.$store, this.valueCard.list, surplusAmount, 'valueCard');
      }
      this.giftCard.checked = this.$store.getters['giftCardNos'] || [];
      this.valueCard.checked = this.$store.getters['valueCardNos'] || [];
    },
    // 修改优惠券的时候, 更新储值卡/礼品卡的金额
    updatePrePayCardPrice() {
      let surplusAmount = Number(this.originPrice * this.count); // 剩余需要支付的金额
      const usedCouponPrice = this.$store.getters['usedCouponPrice'] || 0;
      surplusAmount = surplusAmount - usedCouponPrice;

      const cardType = this.giftCard.list.filter(item => item.selected).length > 0 ? 'giftCard' : 'valueCard';
      disPatchSelectedCardAction(this.$store, this[cardType].list, surplusAmount, cardType);
    },

    onShowPassword(val) {
      this.showPassword = val;
    },

    // 获取app scheme
    getAppSchemeParam() {
      const scheme = global.pctAppSdkScheme;
      return scheme ? {
        app_scheme: scheme,
        need_app_redirect: true,
      } : {};
    },
  },
};
</script>

<style lang="scss">
.paid-content__dialog--no-title {
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
}

.van-toast-fade-enter,
.van-toast-fade-leave-to {
  opacity: 1 !important;
}

.content-tip {
  display: inline-block;
  margin: 10px 15px;
  font-size: 12px;
  line-height: 17px;
  color: #9b9b9b;
  vertical-align: middle;
  cursor: pointer;

  img {
    display: inline-block;
    float: left;
    width: 12px;
    height: 12px;
    margin-top: 2px;
    margin-right: 4px;
    vertical-align: middle;
  }
}

.van-modal {
  transition: all .3s ease !important;
}

.van-button--default:active {
  color: #0c0;
  background-color: transparent;
  border-color: transparent;

  &::before,
  &::after {
    background-color: transparent;
  }
}

.van-dialog__content {
  text-align: center;
}

.no-course {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .btn {
    padding: 7px 22px;
    font-size: 14px;
    line-height: 16px;
    text-align: center;
    border: 1px solid #666;
    border-radius: 22px;
  }

  .btn-goShop {
    display: inline-block;
    margin-bottom: 54px;
    color: #f44;
    border: 1px solid #f44;
  }
}
</style>
