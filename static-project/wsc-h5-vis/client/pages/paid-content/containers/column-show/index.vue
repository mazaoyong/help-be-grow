<template>
  <div v-show="isInited" class="column-show">
    <template v-if="!isDeleted">
      <!-- 切换校区 -->
      <top-bar />

      <!-- 礼物领取结果，包含顶部通知条和排行榜 -->
      <notice-bar-and-rank-list
        v-if="$params.is_receive && !$params.share_alias"
        :params="$params"
      />

      <!-- 专栏更新提醒条和二维码弹框 -->
      <update-notice v-if="showUpdateNotice && !isWeapp" :update-qrcode-url="updateQrcodeUrl" />

      <!-- 专栏封面图 -->
      <detail-cover :cover-url="columnData.cover" />

      <!-- 小程序迁移-IOS白名单 -->
      <seckill
        v-if="!isIOSWeapp && mixinActivity.activityType === 'seckill'"
        v-model="mixinActivity.seckillInfo"
      />

      <activity-bar
        v-if="!isIOSWeapp && isShowActivityBanner && !isOwned && isInited"
        :start-time="activityBannerInfo.startAt"
        :end-time="activityBannerInfo.endAt"
        :tag="activityBannerInfo.tagName"
        :min-origin="columnData.price"
        :max-origin="columnData.price"
        :min-price="activityBannerInfo.activityPrice"
        :max-price="activityBannerInfo.activityPrice"
      />

      <van-tabs
        v-if="isInited"
        v-model="activeTab"
        :line-width="40"
        :class="['column-show__main', { 'tab-green': isOwned, 'common-tab-style': isOwned }]"
        :sticky="isTabSticky"
        @click="onTabClick"
      >
        <!-- 专栏介绍富文本 -->
        <van-tab title="专栏介绍">
          <!-- 专栏简介 -->
          <column-info :column-data="columnData" :paid="isOwned">
            <section slot="pricetag">
              <price-tag
                v-if="!isIOSWeapp && !isOwned && !isShowActivityBanner && isInited && priceTagValue.currentPrice"
                slot="pricetag"
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
                :goods-name="columnData.title"
                :goods-alias="$params.alias"
              />
            </section>
            <!-- 请好友看按钮、送礼弹层 -->
            <present
              v-if="!isIOSWeapp && showInviteFriendBtn"
              slot="aside"
              :column-data="columnData"
              :is-persent-gift="mixinActivity.isPersentGift"
              :pay-content-info="payContentInfo"
              :persent-gift-info="mixinActivity.persentGiftInfo"
              @buy-gift="onBuyGift"
            />

            <!-- 拼团 -->
            <!-- 小程序迁移-IOS白名单 -->
            <groupon-section
              v-if="!isIOSWeapp && showGroupon"
              slot="groupon"
              :promotion-data="mixinActivity.promotionData"
              :origin-price="columnData.price || ''"
              :product-id="productId"
              @select="handleGroupJoin"
            />
          </column-info>

          <!-- 加粉推广，如果b端设置了加粉推广则展示 -->
          <qr-group-alert-bar :join-group-setting="columnData.joinGroupSetting" :is-owned="isOwned" />

          <!-- 买赠 -->
          <promotion-wrap
            v-if="!isIOSWeapp && showPromotionWrap"
            :promotion-info="mixinActivity.promotionInfo"
            :title="columnData.title"
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

          <column-intro
            class="column-show__main-intro--bg"
            :content="fullContent"
            :is-owned="isOwned"
          />
          <!-- 免费内容列表 -->
          <column-free-list
            v-if="freeList.length && !isOwned"
            :item-total="freeTotal"
            :content-list="freeList"
            :free-sort="freeSort"
            @freeSort="onFreeSort"
          />
        </van-tab>

        <!-- 专栏内容列表 -->
        <van-tab title="专栏目录">
          <!-- 自定义试看 -->
          <div slot="title">
            专栏目录
            <span v-if="freeList.length && !isOwned" class="column-directory__try">试看</span>
          </div>
          <div class="column-menu-tabpanel">
            <column-directory-head
              v-if="contentList.length"
              :item-total="listTotal"
              :sort-type="sortType"
              @changeSort="onChangeType"
            />
            <div
              class="column-direcory__progress-wrapper"
              :class="{ 'column-direcory__progress-wrapper-next': nextOwl.alias && isInited }"
            >
              <div
                v-if="nextOwl.alias && isInited"
                id="progress-btn"
                :class="['column-direcory__progress', {'column-direcory__progress-btn__sticky': stickyProcessBtn}]"
                @click="onNextClick"
              >
                <!-- 临时处理 -->
                <a
                  class="column-direcory__progress-btn"
                  :href="nextUrl"
                >
                  <span>{{ fetchNext ? '学习下一篇' : '继续学习' }}：{{ nextOwl.title }}</span>
                  <van-icon name="arrow" />
                </a>
              </div>

              <div v-if="listFormerPageNumber > 0" class="column-direcory__former-request" @click="onFormerContents">
                点击加载前10条
              </div>
            </div>
            <van-list
              v-model="isListLoading"
              :finished="isListFinished || !isListActive"
              @load="onLoadMoreContents"
            >
              <template v-if="contentList.length">
                <component
                  :is="item.mediaType === 4 ? 'item-live' : 'item-content'"
                  v-for="item in contentList"
                  :key="item.alias"
                  :content-progress-alias="columnProgress.alias"
                  :item="item"
                  :is-owned="isOwned"
                  :is-learn-end="isLearnEnd"
                  :progress="isOwned ? (progresses[`c-${item.alias}`] || {}) : {}"
                  :sort-type="sortType"
                  @record-page="recordPage"
                />
              </template>

              <no-data v-else class="column-show__nodata--big">
                该专栏还没有设置内容哦
              </no-data>
            </van-list>
          </div>
          <!-- 已领取赠品列表 -->
          <recieved-present-list
            v-if="recievedPresent.length > 0"
            :recieved-present="recievedPresent"
          />
        </van-tab>
      </van-tabs>

      <!-- 分销邀请卡 -->
      <invite-btn
        v-if="!isIOSWeapp"
        :fx-info="mixinActivity.inviteCardInfo"
        :share-info="columnData"
        :referral-info="mixinActivity.referralInfo"
        :is-paid="isPaid"
        :owl-type="1"
      />

      <!-- 回到上次学习 -->
      <div v-if="isGoToCurrent" class="go-to-current" @click="gotoCurrent">
        <img src="https://b.yzcdn.cn/public_files/2019/10/10/53f4037f0994ad2a5aeb745d00b68998.svg">
        <span>回到上次学习</span>
      </div>

      <!-- 支付前展示价格说明， 有划线价展示 -->
      <price-desc v-if="!isIOSWeapp && showPriceDesc" />

      <!-- 引导拉群二维码弹框 -->
      <join-group-popup :join-group-setting="columnData.joinGroupSetting" :is-owned="isOwned" />

      <quick-group-join
        v-if="!mixinActivity.isJoined"
        :group-info="mixinActivity.groupInfo"
        @click="handleGroupJoin"
      />

      <!-- 底部动作栏 -->
      <goods-action
        v-if="!isIOSWeapp && !isOwned"
        :show-buy-btn="true"
        :show-groupon="showGroupon"
        :is-vip-discount="isVipDiscount"
        :price="price"
        :origin="columnData.origin"
        :origin-price="columnData.price"
        :is-column="true"
        :is-in-stock="isInStock"
        :promotion-button-info="mixinActivity.promotionButtonInfo"
        :collect-praise-num="mixinActivity.collectPraiseNum"
        :referral-info="mixinActivity.referralInfo"
        :show-refferal="mixinActivity.showRefferal"
        :show-seckill="mixinActivity.showSeckill"
        :seckill-info="mixinActivity.seckillInfo"
        :prize-channel="mixinActivity.prizeChannel"
        :timelimited-discount-info="mixinActivity.timelimitedDiscountData"
        :show-points="showPoints"
        :points-info="pointsInfo"
        @pay="onPay"
        @create-praise="mixinActivity.createPraise('column')"
      />

      <!-- 专门适配小程序环境下，商品设置了0元且需领取时展示'免费领取';商品参加好友助力活动时，只展示好友助力入口'免费听课' -->
      <goods-action-weapp
        v-if="isIOSWeapp && !isOwned && isInStock"
        :price="columnData.price"
        :collect-praise-num="mixinActivity.collectPraiseNum"
        :prize-channel="mixinActivity.prizeChannel"
        @pay="onPay"
        @create-praise="mixinActivity.createPraise('column')"
      />
    </template>

    <no-data v-else />

    <!-- 待领取赠品弹框 -->
    <unrecieve-present-list
      v-model="isShowUnrecievePresentPop"
      :unrecieve-present="unRecievePresent"
      :alias="columnData.alias"
    />
  </div>
