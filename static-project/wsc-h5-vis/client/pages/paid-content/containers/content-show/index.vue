<template>
  <div v-show="isInited" class="content-show">
    <template v-if="!isDeleted">
      <!-- 切换校区 -->
      <top-bar :class="[{'top-bar--fixed': showTopBar}]" />
      <!-- 礼物领取结果，包含顶部通知条和排行榜 -->
      <notice-bar-and-rank-list
        v-if="$params.is_receive"
        :class="{ 'content__notice-bar--video': isVideo }"
        :params="$params"
      />
      <!-- 图文内容封面图 -->
      <detail-cover
        v-if="!componentName && !isOwned"
        :cover-url="contentData.cover"
      />
      <!-- 音频/视频播放区和封面 -->
      <component
        :is="componentName"
        v-if="isInited"
        ref="content"
        :content-data="contentData"
        :is-owned="isOwned"
        :is-free-goods="isFreeGoods"
        :is-auto-play-mode="isAutoPlayMode"
        :progress="progresses[`c-${$params.alias}`] || {}"
        :is-free-goods-optimize="isFreeGoodsOptimize"
        :recommend-data="grmRecommends.showTopRecommends ? grmRecommends.singleModule : null"
        :video-play-rate="videoPlayRate"
        @log-progress="onLogProgress"
        @play="onPlay"
        @play-next="onPlayNext"
        @after-play="onAfterPlay"
      />

      <seckill
        v-if="!isIOSWeapp && mixinActivity.activityType === 'seckill'"
        v-model="mixinActivity.seckillInfo"
      />

      <activity-bar
        v-if="!isIOSWeapp && isShowActivityBanner && !isOwned && isInited"
        :start-time="activityBannerInfo.startAt"
        :end-time="activityBannerInfo.endAt"
        :tag="activityBannerInfo.tagName"
        :min-origin="contentData.price"
        :max-origin="contentData.price"
        :min-price="activityBannerInfo.activityPrice"
        :max-price="activityBannerInfo.activityPrice"
      />

      <!-- 内容简介 -->
      <content-info
        slot="content-info"
        :class="`${componentName}__content-info`"
        :style="{ marginTop: showTopBar ? '36px' : void 0 }"
        :content-data="contentData"
        :show-directory="isColumnPaid"
        :video-play-rate="videoPlayRate"
        :is-owned="isOwned"
        :column-sort="columnSort"
        @video-playrate-change="onVideoPlayrateChange"
        @changeSort="onChangeType"
      >
        <section slot="main">
          <price-tag
            v-if="!isIOSWeapp && !isOwned && !isShowActivityBanner && isInited"
            slot="main"
            class="pricetag"
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
            :goods-name="contentData.title"
            :goods-alias="$params.alias"
          />
        </section>
        <!-- 连锁屏蔽请好友看 不要删 连锁营销后续会支持上 -->
        <!-- 请好友看按钮、请好友看和送礼的弹窗 -->
        <invite-friend-and-gift
          v-if="!isIOSWeapp && showInviteFriendBtn"
          slot="aside"
          :content-data="contentData"
          :is-persent-gift="mixinActivity.isPersentGift"
          :is-invite-friend="mixinActivity.isInviteFriend"
          :is-received-over="mixinActivity.isReceivedOver"
          :pay-content-info="payContentInfo"
          :persent-gift-info="mixinActivity.persentGiftInfo"
          :is-free-goods-optimize="isFreeGoodsOptimize"
          @buy-gift="onBuyGift"
        />
      </content-info>

      <qr-group-alert-bar :join-group-setting="contentData.joinGroupSetting" :is-owned="isOwned" />
      <promotion-wrap
        v-if="showPromotionWrap"
        :promotion-info="mixinActivity.promotionInfo"
        :title="contentData.title"
      />

      <!-- 拼团活动区域 -->
      <groupon-section
        v-if="!isIOSWeapp && showGroupon"
        slot="groupon"
        :promotion-data="mixinActivity.promotionData"
        :origin-price="originPrice"
        :product-id="productId"
        @select="handleGroupJoin"
      />

      <!-- 优惠套餐 开始 -->
      <package-entry
        v-if="!isIOSWeapp && mixinActivity.showPackageEntry"
        :package-type="mixinActivity.packageType"
        :goods-list="mixinActivity.packageGoodsList"
        :goods-num="mixinActivity.packageGoodsNum"
        :package-num="mixinPackage.packageNum"
        :discount-price="mixinActivity.packageDiscountPrice"
        :product-alias="$params.alias"
        :alias="mixinActivity.packageAlias"
      />
      <!-- 优惠套餐 结束 -->

      <!-- 专栏入口 -->
      <column-entry
        v-if="contentData.columnDetail.alias"
        :entry-type="'column'"
        :title="contentData.columnDetail.title"
        :alias="contentData.columnDetail.alias"
        :thumbnail="contentData.columnDetail.cover"
        :update-desc="contentData.columnDetail.contentsCount
          ? `已更新${contentData.columnDetail.contentsCount}期`
          : ''"
        :sub-count="contentData.columnDetail.subscriptionsCount"
      />

      <!-- 内容详情，富文本区 -->
      <content-richtext
        :content-data="contentData"
        :is-owned="isOwned"
        :show-bottom-recommends="grmRecommends.showBottomRecommends"
        :is-allow-single-buy="isAllowSingleBuy"
        :is-free-goods="isFreeGoods"
      />

      <!-- 群打卡入口 -->
      <div
        v-if="punchInfo.gciAlias"
        class="punch-entry"
        @click="onPunchClick"
      >
        <div class="punch-entry__header">
          <div class="punch-entry__header__title">
            打卡
          </div>
          <div class="punch-entry__header__right">
            <span class="punch-entry__header__content">
              去打卡
            </span>
            <svg-icon class="punch-entry__header__arrow" symbol="arrow-right_new" />
          </div>
        </div>
        <list-item
          :thumbnail-url="punchInfo.coverUrl"
          :title="punchInfo.gciName"
        />
      </div>

      <!-- 下一篇内容、图文的富文本提示 -->
      <only-image-text
        v-if="isInited && contentData.mediaType === 1"
        :content-data="contentData"
        :is-owned="isOwned"
        :progress="progresses[`c-${$params.alias}`] || {}"
        :sort-type="sortType"
        :column-alias="columnAlias"
        @log-progress="onLogProgress"
      />

      <!-- 已领取赠品列表 -->
      <recieved-present-list
        v-if="recievedPresent.length > 0"
        :recieved-present="recievedPresent"
      />

      <!-- 底部关联推荐商品 -->
      <bottom-recommends
        v-if="grmRecommends.showBottomRecommends"
        :owl-module="grmRecommends.owlModule"
        :non-owl-module="grmRecommends.nonOwlModule"
      />

      <!-- 评论列表 -->
      <comment-list
        :is-owned="isOwned"
        :alias="$params.alias"
        :from-page="$params.from_page"
        :content-title="contentData.title"
        page-name="ContentShow"
      />

      <!-- 引导拉群二维码弹框 -->
      <join-group-popup
        :join-group-setting="contentData.joinGroupSetting"
        :is-owned="isOwned"
      />

      <!-- 分销邀请卡 -->
      <invite-btn
        v-if="!isIOSWeapp"
        :fx-info="mixinActivity.inviteCardInfo"
        :referral-info="mixinActivity.referralInfo"
        :share-info="contentData"
        :is-paid="isPaid"
        :owl-type="2"
      />

      <!-- 展示价格说明 -->
      <price-desc v-if="!isIOSWeapp && showPriceDesc" />

      <quick-group-join
        v-if="!mixinActivity.isJoined"
        :group-info="mixinActivity.groupInfo"
        @click="handleGroupJoin"
      />

      <!-- 底部动作栏 -->
      <goods-action
        v-if="!isIOSWeapp && showActionBar"
        :is-free-try="isFreeTry"
        :show-buy-btn="showBuyBtn"
        :show-groupon="showGroupon"
        :is-vip-discount="isVipDiscount"
        :is-in-stock="isInStock"
        :has-promotion="mixinActivity.hasPromotion"
        :column-url="columnUrl"
        :price="originPrice"
        :origin="contentData.origin"
        :origin-price="contentData.price"
        :column-price="+(contentData.columnDetail || {}).price"
        :is-column="false"
        :seller-type="contentData.sellerType"
        :promotion-button-info="mixinActivity.promotionButtonInfo"
        :referral-info="mixinActivity.referralInfo"
        :collect-praise-num="mixinActivity.collectPraiseNum"
        :show-refferal="mixinActivity.showRefferal"
        :show-seckill="mixinActivity.showSeckill"
        :seckill-info="mixinActivity.seckillInfo"
        :prize-channel="mixinActivity.prizeChannel"
        :timelimited-discount-info="mixinActivity.timelimitedDiscountData"
        :publish-at="publishAt"
        :is-time-in-stock="isTimeInStock"
        :show-points="showPoints"
        :points-info="pointsInfo"
        @pay="onBuyContent"
        @create-praise="mixinActivity.createPraise('content')"
      />

      <!-- 专门适配小程序环境下，商品设置了0元且需领取时展示'免费领取';商品参加好友助力活动时，只展示好友助力入口'免费听课' -->
      <goods-action-weapp
        v-if="isIOSWeapp && showActionBar && !isTimeInStock && isInStock"
        :price="originPrice"
        :collect-praise-num="mixinActivity.collectPraiseNum"
        :prize-channel="mixinActivity.prizeChannel"
        @pay="onBuyContent"
        @create-praise="mixinActivity.createPraise('content')"
      />
    </template>

    <no-data v-else />

    <!-- 待领取赠品弹框 -->
    <unrecieve-present-list
      v-model="isShowUnrecievePresentPop"
      :unrecieve-present="unRecievePresent"
      :alias="contentData.alias"
      @closePresent="onClosePresent"
    />
  </div>
