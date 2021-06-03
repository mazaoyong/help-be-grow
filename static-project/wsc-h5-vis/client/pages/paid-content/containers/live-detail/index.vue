<template>
  <div>
    <div v-if="isInited" class="live-detail">
      <template v-if="!isDeleted">
        <top-bar />
        <!-- 直播封面图 -->
        <detail-cover :cover-url="liveDetail.cover" :style="{ 'min-height': isWillBegin ? '40px' : 0 }">
          <p v-if="isWillBegin" class="live-detail__cover-wrap__tip">
            距直播开始仅剩：{{ leaveTimeString }}
          </p>
        </detail-cover>

        <seckill
          v-if="!isIOSWeapp && mixinActivity.activityType === 'seckill'"
          v-model="mixinActivity.seckillInfo"
        />

        <activity-bar
          v-if="!isIOSWeapp && isShowActivityBanner && !isOwned && isInited"
          :start-time="activityBannerInfo.startAt"
          :end-time="activityBannerInfo.endAt"
          tag="限时折扣"
          :min-origin="liveDetail.price"
          :max-origin="liveDetail.price"
          :min-price="activityBannerInfo.activityPrice"
          :max-price="activityBannerInfo.activityPrice"
        />

        <!-- 直播简介 -->
        <div class="live-detail-header">
          <price-tag
            v-if="!isIOSWeapp && isShowPriceTag"
            :origin-price="priceTagValue.originPrice"
            :current-price="[priceTagValue.currentPrice]"
            :tag-name="priceTagValue.tag"
          >
            <div v-if="showPoints" class="points-price">
              兑换价：
              <vis-points :min="showPointsInfo" />
            </div>
          </price-tag>

          <!-- 公众号粉丝 -->
          <fans-benefit
            v-if="!isIOSWeapp && !isOwned"
            :fans-benefit-data="mixinActivity.fansBenefitData"
            :goods-name="liveDetail.title"
            :goods-alias="liveAlias"
          />

          <div class="live-detail-header__title">
            {{ liveDetail.title }}
          </div>
          <div class="live-detail-header__summary">
            {{ liveDetail.summary }}
          </div>
          <div v-if="liveDetail.lecturer" class="live-detail-header__lecturer">
            {{ liveDetail.lecturer }}
          </div>
          <div v-if="liveDetail.pageView" class="live-detail-header__sales">
            {{ `${liveDetail.pageView}${suffix}` }}
          </div>
          <div class="live-detail-header__time-info">
            <div class="live-detail-header__time-info__text">
              <span class="live-detail-header__starttime">
                直播开始时间：{{ liveDetail.liveStartAtStr }}
              </span>
              <span v-if="liveDetail.liveDuration" class="live-detail-header__duration">
                直播时长：{{ liveDetail.liveDuration }}分钟
              </span>
            </div>
            <cap-tag
              v-if="statusText"
              class="live-status-tag"
              :style="{backgroundColor: statusColor}"
              round
            >
              {{ statusText }}
            </cap-tag>
          </div>
        </div>

        <!-- 直播详情富文本 -->
        <qr-group-alert-bar :join-group-setting="liveDetail.joinGroupSettingDTO" :is-owned="isOwned" />

        <!-- 促销活动入口 -->
        <promotion-wrap
          v-if="!isIOSWeapp && showPromotionWrap"
          :promotion-info="mixinActivity.promotionInfo"
          :title="liveDetail.title"
        />

        <!-- 优惠套餐 开始 -->
        <package-entry
          v-if="!isIOSWeapp && mixinActivity.showPackageEntry"
          :package-type="mixinActivity.packageType"
          :goods-list="mixinActivity.packageGoodsList"
          :goods-num="mixinActivity.packageGoodsNum"
          :package-num="mixinPackage.packageNum"
          :discount-price="mixinActivity.packageDiscountPrice"
          :product-alias="liveAlias"
          :alias="mixinActivity.packageAlias"
        />
        <!-- 优惠套餐 结束 -->

        <!-- 专栏入口 -->
        <column-entry
          v-if="liveDetail.columnAlias"
          :entry-type="'column'"
          :title="liveDetail.columnTitle"
          :alias="liveDetail.columnAlias"
          :thumbnail="liveDetail.columnCover"
          :update-desc="liveDetail.contentsCount ? `已更新${liveDetail.contentsCount}期` : ''"
          :sub-count="liveDetail.columnSales"
        />

        <!-- 直播详情富文本 -->
        <div class="live-detail__intro live-detail-intro">
          <div class="live-detail-intro__header">
            <h3>直播介绍</h3>
          </div>
          <div class="live-detail-intro__richtext custom-richtext" v-html="liveDetail.detail" />
        </div>

        <!-- 已领取赠品列表 -->
        <recieved-present-list
          v-if="recievedPresent.length > 0"
          :recieved-present="recievedPresent"
        />

        <comment-list
          v-if="!isIOSWeapp"
          :is-owned="isOwned"
          :alias="liveAlias"
          :content-title="liveDetail.title"
          page-name="LiveDetail"
        />

        <!-- 分销邀请卡 -->
        <invite-btn
          v-if="!isIOSWeapp"
          :fx-info="mixinActivity.inviteCardInfo"
          :referral-info="mixinActivity.referralInfo"
          :share-info="liveDetail"
          :is-paid="isPaid"
          :owl-type="4"
        />

        <!-- 支付后展示价格说明 -->
        <price-desc v-if="!isIOSWeapp && liveDetail.origin && !isOwned" />

        <!-- 底部动作栏 -->
        <live-action
          v-if="!isIOSWeapp"
          :is-focus="isFocus"
          :origin-price="originPrice"
          :price="price"
          :in-stock="isInStock"
          :is-free="isFree"
          :is-paid="isPaid"
          :current-price="currentPrice"
          :is-vip-discount="isVipDiscount"
          :is-ended="isEnded"
          :is-started="isStarted"
          :is-owned="isOwned"
          :allow-single-buy="isAllowSingleBuy"
          :column-url="columnUrl"
          :origin="liveDetail.origin"
          :activity-started="mixinActivity.activityStarted"
          :activity-quota="mixinActivity.activityQuota"
          :show-seckill="mixinActivity.showSeckill"
          :seckill-info="mixinActivity.seckillInfo"
          :publish-at="publishAt"
          :is-time-in-stock="isTimeInStock"
          :show-points="showPoints"
          :points-info="pointsInfo"
          :live-type="liveType"
          @buy="onBuy"
          @notify="onNotifyShow"
          @enter="onLiveRoomEnter"
          @enter-column="onColumnEnter"
          @to-origin="toOrigin"
          @appointment="appointment"
          @remind="remind"
        />

        <!-- 直播提醒弹层 -->
        <van-popup
          v-model="showNotify"
          class="notify-popup"
          :style="{ zoom }"
          :close-on-click-overlay="false"
        >
          <div class="notify-content">
            <h3>直播开始提醒</h3>
            <img :src="liveDetail.focusQr">
            <p>长按扫码并关注</p>
            <p>开启直播提醒</p>
          </div>
          <van-icon
            class="notify-popup__close-btn"
            name="close"
            @click="onNotifyClose"
          />
        </van-popup>
      </template>

      <template v-else>
        <no-data class="paid-content__no-data--fullpage">
          <div>该内容已经删除</div>
          <div class="paid-content__no-data-btn">
            <a :href="noDataLink" class="paid-content__no-data--go-home">
              去逛逛
            </a>
          </div>
        </no-data>
      </template>
    </div>
    <!-- 待领取赠品弹框 -->
    <unrecieve-present-list
      v-model="isShowUnrecievePresentPop"
      :unrecieve-present="unRecievePresent"
      :alias="liveAlias"
    />
    <!-- 引导拉群二维码弹框 -->
    <join-group-popup :join-group-setting="liveDetail.joinGroupSettingDTO" :is-owned="isOwned" />
    <follow-mp v-if="!followed" v-model="followMp" @close="onFollowMpClose" />
    <question
      v-if="mixinActivity.seckillInfo.useQuestion"
      :id="mixinActivity.seckillInfo.questionId"
      v-model="question"
      @success="onQuestionSuccess"
      @close="onQuestionClose"
    />
  </div>