</template>

<script>
import { setShareData } from '@youzan/wxsdk';
import isEmpty from 'lodash/isEmpty';
import { get, throttle, includes } from 'lodash';
import Args from 'zan-utils/url/args';
import YZLocalStorage from 'zan-utils/local_storage';
import UA from 'zan-utils/browser/ua_browser';
import imIcon from '@youzan/im-icon';

/** components - start **/
import { Tab, Tabs, Popup, NoticeBar, List, Toast, Icon } from 'vant';
// import { ActivityBanner } from '@youzan/vis-ui';
import JoinGroupPopup from 'pct/components/JoinGroupPopup';
import DetailCover from 'pct/components/DetailCover';
import ColumnInfo from './components/ColumnInfo';
import ItemContent from './components/ItemContent';
import ItemLive from './components/ItemLive';
import ColumnIntro from './components/ColumnIntro';
import NoData from '../../components/NoData';
import PresentSection from '../../components/PresentSection';
import Promotion from 'components/promotion';
import GrouponSection from '../../components/GrouponSection';
import GoodsAction from '../../components/content-action/index';
import GoodsActionWeapp from '../../components/goods-action-weapp/index';
import PriceTag from '../../../edu/prod-detail/components/PriceTag';
import PayForFriendPopInner from '../../components/invite-friend/PayForFriendPopInner';
import ReceiveRankList from '../../components/invite-friend/ReceiveRankList';
import InviteBtn from '../../components/InviteBtn';
import NoticeBarAndRankList from 'pct/components/NoticeBarAndRankList';
import UpdateNotice from './components/UpdateNotice';
import Present from './components/Present';
import ColumnDirectoryHead from './components/ColumnDirectoryHead';
import ColumnFreeList from './components/ColumnFreeList';
import TopBar from '../../../../components/top-bar/TopBar';
import QRGroupAlertBar from '../../components/qr-group-alert-bar/index';
import PriceDesc from '../../../../components/origin-price-desc';
import RecievedPresentList from '../../components/recieved-present-list';
import UnrecievePresentList from '../../components/UnrecievePresentList';
import QuickGroupJoin from '../../components/quick-group-join';
import Seckill from 'components/seckill';
import Points from 'components/points';
import FansBenefit from 'components/fans-benefit';
/** components - end **/