</template>

<script>
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import Args from 'zan-utils/url/args';
import UA from '@youzan/utils/browser/ua_browser';
import { setShareData, getShareLink, ZNB } from '@youzan/wxsdk';
import YZLocalStorage from 'zan-utils/browser/local_storage';
import checkFansBuy from 'common/utils/checkFansBuy';
import imIcon from '@youzan/im-icon';

/** components - start **/
import { Toast, Dialog, Popup } from 'vant';
import { ActivityBanner } from '@youzan/vis-ui';
import SvgIcon from 'components/svg-icon';
import ListItem from 'components/list-item';
import Points from 'components/points';
import ColumnEntry from 'pct/components/ColumnEntry';
import JoinGroupPopup from 'pct/components/JoinGroupPopup';
import NoticeBarAndRankList from 'pct/components/NoticeBarAndRankList';
import DetailCover from 'pct/components/DetailCover';
import GoodsAction from '../../components/content-action/index';
import GoodsActionWeapp from '../../components/goods-action-weapp/index';
import NoData from '../../components/NoData';
import PriceTag from '../../../edu/prod-detail/components/PriceTag';
import InviteFriendPopInner from '../../components/invite-friend/InviteFriendPopInner';
import PayForFriendPopInner from '../../components/invite-friend/PayForFriendPopInner';
import ShareGuide from '../../components/invite-friend/ShareGuide';
import InviteBtn from '../../components/InviteBtn';
import PresentSection from '../../components/PresentSection';
import Promotion from 'components/promotion';
import GrouponSection from '../../components/GrouponSection';
import OnlyImageText from './components/OnlyImageText';
import OnlyImage from './components/OnlyImage';
import OnlyAudio from './components/OnlyAudio';
import OnlyVideo from './components/OnlyVideo';
import ContentInfo from './components/ContentInfo';
import CommentList from 'pct/components/CommentList';
import ContentRichtext from './components/ContentRichtext';
import InviteFriendAndGift from './components/InviteFriendAndGift';
import BottomRecommends from './components/goods-recommends/BottomRecommends';
import TopBar from '../../../../components/top-bar/TopBar';
import QRGroupAlertBar from '../../components/qr-group-alert-bar/index';
import PriceDesc from '../../../../components/origin-price-desc';
import RecievedPresentList from '../../components/recieved-present-list';
import UnrecievePresentList from '../../components/UnrecievePresentList';
import QuickGroupJoin from '../../components/quick-group-join';
import Seckill from 'components/seckill';
import ActivityBar from 'components/activity-bar';
import FansBenefit from 'components/fans-benefit';
/** components - end **/