</template>

<script>
import get from 'lodash/get';
import buildUrl from '@youzan/utils/url/buildUrl';
import { Toast, Popup, Icon } from 'vant';
import { Tag } from '@youzan/captain';
import { setShareData, ZNB, getShareLink } from '@youzan/wxsdk';
import UA from '@youzan/utils/browser/ua_browser';
import Args from 'zan-utils/url/args';
import mixinVisPage from 'common/mixins/mixin-vis-page';
import imIcon from '@youzan/im-icon';
import { checkAndLogin } from '@/common/utils/login';

import mixinActivity from 'pct/mixins/mixin-activity';
import mixinBuy from 'pct/mixins/mixin-buy';
import { parsePrice, appendLogParamsTo } from 'pct/utils';
import { SELLER_TYPE, CONTENT_STATUS, LIVE_STATUS, SELL_TIME_TYPE } from 'pct/constants';
import LiveAction from 'pct/components/goods-action/LiveAction/';
import ColumnEntry from 'pct/components/ColumnEntry';
import NoData from 'pct/components/NoData';
import JoinGroupPopup from 'pct/components/JoinGroupPopup';
import DetailCover from 'pct/components/DetailCover';
import CommentList from 'pct/components/CommentList';
import QRGroupAlertBar from '../../components/qr-group-alert-bar/index';
import PriceDesc from '../../../../components/origin-price-desc';
import PriceTag from '../../../edu/prod-detail/components/PriceTag';
import Seckill from 'components/seckill';
import Points from 'components/points';
import apis from 'pct/api';
import { redirectToLock } from '../../utils/lock';
import format from 'date-fns/format';
import Promotion from 'components/promotion';
import RecievedPresentList from 'pct/components/recieved-present-list';
import UnrecievePresentList from '../../components/UnrecievePresentList';
import InviteBtn from '../../components/InviteBtn';
import * as SafeLink from '@youzan/safe-link';
import * as CustomSafeLink from '@/common/utils/custom-safe-link';
import FollowMp from 'components/follow-mp';
import Question from 'components/question';
import { getMpFollowStatus } from 'common-api/utils';
import { getMediaSuffix, ENUM_MEDIA_TYPE } from 'common/utils/hide-info';
import { getLiveStatusDesc } from 'common/utils/live-status';
import ActivityBar from 'components/activity-bar';
import FansBenefit from 'components/fans-benefit';
import TopBar from '../../../../components/top-bar/TopBar';
import { LIVE_TYPE } from 'constants/course/live-type';
import inject from 'common/inject-h5-components';