import mixinVisPage from 'common/mixins/mixin-vis-page';
import {
  COLUMN_STATUS,
  VIP_FREE_STATE,
  FREE_GOODS_GET_RULE,
  SELL_TIME_TYPE,
  LIVE_SELL_STATUS,
  CONTENT_STATUS,
} from 'pct/constants';
import Bus from 'pct/utils/bus';
import mixinActivity from 'pct/mixins/mixin-activity';
import mixinBuy from 'pct/mixins/mixin-buy';
import apis from 'pct/api';
import { appendLogParamsTo } from 'pct/utils';
import { isChainStore } from '@youzan/utils-shop';
import { redirectToLock } from '../../utils/lock';
import { weappRichtextFilter } from '@/common/utils/env';
import ActivityBar from 'components/activity-bar';
import * as BuyApi from '@/common-api/buy';
import * as CustomSafeLink from '@/common/utils/custom-safe-link';
import inject from 'common/inject-h5-components';

import scrollUtils from './scroll';

const global = window._global;
const { miniprogram = {} } = _global;
const isWeapp = miniprogram.isWeapp;
const prefetchPromises = (window.__prefetchPromises &&
  window.__prefetchPromises['/wscvis/knowledge/index?p=columnshow#/columnshow']) ||
  [];

const salesmanInfo = global.salesmanInfo || {};
// 注入shop-ad组件，这个组件中包含了进店礼组件
const showVisitGift = _global.showVisitGift || false;