import mixinPromotion from 'pct/mixins/mixin-promotion';
import mixinBuy from 'pct/mixins/mixin-buy';
import mixinActivity from 'pct/mixins/mixin-activity';
import mixinVisPage from 'common/mixins/mixin-vis-page';
import { resourceProtect, appendLogParamsTo } from 'pct/utils';
import {
  MEDIA_TYPE,
  CONTENT_STATUS,
  IS_FREE,
  SELLER_TYPE,
} from 'pct/constants';
import apis from 'pct/api';
import { redirectToLock } from '../../utils/lock';
import { isChainStore } from '@youzan/utils-shop';
import * as SafeLink from '@youzan/safe-link';
import * as BuyApi from '@/common-api/buy';
import * as CustomSafeLink from '@/common/utils/custom-safe-link';
import buildUrl from '@youzan/utils/url/buildUrl';
import inject from 'common/inject-h5-components';

const _global = window._global;
const { miniprogram = {} } = _global;
const isWeapp = miniprogram.isWeapp;
const offlineData = _global.offlineData || {};
const prefetchPromises = (window.__prefetchPromises &&
  window.__prefetchPromises['/wscvis/knowledge/index?p=contentshow#/contentshow']) ||
  [];

const salesmanInfo = _global.salesmanInfo || {};
// 注入shop-ad组件，这个组件中包含了进店礼组件
const showVisitGift = _global.showVisitGift || false;

const SORT_TYPES = JSON.parse(YZLocalStorage.getItem(`paidcolumn:sorttype`) || '{}');