const _global = window._global;
const { miniprogram = {} } = _global;
const isWeapp = miniprogram.isWeapp;
// 注入shop-ad组件，这个组件中包含了进店礼组件
const showVisitGift = _global.showVisitGift || false;

export default {
  name: 'live-detail',

  config: {
    title: 'this.title',
    // forceRefresh: true,
    hasFixedButton: true,
    pc: {
      forbidRightKey: true,
    },
    log: {
      auto: false,
      type: 'pcl',
      presets: {
        'paid_enterpage': {
          et: 'custom',
          ei: 'paid_enterpage',
          en: '购买后浏览页面',
        },
        'free_get': {
          et: 'click',
          ei: 'free_get',
          en: '点击免费预约听课',
        },
        'buy': {
          et: 'click',
          ei: 'buy',
          en: '点击购买',
        },
      },
    },
  },

  components: {
    'van-popup': Popup,
    'van-icon': Icon,
    ColumnEntry,
    LiveAction,
    NoData,
    DetailCover,
    CommentList,
    PriceDesc,
    JoinGroupPopup,
    PriceTag,
    [QRGroupAlertBar.name]: QRGroupAlertBar,
    'promotion-wrap': Promotion,
    RecievedPresentList,
    UnrecievePresentList,
    InviteBtn,
    [Seckill.name]: Seckill,
    [FollowMp.name]: FollowMp,
    [Question.name]: Question,
    'vis-points': Points,
    ActivityBar,
    FansBenefit,
    'cap-tag': Tag,
    TopBar,
  },

  mixins: [mixinVisPage, mixinBuy, mixinActivity],

  params: {
    alias: String,
    notify: String,
  },

  data() {
    const isPC = window.innerWidth > 600 && !UA.isMobile();

    return {
      isInited: false,
      isDeleted: false,
      title: '直播详情',
      // 直播价格
      // price: 0,
      // 已支付
      isPaid: false,
      // 免费试看
      isFree: false,
      // 允许单独购买
      isAllowSingleBuy: false,
      // 有库存
      isInStock: false,
      // 已关注公众号
      isFocus: false,
      // 直播已结束
      isEnded: false,
      // 直播已开始
      isStarted: false,
      // 专栏链接
      columnUrl: '',
      // 直播标签颜色
      statusColor: '',
      // 直播状态标签文字
      statusText: '',
      // 没有数据时跳转的链接
      noDataLink: window._global.wap_url.wap + '/showcase/homepage?kdt_id=' + window._global.kdt_id,
      // 直播详情数据
      liveDetail: { liveStartAtStr: '', pageView: 0 },
      detailRawData: {},
      // 封面高度
      coverHeight: isPC ? 200 : window.innerWidth * 9 / 16,
      // 倒计时计时器
      timer: 0,
      now: Date.now(),
      // 控制关注公众号弹层的显示
      showNotify: false,
      // 公众号弹层缩放比例
      zoom: window.innerWidth < 375 ? ((window.innerWidth - 60) / 315).toFixed(2) : 1,
      // 直播价格
      originPrice: 0,
      publishAt: '',
      isTimeInStock: false,
      currentPrice: 0,
      isVipDiscount: false,
      // 更换商品中心 alias
      liveAlias: this.$params.alias,
      // 支付跳转返回
      isFromPay: Args.get('isFromPay') || false,
      followMp: false,
      question: false,
      followed: false,

      // 分享链接
      shareUrl: `${_global.url.h5}/wscvis/knowledge/index?kdt_id=${_global.kdt_id}&alias=${this.$params.alias}&page=livedetail`,

      // 商品 id
      productId: 0,
      // IOS小程序屏蔽
      isIOSWeapp: false,
      // 直播类型
      liveType: 1,
    };
  },

  computed: {
    leaveTime() {
      // eslint-disable-next-line no-useless-escape
      return new Date(this.liveDetail.liveStartAtStr.replace(/\-/g, '/')) - this.now;
    },
    leaveTimeString() {
      let h = this.leaveTime / 3600000 >> 0;
      let m = this.leaveTime % 3600000 / 60000 >> 0;
      let s = this.leaveTime % 3600000 % 60000 / 1000 >> 0;
      h = `${h}`.length === 1 ? `0${h}` : `${h}`;
      m = `${m}`.length === 1 ? `0${m}` : `${m}`;
      s = `${s}`.length === 1 ? `0${s}` : `${s}`;

      return `${h}时${m}分${s}秒`;
    },
    // 距离直播小于一天，显示倒计时提醒
    isWillBegin() {
      return this.leaveTime < 86400000 && this.leaveTime > 0;
    },
    isOwned() {
      // 前端清除判断，后端计算拥有逻辑
      return this.isPaid;
    },
    price() {
      const { activityPrice, activityStarted } = this.mixinActivity;
      return activityStarted ? parsePrice(activityPrice) : parsePrice(this.liveDetail.price);
    },

    showPromotionWrap() {
      let promotionInfo = this.mixinActivity.promotionInfo;
      // 只允许积分兑换时 不展示赠品栏
      if (this.showPoints && this.pointsInfo && this.pointsInfo.buyLimit) {
        promotionInfo = promotionInfo.filter(item => {
          return item.tags !== '赠品';
        });
      }
      return !this.isOwned && promotionInfo.length > 0;
    },

    suffix() {
      return getMediaSuffix(ENUM_MEDIA_TYPE.LIVE);
    },

    isShowPriceTag() {
      // 秒杀不显示价格标签
      if (this.activityType === 'seckill') {
        return false;
      }
      return !this.isOwned && !this.isShowActivityBanner && this.isInited;
    },

    priceTagValue() {
      // 仅专栏售卖，要显示专栏价格
      if (!this.isAllowSingleBuy) {
        return {
          originPrice: '',
          currentPrice: this.liveDetail.columnPrice || 0,
          tag: '',
        };
      }
      const { price, origin } = this.liveDetail || {};
      return {
        originPrice: this.isVipDiscount ? [price] : origin,
        currentPrice: this.isVipDiscount ? this.currentPrice : price,
        tag: this.getTag(),
      };
    },

    showPointsInfo() {
      if (!this.showPoints || !this.pointsInfo) {
        return false;
      }
      return {
        points: this.pointsInfo.pointsPrice,
        price: this.pointsInfo.remainPrice,
      };
    },
  },

  created() {
    Promise.all([
      this.fetchLiveDetail(),
      this.fetchNewActivities(),
      this.getMpFollowStatus(),
    ])
      .then(([liveDetail, activity = []]) => {
        if (liveDetail.isLock) {
          redirectToLock(liveDetail.title);
          return;
        }
        // 处理活动数据
        this.mixinActivity.parseNewActivities(activity);
        if (this.mixinActivity.seckillInfo.skuInfos) {
          this.$set(this.mixinActivity.seckillInfo.skuInfos[0], 'price', liveDetail.price);
        }
        // 如果参数带有 notify 则展示二维码弹层
        if (this.$params.notify &&
          liveDetail.liveStatus === LIVE_STATUS.UNSTARTED &&
          !liveDetail.focus
        ) {
          this.onNotifyShow();
        }

        // 开始直播倒计时
        if (this.isWillBegin) {
          this.timer = setInterval(() => {
            this.now = Date.now();
          }, 1000);
        }

        const { title, summary, cover, price, liveType } = liveDetail;
        // 设置文档标题
        this.title = title;
        this.liveType = liveType;

        this.publishAt = liveDetail.publishAt;

        const salesmanInfo = _global.salesmanInfo || {};
        const sls = salesmanInfo.seller || '';
        sls && (this.shareUrl += `&sls=${sls}`);

        // 针对秒杀活动，增加连接参数
        const activityType = Args.get('activityType');
        if (activityType === 'seckill') {
          this.shareUrl = `${this.shareUrl}&activityType=seckill&ump_type=seckill&ump_alias=${this.umpAlias}`;
        }

        // 修改分享内容
        setShareData({
          notShare: false,
          desc: summary,
          link: getShareLink(appendLogParamsTo(this.shareUrl)),
          title,
          cover,
        });

        // 进入页面埋点，兼容后端没给goodsId的情况
        if (liveDetail.goodsId) {
          this.$setLogId(liveDetail.goodsId);
        } else {
          this.$setLogId(() => {
            return apis.getGoodsId({
              alias: this.liveAlias,
              type: 4,
            });
          });
        }

        let params = null;
        if (Args.get('resourceAlias')) {
          params = {
            source: 'enrollment_poster',
            sourceID: Args.get('resourceAlias'),
          };
        }
        this.$log('enterpage', params).then(goodsId => {
          // 添加购买后浏览埋点
          if (this.isOwned) {
            this.$log('paid_enterpage', {
              alias: this.liveDetail.alias,
            });
          }
        });

        // init imsdk
        imIcon.init('.js-im-icon', {
          fromSource: {
            kdt_id: window._global.kdt_id,
            source: 'goods',
            endpoint: 'h5',
            detail: {
              name: title,
              alias: this.liveAlias,
              price: price / 100,
              imgs: [
                cover,
              ],
            },
          },
        });
      })
      .then(_ => {
        this.isInited = true;
      });
    this.getPresentList();

    this.getProductId();
    this.initVisitGift();
    this.checkIosWhiteList();
  },

  destroyed() {
    clearInterval(this.timer);
  },

  methods: {
    fetchLiveDetail() {
      return apis.getLiveDetail({
        alias: this.liveAlias,
      })
        .then((data) => {
          const { vipInfo = {} } = data;
          data.liveStartAtStr = format(data.liveStartAt, 'YYYY-MM-DD HH:mm');
          this.liveDetail = data;
          this.detailRawData = data;
          // 更新 alias
          this.liveAlias = data.alias;

          this.originPrice = parsePrice(this.liveDetail.price);
          this.isPaid = !!this.liveDetail.isPaid;
          this.isFree = !!this.liveDetail.isFree || !!vipInfo.isVipFree;
          this.isAllowSingleBuy = this.liveDetail.sellerType !== SELLER_TYPE.COLUMN;
          // 是否设定定时上架，拥有时忽略定时上架设置,直接置为false
          this.isTimeInStock = !this.isPaid && this.liveDetail.sellTimeType === SELL_TIME_TYPE.TIME_INSTOCK &&
            this.liveDetail.sellStatus === CONTENT_STATUS.OUTSTOCK;
          // 是否设定立即开售，拥有时忽略未开售设置,直接置为true
          this.isInStock = this.isPaid || this.liveDetail.sellStatus === CONTENT_STATUS.INSTOCK;
          this.isFocus = this.liveDetail.focus === 1;
          this.isEnded = this.liveDetail.liveStatus === LIVE_STATUS.ENDED;
          this.isStarted = this.liveDetail.liveStatus === LIVE_STATUS.STARTED;
          this.columnUrl = this.liveDetail.columnAlias ? `#/columnshow?alias=${this.liveDetail.columnAlias}` : '';
          this.statusColor = [
            '',
            '#00b389',
            '#ff4444',
            '',
            '#ff4444',
            '#00b389',
          ][this.liveDetail.liveStatus];
          this.statusText = getLiveStatusDesc(this.liveDetail.liveStatus, this.liveDetail.liveType);

          // 会员标记
          if (vipInfo.joinLevelDiscount) {
            this.currentPrice = vipInfo.vipPrice;
            this.isVipDiscount = true;
          }

          return data;
        })
        .catch((errMsg) => {
          this.isDeleted = true;
          Toast(`获取数据失败！${errMsg}`);
        });
    },

    getPresentList() {
      const query = {
        alias: this.$params.alias,
      };

      if (!this.isFromPay) {
        query.receiveStatus = 1;
      };
      this.fetchPresentList(query);
    },

    getProductId() {
      return apis.getGoodsId({
        alias: this.$params.alias,
        type: 4,
      })
        .then(goodsId => {
          this.productId = goodsId;
        })
        .catch(error => {
          console.error(error);
        });
    },

    getTag() {
      if (get(this.liveDetail, 'vipInfo.isVipFree')) {
        return '会员免费看';
      }
      if (get(this.liveDetail, 'vipInfo.joinLevelDiscount')) {
        return '会员折扣';
      }
      return '';
    },

    initVisitGift() { // 发券宝组件
      if (showVisitGift) { // 发券宝
        inject(['shop-ad'], { isPure: 0 });
      }
    },

    // 用了一个type来标识积分购买
    onBuy({ type } = {}) {
      const { activityStarted, activityQuota = {} } = this.mixinActivity;
      // 如果达到了活动限购，则不能购买
      if (activityStarted && +activityQuota.quota > 0 &&
        +activityQuota.isAllowContinueBuy === 0 &&
        ((+activityQuota.quotaUsed + 1) > (+activityQuota.quota))) {
        Toast(`该课程活动期间每人限购${+activityQuota.quota}件，你之前已经购买了${+activityQuota.quotaUsed}件`);
        return;
      }
      // 增加埋点
      this.$log(this.liveDetail.price === 0 ? 'free_get' : 'buy');
      this.mixinBuy.startLiveOrder(() => this.fetchLiveDetail(), type);
    },

    onNotifyShow() {
      ZNB.getEnv().then(env => {
        if (env.platform === 'swan') {
          Toast('百度智能小程序暂不支持开播提醒');
        } else {
          this.showNotify = true;
        }
      }).catch(() => {
        Toast('获取环境失败，请重试');
      });
    },

    onNotifyClose() {
      this.showNotify = false;
    },

    /**
     * 进入直播间
     */
    onLiveRoomEnter() {
      checkAndLogin(() => {
        if (this.liveType === LIVE_TYPE.YZ_EDU_LIVE) { // 视频直播
          // 当前不在iframe中，直接跳到room
          if (top === self) {
            return CustomSafeLink.redirect({
              url: `/wscvis/course/live/video/room`,
              query: {
                alias: this.liveAlias,
              },
            });
          }
          apis.getEduLiveLink(this.liveAlias)
            .then(res => {
              if (res.link) {
                return CustomSafeLink.redirect({
                  url: res.link,
                });
              } else {
                throw new Error();
              }
            })
            .catch((error) => {
              Toast(error || '进入直播间失败，请稍后再试');
            });
        } else if (this.liveType === LIVE_TYPE.POLYV_LIVE) { // 保利威直播
          apis.getPolyvLiveLink(this.liveAlias)
            .then(res => {
              if (res.link) {
                SafeLink.redirect({
                  url: res.link,
                  kdtId: window._global.kdt_id,
                });
              } else {
                throw new Error();
              }
            })
            .catch(() => {
              Toast('进入直播间失败，请稍后再试');
            });
        } else {
          ZNB.getEnv().then(env => {
            if (env.platform === 'swan') {
              Toast('请在微信中使用直播功能');
            } else {
              const reUrl = buildUrl(
                `/wscvis/knowledge/index?page=liveroom&kdt_id=${window._global.kdt_id}&alias=${this.liveAlias}&sg=live#/liveroom`,
                '',
                window._global.kdt_id
              );
              SafeLink.redirect({
                url: reUrl,
                kdtId: window._global.kdt_id,
              });
            }
          }).catch(() => {
            Toast('获取环境失败，请重试');
          });
        }
      });
    },

    onColumnEnter() {
      this.$router.push(`/ColumnShow?alias=${this.liveDetail.columnAlias}`);
    },

    toOrigin() {
      let url = location.href;
      url = Args.remove(url, 'ump_type');
      url = Args.remove(url, 'ump_alias');
      url = Args.remove(url, 'activityType');
      SafeLink.redirect({
        url,
        kdtId: window._global.kdt_id,
      });
    },

    request() {
      return new Promise((resolve, reject) => {
        checkAndLogin(() => {
          apis.seckillAppointment(this.mixinActivity.seckillInfo.activityId)
            .then(res => {
              if (res) {
                resolve();
                setTimeout(() => {
                  location.reload();
                }, 3000);
              } else {
                reject();
              }
            })
            .catch(() => {
              reject();
            });
        });
      });
    },

    appointment() {
      if (this.mixinActivity.seckillInfo.useFollow) {
        if (this.followed) {
          this.request()
            .then(() => {
              Toast.success('预约成功');
            })
            .catch(() => {
              Toast.fail('预约失败');
            });
        } else {
          this.followMp = true;
        }
      }
      if (this.mixinActivity.seckillInfo.useQuestion) {
        this.question = true;
      }
    },

    remind() {
      if (this.followed) {
        this.request()
          .then(() => {
            Toast.success('设置成功');
          })
          .catch(() => {
            Toast.fail('设置失败');
          });
      } else {
        this.followMp = true;
      }
    },

    onFollowMpClose() {
      this.followMp = false;
    },
    onQuestionSuccess() {
      this.request()
        .then(() => {
          Toast.success('预约成功');
          this.question = false;
        })
        .catch(() => {
          Toast.fail('预约失败');
        });
    },
    onQuestionClose() {
      this.question = false;
    },
    getMpFollowStatus() {
      getMpFollowStatus()
        .then(res => {
          this.followed = res.isFollow;
        });
    },

    checkIosWhiteList() {
      if (UA.isIOS() && isWeapp) {
        this.isIOSWeapp = true;
      }
    },

  },
};
</script>