let processBtn = null;
let currentProcessEle = null;
let elTopToPageTop = 0;
const SORT_TYPES = JSON.parse(YZLocalStorage.getItem(`paidcolumn:sorttype`) || '{}');
export default {
  name: 'column-show',

  config: {
    title: 'this.title',
    forbidRightKey: true,
    hasFixedButton: '!this.isOwned',
    log: {
      auto: false,
      type: 'pcm',
      presets: {
        'free_get': {
          et: 'click',
          ei: 'free_get',
          en: '点击免费领取',
        },
        'buy': {
          et: 'click',
          ei: 'buy',
          en: '点击购买',
        },
        'click_catalog_tab': {
          et: 'click',
          ei: 'click_catalog_tab',
          en: '点击专栏目录tab',
        },
        'click_detail_tab': {
          et: 'click',
          ei: 'click_detail_tab',
          en: '点击专栏详情tab',
        },
      },
    },
  },

  components: {
    'van-tab': Tab,
    'van-tabs': Tabs,
    'van-popup': Popup,
    'van-notice-bar': NoticeBar,
    'van-list': List,
    // 'vis-activity-banner': ActivityBanner,
    ColumnIntro,
    ColumnInfo,
    ItemContent,
    ItemLive,
    NoData,
    Present,
    PresentSection,
    GrouponSection,
    PriceTag,
    PayForFriendPopInner,
    ReceiveRankList,
    GoodsAction,
    GoodsActionWeapp,
    InviteBtn,
    NoticeBarAndRankList,
    UpdateNotice,
    JoinGroupPopup,
    DetailCover,
    ColumnDirectoryHead,
    ColumnFreeList,
    TopBar,
    'promotion-wrap': Promotion,
    PriceDesc,
    [Icon.name]: Icon,
    [QRGroupAlertBar.name]: QRGroupAlertBar,
    RecievedPresentList,
    UnrecievePresentList,
    [Seckill.name]: Seckill,
    ActivityBar,
    'vis-points': Points,
    'fans-benefit': FansBenefit,
    QuickGroupJoin,
  },

  mixins: [mixinVisPage, mixinActivity, mixinBuy],

  params: {
    alias: String,
    share_alias: String, // 领取礼物页面跳转参数
    channel_type: String,
    order_alias: String,
    gift_no: String,
    gift_sign: String,
    is_receive: String,
    bid: String, // 推荐人 buyerId
    fid: String, // 推荐人 fansId
    code: String, // 获取详情数据时使用
  },

  data() {
    return {
      isChainStore,
      title: '专栏详情',
      // 判断专栏状态是否是已删除
      isDeleted: false,
      // tab页 滚动加载判断需要做控制， 判断是否滚动列表组件是当前激活状态
      isListActive: true,
      // 控制页面初始状态，防止首屏展示跳屏
      isInited: false,
      // 专栏alias
      alias: '',
      // 专栏信息
      columnData: { vipInfo: {}, joinGroupSetting: {} },
      detailRawData: {},
      // 判断是否需要初始化渲染内容列表组件内容
      isRenderContent: false,
      // 判断是否是首次点击tab选项
      isContentInit: true,
      // 内容列表
      contentList: [],
      isListLoading: false,
      isListFinished: false,
      // 向后请求
      listPageNumber: 1,
      // 向前请求
      listFormerPageNumber: 0,
      listTotal: 0,
      isTabSticky: !!UA.isMobile(),
      // 上次学到吸顶
      stickyProcessBtn: false,
      // 展示回到上次学到
      isGoToCurrent: false,
      // 更新提醒条
      showUpdateNotice: false,
      // 更新提醒公众号二维码
      updateQrcodeUrl: '',
      // 是否已支付
      isPaid: false,
      // 废弃 0元商品优化开关
      isFreeGoodsOptimize: false,
      // 会员折扣
      isVipDiscount: false,
      // 有库存
      isInStock: false,
      // 实际价格
      currentPrice: '',
      // 原价
      originPrice: '',
      // 价格标签
      tag: '',
      // 支付内容信息
      payContentInfo: {},
      // 内容进度表
      progresses: {},
      // 免费列表
      freeList: [],
      freeTotal: 0,
      freeSort: 'desc',
      // 目录排序
      sortType: 'desc',
      // 活动价格
      activityPrice: 0,
      // 分享链接
      shareUrl: CustomSafeLink.getSafeUrl({
        url: `/wscvis/knowledge/index?kdt_id=${global.kdt_id}&alias=${this.$params.alias}&page=columnshow`,
        kdtId: global.kdt_id,
      }),
      // 支付跳转返回
      isFromPay: Args.get('isFromPay') || false,
      // 商品id
      productId: 0,

      isWeapp,
      // IOS小程序屏蔽（更加严格
      isIOSWeapp: false,
      nextOwl: {
        title: '',
        url: '',
        alias: '',
      },
      isLearnEnd: false,
      fetchNext: false,
    };
  },

  computed: {
    isOwned() {
      // 清除前端判断，后端已经整合逻辑
      return this.isPaid;
    },
    price() {
      if (this.mixinActivity.showRefferal) {
        return this.columnData.price;
      } else if (this.mixinActivity.isTimeLimited) {
        // 参加了限时折扣
        return this.mixinActivity.timelimitedDiscountData.min;
      }
      return this.columnData.vipInfo.vipPrice === 0
        ? 0
        : (this.columnData.vipInfo.vipPrice || this.columnData.price);
    },
    showPriceDesc() {
      // 购买前不显示价格说明
      if (this.isOwned) {
        return false;
      }
      return this.columnData.origin || +this.buyPrice === 0 || this.isVipDiscount;
    },

    buyPrice() {
      if (this.mixinActivity.timelimitedDiscountData && this.mixinActivity.timelimitedDiscountData.isStarted) {
        return this.mixinActivity.timelimitedDiscountData.min;
      }
      return this.originPrice;
    },
    showPriceTag() {
      // 显示条件：没购买但是可以会员免费看 或者 没购买但是是折扣会员 或者不是推荐有礼活动的新客
      return !this.mixinActivity.showRefferal &&
        ((!this.isPaid && this.columnData.vipInfo.isVipFree) ||
          (!this.isPaid && this.columnData.vipInfo.joinLevelDiscount));
    },
    // 展示拼团
    showGroupon() {
      // return !this.isOwned && get(this.mixinActivity, 'promotionData.promotionDetail.status') === 1;
      return !this.isOwned &&
        (Date.now() > get(this.mixinActivity, 'promotionData.promotionDetail.startAt')) &&
        (Date.now() < get(this.mixinActivity, 'promotionData.promotionDetail.endAt'));
    },

    // 目前就一个活动，后面添加活动后再修改
    showMeetReduce() {
      return !this.isOwned &&
        !isEmpty(this.mixinActivity.meetReduce) &&
        this.mixinActivity.meetReduce.activityData.length > 0;
    },

    priceTagValue() {
      // 推荐有礼新客的显示价格
      if (this.showRefferal && !this.owned) {
        return {
          currentPrice: this.price - this.mixinActivity.referralInfo.newerSubsidyPrice,
          originPrice: [this.price],
          tag: '',
        };
      }

      return {
        currentPrice: this.price,
        originPrice: this.isVipDiscount
          ? [this.columnData.price]
          : this.columnData.origin,
        tag: this.tag,
      };
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

    // van-tabs激活索引
    activeTab: {
      get() {
        if (this.isPaid || get(this.columnData, 'vipInfo.isVipFree') === VIP_FREE_STATE.FREE || this.isFreeGoodsOptimize) return 1;
        return 0;
      },
      set(newVal) {

      },
    },

    fullContent() {
      return isWeapp ? weappRichtextFilter(this.columnData.fullContent) : this.columnData.fullContent;
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

    nextUrl() {
      return this.nextOwl.alias.startsWith('fx') ? `/wscvis/knowledge/index?kdt_id=${_global.kdt_id}&alias=${this.nextOwl.alias}&p=contentshow` : `/wscgoods/detail/${this.nextOwl.alias}`;
    },
  },

  created() {
    // 获取并设置内容进度表
    const progresses = YZLocalStorage.getItem('paidcontent:progress') || '{}';
    const columnProgress = YZLocalStorage.getItem('paidcolumn:progress') || '{}';

    this.progresses = JSON.parse(progresses);
    this.columnProgress = JSON.parse(columnProgress)[`c-${this.$params.alias}`] || {};
    const lastPage = this.columnProgress.lastPage || 1;
    this.listPageNumber = lastPage < 1 ? 1 : lastPage;

    // 设置默认排序值
    this.sortType = SORT_TYPES[`c-${this.$params.alias}`] || 'desc';

    this.listFormerPageNumber = this.listPageNumber - 1;

    const sls = salesmanInfo.seller || '';
    sls && (this.shareUrl += `&sls=${sls}`);

    // 针对秒杀活动，增加连接参数
    const activityType = Args.get('activityType');
    if (activityType === 'seckill') {
      this.shareUrl = `${this.shareUrl}&activityType=seckill&ump_type=seckill&ump_alias=${this.umpAlias}`;
    }

    // 获取免费列表
    this.fetchFreeContentAndLive();
    // warn: 加请求请慎重，可能会影响到页面的加载
    Promise.all([
      this.fetchColumnDetail(),
      // (prefetchPromises[1] ? prefetchPromises[1] : apis.getActivities({
      //   alias: this.$params.alias,
      // })),
      this.fetchNewActivities(),
    ])
      .then(([columnData, newActivity, freeList]) => {
        if (columnData.isLock) {
          redirectToLock(columnData.title);
          return;
        }
        // 处理活动数据
        this.mixinActivity.parseNewActivities(newActivity, columnData);
        if (this.mixinActivity.seckillInfo.skuInfos) {
          this.$set(this.mixinActivity.seckillInfo.skuInfos[0], 'price', columnData.price);
        }
        // this.mixinActivity.parseActivities(activities, columnData);
        // 获取专栏更新信息
        if (this.isOwned) this.fetchUpdateInfo();
        // 修复购买后进入页面不会加载列表的问题
        if (this.isOwned) this.onLoadMoreContents();

        const { title, columnType, cover, summary, price } = this.columnData;
        Bus.$emit('columnType', columnType);

        // fix 分销商品activityData有可能为空，在此处加一个兜底share setting,以免本页面分享数据不对
        setShareData({
          notShare: false,
          desc: summary,
          link: appendLogParamsTo(this.shareUrl),
          title,
          cover,
        });

        // 埋点：diaplay 事件
        // fix: 专栏埋点goodsId取值不对，也加入了备选方案获取goodsId
        if (this.columnData.goodsId) {
          this.$setLogId(this.columnData.goodsId);
        } else {
          this.$setLogId(() => {
            return apis.getGoodsId({ alias: this.$params.alias, type: 1 });
          });
        }
        let params = null;
        if (Args.get('resourceAlias')) {
          params = {
            source: 'enrollment_poster',
            sourceID: Args.get('resourceAlias'),
          };
        }
        this.$log('enterpage', params);

        // init imsdk
        imIcon.init('.js-im-icon', {
          fromSource: {
            kdt_id: window._global.kdt_id,
            source: 'goods',
            endpoint: 'h5',
            detail: {
              name: title,
              alias: this.$params.alias,
              price: price / 100,
              imgs: [
                cover,
              ],
            },
          },
        });
        this.payContentInfo = {
          cover: this.columnData.cover,
          title: this.columnData.title,
          price: this.mixinActivity.activityStarted
            ? this.mixinActivity.activityPrice : (this.currentPrice || this.columnData.price),
          isColumn: true,
          contentsCount: this.columnData.contentsCount,
          activityQuota: this.mixinActivity.activityQuota,
          isActivityStarted: this.mixinActivity.activityStarted || false,
        };
        this.isInited = true;
      })
      .finally(() => {
        this.isInited = true;
        if (Args.get('p') === 'columnshow' && window.perfSDK && typeof window.perfSDK.finish === 'function') {
          window.perfSDK.finish();
        }
      });

    this.setNextOwl();
    this.attachedOnScroll();
    this.getPresentList();
    this.getProductId();
    this.initVisitGift();
    this.checkIosWhiteList();
  },
  mounted() {
    const processBtn = document.getElementById('progress-btn');
    if (processBtn) {
      elTopToPageTop = scrollUtils.getElementTop(processBtn);
    }
  },

  methods: {
    handleGroupJoin(groupAlias) {
      this.onPay(1, null, groupAlias || Args.get('groupAlias'));
    },

    setNextOwl() {
      const contentAlias = this.columnProgress.alias;
      const percent = (this.progresses[`c-${contentAlias}`] || {}).percent;
      if (percent === 100) {
        this.isLearnEnd = true;
        this.fetchNextOwl(contentAlias, this.columnProgress.url);
      } else if (this.columnProgress.url) {
        // 如果继续阅读对应的内容属于定时上架，那么过滤掉，其他状态正常引导阅读
        this.getContinueReadStatus(contentAlias)
          .then(continueReadStatus => {
            if (continueReadStatus) {
              this.nextOwl = {
                title: this.columnProgress.title && this.columnProgress.title.replace('继续学习：', '').replace('学习下一篇：', ''),
                url: this.columnProgress.url,
                alias: contentAlias,
              };
            }
          });
      }
    },
    // 获取下一篇信息
    fetchNextOwl(alias, url) {
      if (!url) return;

      let owlType;
      if (includes(url, 'content')) {
        owlType = 2;
      } else if (includes(url, 'live')) {
        owlType = 4;
      }

      if (!owlType) return;

      return apis.getNextOwl({
        alias,
        owlType,
        sortType: this.sortType,
      })
        .then((data) => {
          const alias = data.alias;
          if (alias) {
            // 不显示当前的继续学习
            this.fetchNext = true;
            this.nextOwl.alias = alias;
            this.nextOwl.title = data.title;
            const page = owlType === 2 ? 'contentshow' : 'livedetail';
            this.nextOwl.url = `index?page=${page}&alias=${alias}&kdt_id=${_global.kdt_id}&sort_type=${this.sortType}`;
          }
        })
        .catch(() => ({}));
    },
    onNextClick() {
      this.recordPage({
        ...this.nextOwl,
        // 从上面点下一篇没法记录page，可能存在误差
        lastPage: this.columnProgress.lastPage,
      });
    },
    // 获取专栏详情
    fetchColumnDetail() {
      // 获取专栏详情
      return (prefetchPromises[0] ? prefetchPromises[0] : apis.getColumn({
        alias: this.$params.alias,
      }))
        .then(data => {
          // +vipInfo
          if (!data.vipInfo) data.vipInfo = {};
          if (!data.joinGroupSetting) data.joinGroupSetting = {};
          this.columnData = data;
          this.detailRawData = data;
          // 设置标题
          this.title = this.columnData.title;
          this.isPaid = this.columnData.isPaid;
          this.isFreeGoodsOptimize = +this.columnData.price === 0 &&
            +this.columnData.zeroProductSwitch === FREE_GOODS_GET_RULE.NOT_GET;
          this.isListActive = this.isOwned;
          this.isInStock = this.columnData.status === COLUMN_STATUS.INSTOCK;
          // 价格标签相关
          if (!this.columnData.vipInfo.isVipFree && this.columnData.vipInfo.joinLevelDiscount) {
            this.currentPrice = this.columnData.vipInfo.vipPrice;
            this.isVipDiscount = true;
          }
          if (!this.columnData.vipInfo.isVipFree && this.columnData.vipInfo.joinLevelDiscount) {
            this.originPrice = this.columnData.price;
          }
          if (this.columnData.vipInfo.isVipFree) {
            this.tag = '会员免费';
          } else if (this.columnData.vipInfo.joinLevelDiscount) {
            this.tag = '会员折扣';
          }
          return data;
        })
        .catch(errMsg => {
          this.isDeleted = true;
        });
    },

    fetchUpdateInfo() {
      apis.getWxFollowStatus({
        columnAlias: this.$params.alias,
      })
        .then(data => {
          const { needNotice, qrUrl } = data;
          if (needNotice && qrUrl) {
            this.showUpdateNotice = true;
            this.updateQrcodeUrl = qrUrl;
          }
        });
    },

    fetchFreeContentAndLive() {
      return apis.getFreeContentAndLive({
        columnAlias: this.$params.alias,
        sortType: this.freeSort,
      })
        .then(freeList => {
          // 免费列表
          this.freeList = freeList.freeContents || [];
          this.freeTotal = freeList.total || 0;
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
        type: 1,
      })
        .then(goodsId => {
          this.productId = goodsId;
        })
        .catch(error => {
          console.error(error);
        });
    },

    initVisitGift() { // 发券宝组件
      if (showVisitGift) { // 发券宝
        inject(['shop-ad'], { isPure: 0 });
      }
    },

    checkIosWhiteList() {
      if (UA.isIOS() && isWeapp) {
        this.isIOSWeapp = true;
      }
    },

    // 根据alias检查是否允许继续阅读状态，过滤定时上架
    getContinueReadStatus(alias) {
      return apis.getSimple({ alias })
        .then(simpleDetailInfo => {
          // 愚蠢的不一致判断
          // 过滤直播定时上架: 直播上架状态-下架 + 直播开售时间类型-定时上架
          if (simpleDetailInfo.sellTimeType === SELL_TIME_TYPE.TIME_INSTOCK &&
            simpleDetailInfo.sellStatus === LIVE_SELL_STATUS.OUTSTOCK) {
            return false;
          }
          // 过滤内容定时上架: 内容类型-定时上架
          if (simpleDetailInfo.status === CONTENT_STATUS.TIME_INSTOCK) {
            return false;
          }
          return true;
        });
    },

    onTabClick(index) {
      // 如果不是专栏目录，清空processBtn
      if (index === 0) {
        processBtn = null;
      }
      if (this.isOwned) return;

      // 是内容栏
      if (index === 1) {
        this.isListActive = true;
        if (this.isContentInit) {
          this.isRenderContent = true;
          this.isContentInit = false;
        }
        this.$log('click_catalog_tab');
      } else {
        this.isListActive = false;
        this.$log('click_detail_tab');
      }
    },

    onLoadMoreContents() {
      this.isListLoading = true;

      apis.getContentsAndLives({
        alias: this.$params.alias,
        page_no: this.listPageNumber,
        sort_type: this.sortType,
      })
        .then(data => {
          const { list = [], total = 0 } = data;
          this.contentList = this.contentList.concat(list.map(item => ({ ...item, currentPage: this.listPageNumber })));
          this.listTotal = total;
          if (this.listPageNumber * 10 >= this.listTotal) {
            this.isListFinished = true;
          }
          this.listPageNumber = this.listPageNumber + 1;
          this.isListLoading = false;
        })
        .catch(() => {
          this.isListLoading = false;
        });
    },

    onPay(type, payload, groupAlias) {
      if (!UA.isMobile()) {
        Toast('预览不支持进行购买，实际效果请在手机上进行。');
        return;
      }
      // 如果达到了活动限购，则不能购买
      const { activityQuota = {}, activityStarted } = this.mixinActivity;

      if (activityStarted && +activityQuota.quota > 0 &&
        +activityQuota.isAllowContinueBuy === 0 &&
        ((+activityQuota.quotaUsed + 1) > (+activityQuota.quota))) {
        Toast(`该课程活动期间每人限购${+activityQuota.quota}件，你之前已经购买了${+activityQuota.quotaUsed}件`);
        return;
      }
      // 埋点请求
      if (this.price === 0) {
        this.$log('free_get');
      } else {
        this.$log('buy');
      }
      this.mixinBuy.startOrder(type, 'column', this.columnData, () => {
        this.onLoadMoreContents();
      }, payload, groupAlias);
    },

    onBuyGift(count) {
      /* const { activityQuota } = this.payContentInfo;
      if (+activityQuota.quota > 0 &&
        +activityQuota.isAllowContinueBuy === 0 &&
        this.count > (+activityQuota.quota - (+activityQuota.quotaUsed))) {
        Toast(`该课程活动期间每人限购${+activityQuota.quota}件，你之前已经购买了${+activityQuota.quotaUsed}件`);
        return;
      } */

      // @TODO gaotian
      // 下单页白名单
      Promise.resolve().then(() => {
        const product = {
          alias: this.columnData.alias,
          id: this.columnData.goodsId,
          num: count,
          owlType: 1,
        };
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
    },

    onChangeType(ev) {
      // 清空van-list状态
      this.contentList = [];
      this.sortType = ev.type;
      this.listPageNumber = 1;
      this.listFormerPageNumber = 0;
      this.isListFinished = false;
      processBtn = null;
      currentProcessEle = null;
      elTopToPageTop = 0;
      // 记录排序
      SORT_TYPES[`c-${this.$params.alias}`] = ev.type;
      YZLocalStorage.setItem('paidcolumn:sorttype', JSON.stringify(SORT_TYPES));
      this.onLoadMoreContents();
      this.setNextOwl();
    },

    onFreeSort(ev) {
      this.freeSort = ev.type;
      this.fetchFreeContentAndLive();
    },

    onFormerContents() {
      this.isListLoading = true;
      apis.getContentsAndLives({
        alias: this.$params.alias,
        page_no: this.listFormerPageNumber,
        sort_type: this.sortType,
      })
        .then(data => {
          const { list = [] } = data;
          const newList = list.map(item => ({ ...item, currentPage: this.listFormerPageNumber }));
          this.contentList = newList.concat(this.contentList);
          // 向前翻页不需要判断列表请求是否结束
          this.listFormerPageNumber = this.listFormerPageNumber - 1;
          this.isListLoading = false;
        })
        .catch((e) => {
          this.isListLoading = false;
        });
    },

    recordPage(item) {
      // const paidcolumn
      this.columnProgress = {
        lastPage: item.currentPage,
        title: item.title,
        alias: item.alias,
        url: item.url,
      };
      const columnProgress = YZLocalStorage.getItem('paidcolumn:progress') || '{}';
      const newPgs = JSON.parse(columnProgress);
      newPgs[`c-${this.$params.alias}`] = this.columnProgress;
      YZLocalStorage.setItem('paidcolumn:progress', JSON.stringify(newPgs));
    },

    // 监听页面scroll
    attachedOnScroll() {
      window.addEventListener('scroll', throttle(this.onScroll));
    },

    onScroll(e) {
      // 如果是专栏目录，则处理逻辑
      // 处理滚动到上次学到
      this.scrollToProcess();
    },
    setProcessBtnFixed() {
      processBtn = document.getElementById('progress-btn');
      if (processBtn) {
        const scrollTop = scrollUtils.getScrollTop(window);
        if (!elTopToPageTop) {
          elTopToPageTop = scrollUtils.getElementTop(processBtn);
        }
        if (scrollTop + 44 > elTopToPageTop) {
          this.stickyProcessBtn = true;
        } else {
          this.stickyProcessBtn = false;
        }
      }
    },
    scrollToProcess() {
      if (!currentProcessEle) {
        currentProcessEle = document.getElementById(`content-${this.columnProgress.alias}`);
      }
      if (currentProcessEle) {
        const top = scrollUtils.getElementTop(currentProcessEle);
        const scrollTop = scrollUtils.getScrollTop(window);
        const windowHeight = window.innerHeight - 50; // 底部按钮高度
        if (scrollTop + 44 + 43 - 94 > top || top - scrollTop > windowHeight) {
          this.isGoToCurrent = true;
        } else {
          this.isGoToCurrent = false;
        }
      }
    },
    gotoCurrent(e) {
      if (!currentProcessEle) {
        currentProcessEle = document.getElementById(`content-${this.columnProgress.alias}`);
      }
      if (currentProcessEle) {
        const top = scrollUtils.getElementTop(currentProcessEle);
        window.scrollTo({
          top: top - 44 - 43 - 94,
          behavior: 'smooth',
        });
      }
    },
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';
@import "var";

.paid-content__no-data--fullpage {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding-top: 131px;
  background-color: $c-white;
}

.column-show {
  .package-entry {
    margin-top: 10px;
  }

  .van-tabs__line {
    height: 0;
    border: 1.5px solid #f44;
    border-radius: 1.5px;
  }

  .van-tab {
    color: #969799;
  }

  .van-tabs__wrap {
    // box-shadow: 0 0 10px 0 这种样式在safiri上会显示大黑条，建议不要动这个
    box-shadow: 0 2px 10px 0 rgba(125,126,128,0.16);
  }

  .van-tab--active {
    color: #323233;
    font-weight: bold;
  }

  .column-menu-tabpanel {
    background-color: #fff;
  }

  &__main {
    /* 暂时不确定是否对其它有影响 */

    /* .content-title {
      position: relative;
      padding-left: 15px;
      height: 44px;
      line-height: 44px;
      color: $c-black;

      &::after {
        @include border-retina(bottom);
      }
    } */

    &-intro--bg {
      background-color: #fff;
      margin-top: 10px;
    }
  }

  .tab-green {
    .van-tabs__line {
      background-color: $c-green-wx;
    }

    .van-tab--isListActive {
      color: $c-green-wx;
    }
  }

  &__notice-text {
    color: #666;
  }

  &__notice-bar {
    .van-notice-bar__content-wrap {
      height: 35px;
    }
  }

  &__notice-action-fix {
    display: block;
  }

  .column-directory__try {
    padding: 0 4px;
    background-color: #00b389;
    font-size: 10px;
    line-height: 16px;
    color: #fff;
    border-radius: 1px;
    display: inline-block;
    position: absolute;
    top: 14px;
    margin-left: 3px;
    border-radius: 999px;
    transform: scale(.83);
  }
  .column-direcory__former-request {
    text-align: center;
    padding: 12px 0;
    background: #fff;
    font-size: 12px;
    line-height: 1.33;
    color: #646566;
  }
  .column-direcory__progress {
    background: #fff;
    padding: 0 15px;
  }
  .column-direcory__progress-btn {
    box-sizing: border-box;
    display: flex;
    padding: 13px 12px;
    align-items: center;
    justify-content: space-between;
    font-size: 13px;
    line-height: 1.38;
    border-radius: 4px;
  }
  .column-direcory__progress-btn span {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .column-direcory__progress-btn__sticky {
    position: fixed;
    top: 44px;
    z-index: 100;
    left: 0;
    right: 0;
    padding-top: 12px;
  }
  .activity-banner {
    background-color: #fff;
    padding-bottom: 15px;
  }
  .column-direcory__progress-wrapper {
    position: sticky;
    top: 44px;
    z-index: 100;
  }
  .go-to-current {
    position: fixed;
    right: 0;
    bottom: 58px;
    background: #fff;
    font-size: 12px;
    color: #666;
    line-height: 16px;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    box-shadow: 0 0 5px #d0cdcd;
    padding: 7px 11px;
    display: flex;
    align-items: center;

    img {
      width: 12px;
      height: 12px;
      margin-right: 4px;
    }
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

/* 覆盖组件样式 */
.icon__send-coupon {
  bottom: 145px !important;
}
</style>