export default {
  name: 'content-show',

  config: {
    title: 'this.title',
    forbidRightKey: true,
    hasFixedButton: 'this.showActionBar',
    log: {
      auto: false,
      type: 'pct',
      presets: {
        // enterpage已内置，无需在此声明
        'paid_enterpage': {
          et: 'custom',
          ei: 'paid_enterpage',
          en: '购买后浏览页面',
        },
        'buy': {
          et: 'click',
          ei: 'buy',
          en: '点击购买',
        },
        'free_get': {
          et: 'click',
          ei: 'free_get',
          en: '点击免费领取',
        },
        'paid_play': {
          et: 'click',
          ei: 'paid_play',
          en: '音/视频购买后点击播放',
        },
      },
    },
  },

  components: {
    'vis-activity-banner': ActivityBanner,
    'vis-points': Points,
    NoticeBarAndRankList,
    ContentInfo,
    NoData,
    OnlyImageText,
    OnlyImage,
    OnlyAudio,
    OnlyVideo,
    ShareGuide,
    InviteFriendPopInner,
    PayForFriendPopInner,
    GoodsAction,
    GoodsActionWeapp,
    PriceTag,
    CommentList,
    InviteBtn,
    PresentSection,
    'promotion-wrap': Promotion,
    GrouponSection,
    JoinGroupPopup,
    ContentRichtext,
    ColumnEntry,
    InviteFriendAndGift,
    BottomRecommends,
    TopBar,
    PriceDesc,
    DetailCover,
    [QRGroupAlertBar.name]: QRGroupAlertBar,
    ListItem,
    SvgIcon,
    RecievedPresentList,
    UnrecievePresentList,
    'van-popup': Popup,
    [Seckill.name]: Seckill,
    ActivityBar,
    'fans-benefit': FansBenefit,
    QuickGroupJoin,
  },

  mixins: [
    mixinVisPage,
    mixinBuy,
    mixinPromotion,
    mixinActivity,
  ],

  params: {
    alias: String,
    // 领取礼物页面跳转参数
    share_alias: String,
    channel_type: String,
    order_alias: String,
    gift_no: String,
    gift_sign: String,
    is_receive: String,
    // 推荐人 buyerId
    bid: String,
    // 推荐人 fansId
    fid: String,
    // 获取详情数据时使用
    code: String,
    from_page: String,
  },

  data() {
    return {
      isChainStore,
      sortType: Args.get('sort_type') || 'desc',
      isInited: false,
      isDeleted: false,
      title: '内容详情',
      contentData: {
        columnDetail: {},
        vipInfo: {},
      },
      // goodsId: 0,
      detailRawData: {},
      // only-video / only-audio
      componentName: '',
      // 底部动作栏展示购买按钮
      showBuyBtn: false,
      // 专栏免费
      isFreeTry: false,
      // 是否是零元商品
      isFreeGoods: false,
      // 废弃 是否是零元商品并且店铺支持0元免领取
      isFreeGoodsOptimize: false,
      // 允许单独购买
      isAllowSingleBuy: true,
      // 会员折扣
      isVipDiscount: false,
      // 已支付
      isPaid: false,
      isInStock: true,
      isAudio: false,
      isVideo: false,
      // 价格标签现价
      currentPrice: '',
      // 价格标签原价
      priceTagOriginPrice: '',
      // 价格标签
      tag: '',
      payContentInfo: {},
      // 专栏链接
      columnUrl: '',
      // 内容播放进度
      progresses: {},
      // 连续播放内容别名
      autoPlayAlias: '',
      // 自动播放，连续播放时会置为 true
      isAutoPlayMode: false,
      // 播放速率
      videoPlayRate: 1.0,
      // 有没有播放过？
      isPlayed: false,
      // 商品推荐
      grmRecommends: {
        showTopRecommends: false,
        showBottomRecommends: false,
        singleModule: null,
        nonOwlModule: null,
        owlModule: null,
      },
      // 专栏是否购买
      isColumnPaid: false,
      // 目录课表
      columnAlias: '',
      contentList: [],
      isListLoading: false,
      isListFinished: false,
      listPageNumber: 1,
      listTotal: 0,

      publishAt: '',
      isTimeInStock: false,

      // 分享链接
      shareUrl: buildUrl(`/wscvis/knowledge/index?kdt_id=${_global.kdt_id}&alias=${this.$params.alias}&page=contentshow`, 'h5', _global.kdt_id),
      // 专栏内容排序
      columnSort: 'desc',
      // 支付跳转返回
      isFromPay: Args.get('isFromPay') || false,

      // 商品id
      productId: 0,

      // 关联打卡信息
      punchInfo: {
        gciAlias: '',
        gciName: '',
        coverUrl: '',
        proceedStatus: -1,
      },

      isWeapp,
      // IOS小程序（更加严格
      isIOSWeapp: false,
    };
  },

  computed: {
    isOwned() {
      const { contentData: data } = this;
      // 清理前端判断，后端已经收拢逻辑
      return !!data.isPaid;
    },

    showPriceDesc() {
      // 购买前不显示价格说明
      if (this.isOwned) {
        return false;
      }
      return this.contentData.origin || +this.buyPrice === 0 || this.isVipDiscount;
    },

    buyPrice() {
      if (this.mixinActivity.timelimitedDiscountData && this.mixinActivity.timelimitedDiscountData.isStarted) {
        return this.mixinActivity.timelimitedDiscountData.min;
      }
      return this.originPrice;
    },

    showPriceTag() {
      const { contentData } = this;
      // 显示条件：没购买但是可以会员免费看 或者 没购买但是是折扣会员
      return !this.mixinActivity.showRefferal &&
        (
          (
            !this.isPaid &&
            contentData.isFree !== IS_FREE.FREE &&
            get(contentData, 'vipInfo.isVipFree')
          ) ||
          (
            !this.isPaid &&
            contentData.isFree !== IS_FREE.FREE &&
            this.isAllowSingleBuy &&
            get(contentData, 'vipInfo.joinLevelDiscount')
          )
        ) &&
        !this.isFreeGoodsOptimize;
    },

    originPrice() {
      const { contentData } = this;
      if (contentData.isFree || contentData.sellerType === SELLER_TYPE.COLUMN) {
        return contentData.columnDetail.price;
      } else {
        // 如果参加了推荐有礼
        if (this.mixinActivity.showRefferal) {
          return contentData.price;
        }
        // 会员折扣价支持
        return contentData.vipInfo.vipPrice === 0
          ? 0
          : (contentData.vipInfo.vipPrice || contentData.price);
      }
    },

    priceTagValue() {
      // 推荐有礼新客的显示价格
      if (this.showRefferal && this.showBuyBtn && !this.isFreeTry) {
        return {
          currentPrice: this.buyPrice - this.mixinActivity.referralInfo.newerSubsidyPrice,
          originPrice: [this.buyPrice],
          tag: '',
        };
      }

      return {
        currentPrice: this.buyPrice,
        originPrice: this.isVipDiscount
          ? [this.contentData.price]
          : this.contentData.origin,
        tag: this.tag,
      };
    },

    showGroupon() {
      // 有时后端会查到拼团价为0的活动，是由于没查到对应的商品，后端修改成本较高，故在这里做一下兼容，活动价需大于0
      return !this.isOwned &&
        this.mixinActivity.hasPromotion && this.mixinActivity.promotionData.promotionPrice &&
        (Date.now() > this.mixinActivity.promotionData.startAt) &&
        (Date.now() < this.mixinActivity.promotionData.endAt);
    },

    // 目前就一个活动，后面添加活动后再修改
    showMeetReduce() {
      return !this.isOwned &&
        !isEmpty(this.mixinActivity.meetReduce) &&
        this.mixinActivity.meetReduce.activityData.length > 0;
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

    showActionBar() {
      return !this.isOwned;
    },

    showTopBar() {
      return this.componentName === 'only-video' && offlineData.show;
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

    /* isShowJoin() {
      if (!this.isOrder) return true;
      if (this.orderNo && !this.isShowUnrecievePresentPop) {
        return true;
      } else {
        return true;
      }
    }, */

    // 是否开启防复制
    forbidCopy() {
      return (this.isOwned || this.contentData.assistTxtType === 2) &&
        this.contentData.copyPicture === 0;
    },
  },

  watch: {
    $route(newV, oldV) {
      // 专栏内容连续播放
      if (this.isInited && newV.query.alias !== oldV.query.alias) {
        this.init(true);
      }
    },
  },

  created() {
    this.init();
    this.initVisitGift();
    this.checkIosWhiteList();
  },

  beforeRouteLeave(to, from, next) {
    if (to.name !== 'ContentShow') {
      this.$refs.content && this.$refs.content.$destroy();
    }

    // 如果开启防复制，退出路由后重置样式设置
    if (this.forbidCopy) {
      const body = document.body;
      if (body && body.style) {
        body.style['-webkit-user-select'] = 'auto';
        body.style['user-select'] = 'auto';
      }
    }

    next();
  },

  methods: {
    init(isAutoPlayMode = false) {
      const { alias } = this.$params;
      if (!alias) Toast('未获取到页面必要参数');
      this.isAutoPlayMode = isAutoPlayMode;

      // 重置shareUrl,当页切换内容时，shareurl可能还是老的，此处重置一下
      this.shareUrl =
        buildUrl(`/wscvis/knowledge/index?kdt_id=${_global.kdt_id}&alias=${this.$params.alias}&page=contentshow`, 'h5', _global.kdt_id);

      const sls = salesmanInfo.seller || '';
      sls && (this.shareUrl += `&sls=${sls}`);

      // 针对秒杀活动，增加连接参数
      const activityType = Args.get('activityType');
      if (activityType === 'seckill') {
        this.shareUrl = `${this.shareUrl}&activityType=seckill&ump_type=seckill&ump_alias=${this.umpAlias}`;
      }

      // 滚动到顶部
      window.scrollTo(0, 0);
      // 支持透传code到后端来实现特殊功能
      const code = this.$params.code || '';
      Promise.all([
        this.fetchContentData({
          alias,
          code,
          sort_type: this.sortType,
        }),
        // 获取活动信息，如果设置为专栏下的内容，且设置为免费试读/看/听，则优先获取专栏的活动信息
        // this.fetchActivities({ alias }),
        this.fetchNewActivities(),
      ])
        .then(([{ contentData, promotionAlias }, newActivity]) => {
          // 根绝内容类型决定渲染的组件
          this.componentName = this.getComponentName(contentData.mediaType);
          // 处理活动数据
          this.mixinActivity.parseNewActivities(newActivity, contentData);
          if (this.mixinActivity.seckillInfo.skuInfos) {
            this.$set(this.mixinActivity.seckillInfo.skuInfos[0], 'price', contentData.price);
          }
          // this.mixinActivity.parseActivities(activities, contentData);
          // 获取推荐列表
          if (this.isOwned) {
            this.fetchRecommendList({
              targetAlias: contentData.alias,
              relatedColumnAlias: contentData.columnAlias || '',
              kdtId: window._global.kdt_id,
              targetType: 2,
            });
          }

          const {
            title,
            cover,
            summary,
            mediaType,
            mediaUrlSwitch,
            price,
          } = contentData;
          // 设置资源保护
          this.setResourceProtect(mediaType, mediaUrlSwitch);
          // 用于 PC 预览模式重新编辑按钮
          this.$emit('type', mediaType);

          // 内容绑定的专栏是否购买
          this.columnAlias = contentData.columnAlias || '';
          this.columnSort = SORT_TYPES[`c-${this.columnAlias}`] || 'desc';
          if (this.columnAlias) {
            this.fetchColumnIsPaid(this.columnAlias);
          }

          this.payContentInfo = this.getPayContentInfo(contentData, this.currentPrice, this.isAllowSingleBuy);

          // 获取内容所在专栏是否支持群打卡
          if (this.isOwned && this.columnAlias) {
            this.fetchSupportPunch();
          }

          // fix 分销商品activityData有可能为空，在此处加一个兜底share setting,以免本页面分享数据不对
          setShareData({
            notShare: false,
            desc: summary,
            link: getShareLink(appendLogParamsTo(this.shareUrl)),
            title,
            cover,
          });

          // init imsdk
          imIcon.init('.js-im-icon', {
            fromSource: {
              kdt_id: window._global.kdt_id,
              source: 'goods',
              endpoint: 'h5',
              detail: {
                name: title,
                alias,
                price: price / 100,
                imgs: [
                  cover,
                ],
              },
            },
          });
          this.getPresentList();

          // 兼容后端没给goodsId的情况
          if (contentData.goodsId) {
            this.$setLogId(contentData.goodsId);
          } else {
            this.$setLogId(() => {
              return apis.getGoodsId({
                alias: this.$params.alias,
                type: 2,
              });
            });
          }

          // 埋点：display 事件
          let params = null;
          if (Args.get('resourceAlias')) {
            params = {
              source: 'enrollment_poster',
              sourceID: Args.get('resourceAlias'),
            };
          }
          this.$log('enterpage', params).then(goodsId => {
            this.$setLogId(goodsId);
            // 添加购买后浏览埋点
            if (this.isOwned) {
              this.$log('paid_enterpage', {
                alias: this.contentData.alias,
              });
            }
          });

          // 如果开启图文防复制，整个 container 加上禁止 user-select:none
          if (this.forbidCopy) {
            const body = document.body;
            if (body && body.style) {
              body.style['-webkit-user-select'] = 'none';
              body.style['user-select'] = 'none';
            }
          }

          // if (!this.isPaid) {
          //   return this.mixinActivity.fetchPromotion(promotionAlias);
          // }
        })
        .finally(() => {
          this.isInited = true;
          if (Args.get('p') === 'contentshow' && window.perfSDK && typeof window.perfSDK.finish === 'function') {
            window.perfSDK.finish();
          }
        });

      // 获取进度
      this.progresses = JSON.parse(YZLocalStorage.getItem('paidcontent:progress') || '{}');
    },

    handleGroupJoin(groupAlias) {
      this.onBuyContent(1, null, groupAlias || Args.get('groupAlias'));
    },

    // 反盗判断，目前针对音频和视频
    setResourceProtect(mediaType, mediaUrlSwitch) {
      resourceProtect.protectCallback = () => {
        if (
          (mediaType === MEDIA_TYPE.AUDIO || mediaType === MEDIA_TYPE.VIDEO) &&
            mediaUrlSwitch &&
            _global.platform !== 'weixin' // 增加微信环境判断
        ) {
          Dialog.alert({
            message: '<div class="paid-content__dialog--no-title">请在微信环境中访问哦</div>',
            confirmButtonText: '知道了',
          });
          return true;
        }
      };
    },

    onChangeType(ev) {
      this.columnSort = ev.type;
      SORT_TYPES[`c-${this.columnAlias}`] = ev.type;
      YZLocalStorage.setItem(`paidcolumn:sorttype`, JSON.stringify(SORT_TYPES));
    },

    fetchColumnIsPaid(alias) {
      apis.getIsPaid({
        columnAlias: alias,
      })
        .then(data => {
          this.isColumnPaid = data;
        })
        .catch(errMsg => {
          console.warn(errMsg);
        });
    },

    // 获取内容详情
    fetchContentData(params) {
      // 获取内容详情
      return (prefetchPromises[0] ? prefetchPromises[0] : apis.getContent(params))
        .then(data => {
          if (data.isLock) {
            redirectToLock(data.title);
            return;
          }
          // +vipInfo, nextOwlInfo
          if (!data.vipInfo) data.vipInfo = {};
          if (!data.nextOwlInfo) data.nextOwlInfo = {};
          if (!data.columnDetail) data.columnDetail = {};
          if (!data.joinGroupSetting) data.joinGroupSetting = {};

          this.contentData = data;
          this.detailRawData = data;
          this.title = data.title;
          // 如果是在 Windows 微信客户端中观看视频内容，则强制显示 PC 版本页面
          const userAgent = window.navigator.userAgent.toLowerCase();
          if (userAgent.indexOf('windowswechat') > -1 && data.mediaType === MEDIA_TYPE.VIDEO) {
            this.$root.showPCMode = true;
          }
          // 是否有库存
          this.isInStock = data.status === CONTENT_STATUS.INSTOCK;
          this.isAudio = data.mediaType === MEDIA_TYPE.AUDIO;
          this.isVideo = data.mediaType === MEDIA_TYPE.VIDEO;
          // 免费试读不当作已购买处理
          this.isPaid = data.isPaid;
          this.isAllowSingleBuy = data.sellerType !== SELLER_TYPE.COLUMN;
          this.isFreeTry = data.isFree === IS_FREE.FREE;

          // 是否设定定时上架
          this.isTimeInStock = data.status === CONTENT_STATUS.TIME_INSTOCK;
          this.publishAt = data.publishAt;

          // 判断是否是 0 元商品
          this.isFreeGoods = this.getIsFreeGoods(data);
          // 是否开启零元购优化
          if (data.zeroProductSwitch) {
            this.isFreeGoodsOptimize = this.isFreeGoods;
          }
          // 已购买后不显示购买按钮，如果内容不能单独购买则永远不显示购买按钮
          this.showBuyBtn = !this.isOwned && this.isAllowSingleBuy;
          const columnDetail = data.columnDetail;
          // 专栏 url
          this.columnUrl = columnDetail.alias ? `#/columnshow?alias=${columnDetail.alias}` : '';

          // 会员标记
          if (!get(data, 'vipInfo.isVipFree', 'false') && get(data, 'vipInfo.joinLevelDiscount')) {
            this.currentPrice = get(data, 'vipInfo.vipPrice');
            this.isVipDiscount = true;
          }
          if (!get(data, 'vipInfo.isVipFree') && get(data, 'vipInfo.joinLevelDiscount')) {
            this.priceTagOriginPrice = data.price;
          }
          this.tag = this.getTag(data, this.isAudio, this.isVideo);
          // this.payContentInfo = this.getPayContentInfo(data, this.currentPrice, this.isAllowSingleBuy);

          this.productId = data.goodsId;

          return {
            contentData: data,
            promotionAlias: (data.isFree || data.sellerType === SELLER_TYPE.COLUMN)
              ? data.columnAlias : data.alias,
          };
        })
        .catch(errMsg => {
          this.isDeleted = true;
        });
    },

    fetchActivities(params) {
      return (prefetchPromises[1] ? prefetchPromises[1] : apis.getActivities(params))
        .catch(errMsg => {
          return [];
        });
    },

    fetchRecommendList(params) {
      apis.findRecommend(params)
        .then(data => {
          const { singleModule = null, owlModule = null, nonOwlModule = null } = data || {};
          // 非单卖的，不显示顶部推荐
          // if (this.data.detailRawData.sellerType !== 1) {
          //   singleModule = null;
          // }
          this.grmRecommends = {
            singleModule,
            owlModule,
            nonOwlModule,
            showTopRecommends: !isEmpty(get(singleModule, 'recommends')),
            showBottomRecommends: !isEmpty(get(owlModule, 'recommends')) ||
              !isEmpty(get(nonOwlModule, 'recommends')),
          };
        })
        .catch(err => {
          console.warn(err);
        });
    },

    fetchSupportPunch() {
      apis.getSupportPunch({
        kdtId: _global.kdt_id,
        columnAliases: [this.columnAlias],
      })
        .then(data => {
          if (data && data[0] && data[0].bindGci) {
            this.punchInfo = data[0];
          }
        })
        .catch(err => {
          console.error(err);
        });
    },

    initVisitGift() { // 发券宝组件
      if (showVisitGift) { // 发券宝
        inject(['shop-ad'], { isPure: 0 });
      }
    },

    getComponentName(mediaType) {
      switch (mediaType) {
        case MEDIA_TYPE.IMAGE_TEXT:
          if (this.mixinActivity.activityType === 'seckill') {
            return 'only-image';
          }
          break;
        case MEDIA_TYPE.AUDIO:
          return 'only-audio';
        case MEDIA_TYPE.VIDEO:
          return 'only-video';
        default:
          return '';
      }
    },

    getIsFreeGoods(contentData) {
      let isFreeGoods = false;
      const sellerType = contentData.sellerType;
      const contentPrice = +contentData.price;
      const columnPrice = +(contentData.columnDetail || {}).price;
      switch (sellerType) {
        case SELLER_TYPE.SINGLE:
          isFreeGoods = contentPrice === 0;
          break;
        case SELLER_TYPE.COLUMN:
          isFreeGoods = columnPrice === 0;
          break;
        case SELLER_TYPE.BOTH:
          isFreeGoods = columnPrice === 0 || contentPrice === 0;
          break;
      }
      return isFreeGoods;
    },

    getTag(contentData, isAudio, isVideo) {
      if (get(contentData, 'vipInfo.isVipFree')) {
        if (isAudio) return '会员免费听';
        if (isVideo) return '会员免费看';
        return '会员免费读';
      } else if (get(contentData, 'vipInfo.joinLevelDiscount')) {
        return '会员折扣';
      }
      return '';
    },

    getPayContentInfo(contentData, currentPrice, isAllowSingleBuy = true) {
      // 内容不予许单独购买的情况
      if (isAllowSingleBuy) {
        return {
          cover: contentData.cover,
          title: contentData.title,
          price: this.mixinActivity.activityStarted
            ? this.mixinActivity.activityPrice : (currentPrice || contentData.price),
          isColumn: false,
          activityQuota: this.mixinActivity.activityQuota,
          isActivityStarted: this.mixinActivity.activityStarted || false,
        };
      } else {
        const columnDetail = contentData.columnDetail;
        return {
          cover: columnDetail.cover,
          title: columnDetail.title,
          price: columnDetail.price,
          isColumn: true,
          contentsCount: columnDetail.contentsCount,
        };
      }
    },

    makeBuyLog(isFree) {
      this.$log(isFree ? 'free_get' : 'buy');
    },

    onBuyContent(type, payload, groupAlias) {
      if (!window._global.is_mobile) {
        Toast('预览不支持进行购买，实际效果请在手机上进行。');
        return;
      }
      if (this.contentData.isFree || this.contentData.sellerType === SELLER_TYPE.COLUMN) {
        let cb = () => { };
        // 免费领取专栏后重载数据
        if (this.contentData.columnDetail.price === 0) {
          cb = () => this.fetchContentData({
            alias: this.$params.alias,
            sort_type: this.sortType,
          }).then(data => {
            // 触发一次购买后查看页面
            this.$log('paid_enterpage', {
              alias: this.contentData.alias,
            });
            return data;
          });
          this.makeBuyLog(true);
        } else {
          this.makeBuyLog(false);
        }
        this.mixinBuy.startColumnOrder(type, cb);
      } else {
        if (this.isAllowSingleBuy) {
          let cb = () => { };
          // hotfix：如果是零元可免费领取（不需要考虑信息采集）
          if (this.contentData.price === 0) {
            cb = () => this.fetchContentData({
              alias: this.$params.alias,
              sort_type: this.sortType,
            }).then(data => {
              // 触发一次购买后查看页面
              this.$log('paid_enterpage', {
                alias: this.contentData.alias,
              });
              return data;
            });
            this.makeBuyLog(true);
          } else {
            this.makeBuyLog(false);
          }
          // 如果达到了活动限购，则不能购买
          const { activityQuota = {}, activityStarted } = this.mixinActivity;

          if (activityStarted && +activityQuota.quota > 0 &&
            +activityQuota.isAllowContinueBuy === 0 &&
            ((+activityQuota.quotaUsed + 1) > (+activityQuota.quota))) {
            Toast(`该课程活动期间每人限购${+activityQuota.quota}件，你之前已经购买了${+activityQuota.quotaUsed}件`);
            return;
          }
          this.mixinBuy.startOrder(type, 'content', this.contentData, cb, payload, groupAlias);
        } else {
          // 内容不允许单独购买，则直接跳转购买专栏
          SafeLink.redirect({
            url: `https://cashier.youzan.com/pay/wscvis_ptc_pay?kdt_id=${window._global.kdt_id}&&type=column&&alias=${this.contentData.columnAlias}`,
            kdtId: window._global.kdt_id,
          });
        }
      }
    },

    onBuyGift(count) {
      checkFansBuy({
        productId: this.productId,
      })
        .then(() => {
          // @TODO gaotian
          // 下单页白名单
          Promise.resolve().then(() => {
            // 内容不允许单独购买的情况，会对相应的专栏下单
            // 但是这个情况专栏没有相应的goodsId。。
            if (this.isAllowSingleBuy) {
              return {
                alias: this.contentData.alias,
                id: this.productId,
                num: count,
                owlType: 2,
              };
            }

            return apis
              .getGoodsId({
                alias: this.contentData.columnAlias,
                type: 1,
              })
              .then(goodsId => {
                return {
                  alias: this.contentData.columnAlias,
                  id: goodsId,
                  num: count,
                  owlType: 1,
                };
              })
              .catch(error => Toast(error || '获取专栏商品Id失败'));
          }).then((product) => {
            const channelType = this.mixinActivity.persentGiftInfo.channelType;
            const params = {
              productInfoList: [product],
              channelType,
            };
            const umpInfo = {};
            umpInfo.num = count;
            params.umpInfo = umpInfo;

            return BuyApi.postBookKey(params).then(({ bookKey }) => {
              CustomSafeLink.redirect({
                url: 'https://cashier.youzan.com/pay/wscvis_buy',
                query: {
                  book_key: bookKey,
                  channel_type: channelType,
                },
              });
            });
          });
        });
    },

    /**
     * 记录内容进度
     */
    onLogProgress(progress = {}) {
      if (!this.isOwned || !progress.total || !progress.current) return;
      const { alias } = this.contentData;
      if (!this.isAutoPlayMode &&
        progress.current > 0 &&
        this.autoPlayAlias === alias
      ) {
        this.isAutoPlayMode = false;
      }

      const { progresses } = this;
      const curProgress = progresses[`c-${alias}`] || {};

      progress.percent = parseInt((progress.current / progress.total) * 100, 10);
      if (progress.percent > 100) progress.percent = 100;
      if (progress.percent < 0) progress.percent = 0;

      // 记录最近播放记录
      // 记录首次播放记录
      // 记录历史播放记录
      const newProgress = Object.assign({}, curProgress);
      newProgress.latest = Object.assign({}, progress);
      if (!curProgress.current || progress.current > curProgress.current) {
        newProgress.percent = progress.percent;
        newProgress.total = progress.total;
        newProgress.current = progress.current;
      }

      progresses[`c-${alias}`] = newProgress;
      this.progresses = progresses;
      YZLocalStorage.setItem('paidcontent:progress', JSON.stringify(progresses));

      // 记录上次学到
      if (this.columnAlias) {
        const curContent = JSON.parse(YZLocalStorage.getItem('paidcontent:laststudy') || '{}');
        curContent[`column-${this.columnAlias}`] = alias;
        YZLocalStorage.setItem('paidcontent:laststudy', JSON.stringify(curContent));
      }
    },

    onPlay() {
      if (this.isPlayed || !this.isOwned) return;
      this.$log('paid_play', {
        alias: this.contentData.alias,
      });
      this.isPlayed = true;
    },

    // 播放结束后，允许触发下一次播放埋点
    onAfterPlay() {
      this.isPlayed = false;
    },

    /**
     * 播放下一个
     */
    onPlayNext(alias) {
      this.isAutoPlayMode = true;
      this.autoPlayAlias = alias;
      this.$router.push({ name: 'ContentShow', query: { alias } });
    },

    onVideoPlayrateChange(toRate) {
      this.videoPlayRate = toRate;
    },

    onPunchClick() {
      const {
        gciAlias,
        proceedStatus,
      } = this.punchInfo;
      const kdtId = _global.kdt_id;

      let url = buildUrl(
        `/wscvis/supv/punch/introduction?kdt_id=${kdtId}&alias=${gciAlias}`,
        'h5',
        kdtId,
      );
      let weappUrl = `/packages/new-punch/introduction/index?alias=${gciAlias}`;
      if (proceedStatus === 2) {
        url = buildUrl(
          `/wscvis/supv/punch/task?kdt_id=${kdtId}&alias=${gciAlias}`,
          'h5',
          kdtId,
        );
        weappUrl = `/packages/new-punch/task/index?alias=${gciAlias}`;
      }

      ZNB.navigate({
        url,
        weappUrl,
      });
    },

    checkIosWhiteList() {
      if (UA.isIOS() && isWeapp) {
        this.isIOSWeapp = true;
      }
    },

    getPresentList() {
      const query = {
        alias: this.$params.alias,
      };

      if (!this.isFromPay) {
        query.receiveStatus = 1;
      };
      this.fetchPresentList(query);
      // this.isOwned && this.fetchPresentList(query);
    },

    onClosePresent() {

    },
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';

.content__loading-wrap {
  padding: 30px;
}

.content__loading {
  margin: 0 auto;
}

.content {
  &-show {
    .package-entry {
      margin-top: 10px;
    }

    .activity-banner {
      background-color: #fff;
      padding-bottom: 15px;
    }
  }

  &__notice-bar--video {
    .van-notice-bar {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1001;
      box-sizing: border-box;
      width: 100%;
    }
  }

  &__notice-text {
    color: #666;
  }
}

.pricetag {
  margin-bottom: 10px;

  .points-price {
    margin-top: 5px;
    margin-left: 1px;
    margin-bottom: 4px;
    line-height: 16px;
    font-size: 12px;
    color: #969799;
  }
}

.top-bar--fixed {
  position: fixed;
  z-index: 99;
  width: 100%;
}

.punch-entry {
  margin: 10px 0;

  &__header {
    background: #fff;
    height: 46px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;

    &__title {
      line-height: 20px;
      font-size: 14px;
      font-weight: bold;
    }

    &__right {
      color: #666;
      font-size: 12px;
      display: flex;
      line-height: 16px;
      align-items: center;
    }

    &__content {
      display: inline-block;
      width: 204px;
      text-align: right;

      @include ellipsis;
    }

    &__arrow {
      width: 8px;
      height: 12px;
      vertical-align: middle;
      margin-left: 5px;
    }
  }
}

/* 覆盖组件样式 */
.icon__send-coupon {
  bottom: 145px !important;
}
</style>