<style lang="scss">
@import 'var';
@import 'mixins/index.scss';

.live-detail {

  .package-entry {
    margin: 10px 0;
  }

  &__cover-wrap {
    position: relative;

    &__tip {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: $c-white;
      font-size: 14px;
      background: rgba(0, 0, 0, .7);
    }
  }

  &-header {
    padding: 15px;
    background: #fff;

    &__title {
      line-height: 26px;
      color: $c-black;
      font-size: 18px;
      font-weight: 700;

      /* @include multi-ellipsis(2); */
    }

    &__summary {
      font-size: 14px;
      color: $gray-darker;
      line-height: 24px;
      margin-top: 7px;
      margin-bottom: 15px;
    }

    &__time-info {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      margin: 20px 0 0;
      line-height: 16px;
      color: #4A4A4A;
      font-size: 12px;
      line-height: 20px;

      &__text {
        margin-right: 6px;
      }

    }

    &__duration {
      margin-left: 8px;
      padding-left: 8px;
      color: $c-black;
      font-size: 12px;
      border-left: 1px solid #dcdee0;
    }

    &__lecturer {
      margin-top: 10px;
      line-height: 16px;
      color: $c-gray-dark;
      font-size: 12px;
    }

    &__sales {
      margin-top: 5px;
      line-height: 16px;
      color: $c-gray-dark;
      font-size: 12px;
    }

    .points-price {
      margin-top: 5px;
      margin-left: 1px;
      margin-bottom: 4px;
      line-height: 16px;
      font-size: 12px;
      color: #969799;
    }
  }

  &-intro {
    margin-top: 10px;

    &__header {
      box-sizing: border-box;
      padding: 15px 0 0 15px;
      height: 40px;
      background: #fff;

      h3 {
        line-height: 22px;
        color: $c-black;
        font-size: 16px;
        font-weight: 700;
      }
    }

    &__richtext {
      background: #fff;
      min-height: 200px;

      &.custom-richtext {
        padding: 15px 15px 20px;
        color: $c-gray-darker;
        text-align: justify;
      }
    }
  }

  .activity-banner {
    background-color: #fff;
    padding-bottom: 15px;
  }
}

.notify-popup {
  background: transparent;

  .notify-content {
    width: 315px;
    overflow: hidden;
    text-align: center;
    border-radius: 6px;
    background: #fff;

    h3 {
      margin-top: 30px;
      line-height: 25px;
      color: $c-black;
      font-size: 18px;
    }

    img {
      margin: 30px auto 0;
      display: block;
      width: 120px;
      height: 120px;
    }

    p {
      line-height: 24px;
      color: $c-black;
      font-size: 14px;

      &:first-of-type {
        margin-top: 15px;
      }

      &:last-of-type {
        margin-bottom: 36px;
      }
    }
  }

  &__close-btn {
    display: block;
    margin: 40px auto 0;
    text-align: center;
    color: $c-white;
    font-size: 35px;
  }
}

/* 覆盖组件样式 */
.icon__send-coupon {
  bottom: 145px !important;
}

.is-iphonex {
  .live-detail {
    .invite-btn {
      bottom: 134px;
      bottom: calc(constant(safe-area-inset-bottom) + 100px);
      bottom: calc(env(safe-area-inset-bottom) + 100px);
    }
  }
}
</style>
