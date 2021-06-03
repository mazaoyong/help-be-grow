<template>
  <vis-page-container>
    <div
      v-if="isNotLoading"
      :class="isHasCourse ? '' : 'prod-detail-container__no-course'"
      class="prod-detail-container"
    >
      <!-- 跑马灯 -->
      <trade-carousel
        v-if="courseBoughtDisplay"
        :class="{ 'has-top': offlineData.name }"
        :goods-id="productId"
        :root-kdt-id="rootKdtId"
        extension="报名了该课程"
      />

      <!-- 切换校区 -->
      <top-bar />

      <div v-if="isHasCourse">
        <!-- 轮播 开始 -->
        <vis-image-swp
          :video="goodsVideo"
          :goods-pictures="goodsPictures"
          :goods-picture-ratio="goodsPictureRatio"
        />
        <!-- 轮播 结束 -->
        <!-- 顶部 开始 -->

        <seckill
          v-if="activityType === 'seckill'"
          v-model="activityInfo"
        />

        <activity-bar
          v-if="isShowActivityBanner"
          :start-time="activityBannerInfo.startAt"
          :end-time="activityBannerInfo.endAt"
          :tag="activityBannerInfo.tagName"
          :min-origin="cache.minPrice"
          :max-origin="cache.maxPrice"
          :min-price="
            Array.isArray(activityBannerInfo.activityPrice)
              ? activityBannerInfo.activityPrice[0]
              : activityBannerInfo.activityPrice
          "
          :max-price="
            Array.isArray(activityBannerInfo.activityPrice)
              ? activityBannerInfo.activityPrice[1]
              : activityBannerInfo.activityPrice
          "
        />

        <!-- 未参加活动 -->
        <vis-wrap v-if="!isShowActivityBanner">
          <div
            v-if="showPrice"
            class="price-box"
          >
            <price-tag
              v-if="hasOriginPrice"
              :tag-name="tagName"
              :current-price="[cache.minPrice, cache.maxPrice]"
              :origin-price="[cache.originMinPrice, cache.originMaxPrice]"
            >
              <!-- 积分兑换价 -->
              <div
                v-if="minPointsPrice.points"
                class="points-price"
              >
                兑换价：
                <points
                  :min="minPointsPrice"
                  :max="maxPointsPrice"
                />
              </div>
            </price-tag>
            <price-tag
              v-else
              :tag-name="tagName"
              :current-price="[cache.minPrice, cache.maxPrice]"
              :origin-price="origin"
            >
              <!-- 积分兑换价 -->
              <div
                v-if="minPointsPrice.points"
                class="points-price"
              >
                兑换价：
                <points
                  :min="minPointsPrice"
                  :max="maxPointsPrice"
                />
              </div>
            </price-tag>

            <span
              v-if="totalSoldNum && !isZeroPrice"
              class="sold-num"
            >
              {{ totalSoldNum }}人学过
            </span>
          </div>

          <!-- 公众号粉丝 -->
          <fans-benefit
            :fans-benefit-data="fansBenefitData"
            :goods-alias="alias"
            :goods-name="title"
          />

          <vis-title
            :title="title"
            :course-type-name="courseTypeName"
            :alias="alias"
          />
          <vis-desc
            v-if="sellPoint"
            class="edu-content-desc"
            :desc="sellPoint"
          />
          <vis-course-tag
            v-for="tag in tagList"
            :key="tag.id"
            :content="tag.tag"
          />

          <div
            v-if="totalSoldNum && isZeroPrice"
            class="prod-detail-container__sold-num"
          >
            {{ totalSoldNum }}人学过
          </div>
        </vis-wrap>

        <!-- 参加了拼团活动，该样式后面可能还会修改，咯咯 -->
        <div v-else>
          <vis-wrap>
            <div class="prod-detail-container__promotion-title">
              <!-- 公众号粉丝 -->
              <fans-benefit
                :fans-benefit-data="fansBenefitData"
                :goods-alias="alias"
                :goods-name="title"
              />

              <vis-title
                :title="title"
                :course-type-name="courseTypeName"
                :alias="alias"
              />
              <vis-desc
                v-if="sellPoint"
                class="edu-content-desc"
                :desc="sellPoint"
              />
              <vis-course-tag
                v-for="tag in tagList"
                :key="tag.id"
                :content="tag.tag"
              />
              <div
                v-if="totalSoldNum"
                class="prod-detail-container__sold-num"
              >
                {{ totalSoldNum }}人学过
              </div>
            </div>
          </vis-wrap>
          <!-- 顶部 结束 -->

          <!-- 拼团模块 start -->
          <groupon-pannel
            v-if="isShowGroupon"
            :group-list="grouponInfo.promotionDetail.groupList"
            :group-type="grouponInfo.promotionDetail.groupType"
            :is-show-group-list="isShowGroupList"
            :alias="alias"
            :product-id="cache.productId"
            :condition-num="+grouponInfo.promotionDetail.conditionNum"
            :ladder-price="grouponInfo.promotionDetail.ladderPrice"
            @select="handleGroupJoin"
          />
          <!-- 拼团模块 end -->
        </div>

        <!-- 促销活动 -->
        <!-- 促销活动目前只包含买赠，买赠和积分商城互斥 -->
        <promotion-wrap
          v-if="showPromotionWrapper && !(activityType === 'pointsGoods' && activityInfo.buyLimit)"
          :promotion-info="promotionInfo"
          :title="title"
        />

        <!-- 服务模块 开始 -->
        <cert-bar :list="serviceList" />
        <!-- 服务模块 结束 -->

        <!-- 选择模块 开始 -->
        <vis-wrap
          v-if="(courseTime || showChooseLabel || servicePledge) && !isShowGroupon"
          extend-style="padding: 0 0 0 16px;"
        >
          <vis-label-van-icon
            v-if="courseTime"
            :right-content="courseTime"
            left-content="时间"
          />
          <vis-label-van-icon
            v-if="showChooseLabel"
            :left-content="chooseText"
            show-arrow
            @click="onChooseCourse"
          >
            <p
              slot="right-content"
              class="choose-sku-content"
            >
              <span>{{ chooseContent }}</span>
              <!-- 产品调整：不再展示库存信息 -->
            </p>
          </vis-label-van-icon>
          <vis-label-van-icon v-if="servicePledge">
            <template slot="right-content">
              <svg
                v-if="courseIcon"
                class="theme-color_svg course-svg"
              >
                <use :xlink:href="courseIcon" />
              </svg>
              <span>{{ serviceMessage }}</span>
            </template>
          </vis-label-van-icon>
        </vis-wrap>
        <!-- 选择模块 结束 -->

        <!-- 优惠套餐 开始 -->
        <vis-wrap
          v-if="mixinPackage.showPackageEntry"
          extend-style="padding: 0"
        >
          <package-entry
            :package-type="mixinPackage.packageType"
            :goods-list="mixinPackage.packageGoodsList"
            :goods-num="mixinPackage.packageGoodsNum"
            :package-num="mixinPackage.packageNum"
            :discount-price="mixinPackage.packageDiscountPrice"
            :alias="mixinPackage.packageAlias"
            :product-alias="alias"
          />
        </vis-wrap>
        <!-- 优惠套餐 结束 -->

        <!-- 评价模块 开始 -->
        <vis-evaluate
          v-if="isShowEvaluate"
          :count="evaluate.count"
          :last-evaluation="evaluate.lastEvaluation"
          @click="onGoEvaluatePage"
        />
        <!-- 评价模块 结束 -->

        <!-- nav模块 开始 -->
        <vis-nav
          v-if="navList && navList.length > 1"
          :list="navList"
        />
        <!-- nav模块 结束 -->

        <!-- 适用对象 开始 -->
        <vis-wrap v-if="applyUser">
          <vis-apply-user :apply-user="applyUser" />
        </vis-wrap>
        <!-- 适用对象 结束 -->

        <!-- 主讲老师 开始 -->
        <vis-wrap
          v-if="teacherList.length > 0"
          extend-style="padding: 0 0 0 16px;"
          extend-class="lift-nav-box"
        >
          <vis-title-label
            :left-content="teacherTitle"
            :right-content="cache.teacherList.length > 3 ? '查看全部' : ''"
            :arrow="!!(cache.teacherList.length > 3)"
            @click="onShowTeacherListModal"
          />
          <vis-teacher-item
            v-for="teacher in teacherList"
            :id="teacher.id"
            :key="teacher.id"
            :img="teacher.icon"
            :name="teacher.teacherName || teacher.staffName"
            :post="teacher.duty"
            :desc="teacher.description"
            @click="onGoTeacherDetail"
          />
        </vis-wrap>
        <!-- 主讲老师 结束 -->

        <!-- 课程目录 开始 -->
        <vis-wrap
          v-if="directoryList.length > 0"
          extend-style="padding: 0 0 16px 16px;"
          extend-class="lift-nav-box"
        >
          <vis-title-label left-content="课程目录" />
          <vis-course-item
            v-for="item in directoryList"
            :key="item.courseId"
            :index="item.serialNo"
            :title="item.title"
            :list="item.sectionList"
          />
        </vis-wrap>
        <!-- 课程目录 结束 -->

        <!-- 课程详情 开始 -->
        <vis-wrap
          v-if="courseIntro"
          none-bottom
          extend-style="padding: 0 0 0 16px;"
          extend-class="lift-nav-box"
        >
          <vis-title-label left-content="详情介绍" />
          <div v-lazy-container="{ selector: '.js-richtext-lazy-img' }">
            <cap-rich-text
              :content="courseIntro"
              class="course-info"
            />
          </div>
        </vis-wrap>
        <!-- 课程详情 结束 -->

        <!-- 购买须知 开始 -->
        <vis-wrap
          v-if="buyNotice"
          none-bottom
        >
          <vis-buy-tip :tip="buyNotice" />
        </vis-wrap>
        <!-- 购买须知 结束 -->

        <quick-group-join :group-info="groupInfo" @click="handleGroupJoin" />

        <!-- 底部提示 开始 -->
        <vis-notification
          v-if="bottomMessage"
          :message="bottomMessage"
        />
        <!-- 底部提示 结束 -->

        <!-- 支付前展示价格说明， 有划线价展示 -->
        <price-desc v-if="showPriceDesc" />

        <!-- 底部购买按钮 开始 -->
        <vis-bottom-button
          :course-type="courseType"
          :status="status"
          :purchase-limit="cache.purchaseLimit"
          :price="price"
          :alias="alias"
          :activity-type="activityType"
          :activity-info="activityInfo"
          :activity-quota="activityQuota"
          :product-id="productId"
          :purchase-button-text="purchaseButtonText"
          @toPay="handlePay"
        />
        <!-- 底部购买按钮 结束 -->

        <!-- 老师列表弹窗 开始 -->
        <van-actionsheet
          v-model="showTeacherListModal"
          :title="teacherTitle"
        >
          <vis-wrap
            none-bottom
            extend-style="padding: 10px 16px 0;"
          >
            <vis-teacher-item
              v-for="teacher in cache.teacherList"
              :id="teacher.id"
              :key="teacher.id"
              :img="teacher.icon"
              :name="teacher.teacherName || teacher.staffName"
              :post="teacher.duty"
              :desc="teacher.description"
              @click="onGoTeacherDetail"
            />
          </vis-wrap>
        </van-actionsheet>
        <!-- 老师列表弹窗 结束 -->

        <!-- 分销员 开始 -->
        <!-- <vis-invite
          :alias="alias"
          :product="cache.product"
          :extend-info="{
            price: invitePrice,
            time: courseTime
          }"
        ></vis-invite> -->
        <invite-btn
          v-if="!isGuang"
          :fx-info="inviteCardInfo"
          :referral-info="referralData"
          :share-info="cache.product"
          :is-paid="isPaid"
          :owl-type="10"
          :extend-info="{
            price: invitePrice,
            time: courseTime
          }"
        />
        <!-- 分销员 结束 -->
      </div>
      <div
        v-else
        class="no-course"
      >
        <vis-no-course :desc="noCourseDesc">
          <a
            class="btn btn-goShop"
            @click="onGoShop"
          >
            进店逛逛
          </a>
        </vis-no-course>
        <vis-recommand-box :recommand-data="recommandData" />
      </div>
    </div>
    <div
      v-else
      class="prod-detail-container-loading"
    >
      <van-loading color="white" />
    </div>

    <!-- 促销赠品弹窗 -->
    <present-pop
      v-model="isShowSkuPromotionPop"
      :present-good-list="presentGoodList"
      bg-color="#f2f3f5"
    />
  </vis-page-container>
</template>

<script>
import { Toast, ActionSheet, Loading } from 'vant';
import API from '../api';
import { getActivityApi } from '../../../common-api/activity';
import { RichText } from 'captain-ui';
import Args from 'zan-utils/url/args';
import { setShareData, getShareLink } from '@youzan/wxsdk';
import imIcon from '@youzan/im-icon';
import mixinVisPage from 'common/mixins/mixin-vis-page';
import get from 'lodash/get';
import isNumber from 'lodash/isNumber';
import each from 'lodash/each';
import { getUserPosition, formatSalesNum } from '../utils';
import { handleImageSwpData, getRewardStr } from './utils';
import './event-bus';
import PageContainer from '../components/page-container';
import NoCourse from '../components/no-course';
import Title from './components/title';
import Description from './components/description';
import CourseTag from './components/course-tag';
import PriceTag from './components/PriceTag';
import { LabelVanIcon } from '../components/label';
import Nav from './components/nav';
import Notification from './components/notification';
import ImageSwp from './container/image-swp';
import Wrap from './container/wrap';
import Evaluate from './container/evaluate';
import ApplyUser from './container/apply-user';
import TitleLabel from './container/title-label';
import TeacherItem from './container/teacher-item';
import CourseItem from './container/course-item';
import BuyTip from './container/buy-tip';
import BottomButton from './container/bottom-button';
import GrouponPannel from './components/GrouponPannel';
import mixinPayAndSku from '../mixins/mixinPayAndSku';
import InviteBtn from '../../../components/invite-btn';
import CertBar from './components/cert-bar';
import PriceDesc from '../../../components/origin-price-desc';
import TopBar from '../../../components/top-bar/TopBar';
import Seckill from '../../../components/seckill';
import ActivityBar from 'components/activity-bar';
import Points from 'components/points';
import RecommandBox, { getRecommandCourse } from '../paid-status/recommand-box';
import { formatEvaluationData } from '../course-evaluation/common/utils/formatData';
import {
  VALID_PERIOD_TYPE,
  COURSE_SELL_TYPE,
  VALID_PERIOD_DESC,
  COURSE_EFFECTIVE_DESC,
  COURSE_TYPE,
} from '../constant.js';
import { isEduSingleStore } from '@youzan/utils-shop';
import mixinPackage from 'components/package-entry/mixin';
import mixinActivity from '../mixins/mixinActivity';
import { navigateEnv, weappRichtextFilter } from '../../../common/utils/env';
import Promotion from 'components/promotion';
import PresentPop from 'components/promotion/components/PresentPop';
import FansBenefit from 'components/fans-benefit';
import QuickGroupJoin from './components/quick-group-join';
import { logConfig } from './log';
import * as SafeLink from '@youzan/safe-link';
import skynet from './skynet';
import inject from 'common/inject-h5-components';
import buildUrl from '@youzan/utils/url/buildUrl';
import ladderSelect from './components/ladder-select';

const shopMetaInfo = _global.shopMetaInfo || {};
const salesmanInfo = _global.salesmanInfo || {};

// 注入shop-ad组件，这个组件中包含了进店礼组件
const showVisitGift = _global.showVisitGift || false;
const miniprogram = window._global.miniprogram || {};
const isWeapp = miniprogram.isWeapp;

const [TradeCarousel] = inject(['trade-carousel']);

export default {
  name: 'app',

  provide: {
    pointsName: _global.visPointsName || '积分',
  },

  components: {
    'vis-page-container': PageContainer,
    'vis-title': Title,
    'vis-desc': Description,
    'vis-course-tag': CourseTag,
    'vis-label-van-icon': LabelVanIcon,
    'vis-nav': Nav,
    'vis-notification': Notification,
    'vis-image-swp': ImageSwp,
    'vis-wrap': Wrap,
    'vis-evaluate': Evaluate,
    'vis-apply-user': ApplyUser,
    'vis-title-label': TitleLabel,
    'vis-teacher-item': TeacherItem,
    'vis-course-item': CourseItem,
    'vis-buy-tip': BuyTip,
    'vis-bottom-button': BottomButton,
    'vis-no-course': NoCourse,
    'van-actionsheet': ActionSheet,
    'van-loading': Loading,
    'cap-rich-text': RichText,
    PriceTag,
    PriceDesc,
    GrouponPannel,
    'vis-recommand-box': RecommandBox,
    InviteBtn,
    CertBar,
    TopBar,
    'promotion-wrap': Promotion,
    PresentPop,
    Seckill,
    ActivityBar,
    Points,
    TradeCarousel,
    'fans-benefit': FansBenefit,
    QuickGroupJoin,
  },

  mixins: [mixinVisPage, mixinPayAndSku, mixinPackage, mixinActivity],

  config: {
    log: logConfig,
  },

  data() {
    return {
      isNotLoading: false,
      isHasCourse: false,
      alias: Args.get('alias') || '', // 获取alias
      kdtId: Args.get('kdt_id') || 0, // 获取kdtId

      // 分享url
      shareUrl: buildUrl(
        `/wscvis/edu/prod-detail?alias=${Args.get('alias')}&kdt_id=${
          _global.kdt_id
        }`,
        'h5',
        +_global.kdt_id
      ),
      // 推荐有奖的参数
      bid: +Args.get('bid') || 0, // 老客的buyerid
      fid: Args.get('fid') || 0, // 老客的fansId
      referralData: {},
      isPaid: false, // 是否已购买过此商品

      // 秒杀活动数据
      umpAlias: Args.get('ump_alias') || Args.get('ump_alias_bak'),

      // 邀请卡数据
      inviteCardInfo: {},

      productAlias: '',
      productId: 0, // 商品id
      cache: {}, // 统一的数据缓存容器
      goodsVideo: {},
      goodsPictures: [],
      goodsPictureRatio: 1,
      courseType: -1, // 体验课或正式课， 0:体验课, 1:正式课
      courseTypeName: '', // 体验课或正式课，空字符串就不显示
      title: '', // 课程标题
      sellPoint: '', // 课程卖点
      tagList: [], // 标签列表
      isVip: false,
      priceStr: '', // 商品头部显示的商品价格，可能有区间，因此用字符串表示
      price: 0, // 价格
      origin: '0', // 划线价
      totalSoldNum: 0, // 总销量(多少人学过)
      courseTime: '', // 课程时间
      servicePledge: 0, // 服务承诺
      serviceMessage: '',
      showChooseLabel: false, // 是否显示选择地址和课程
      chooseText: '',
      chooseContent: '',
      chooseStockText: '',
      chooseType: '',
      navList: [], // 导航栏的文案列表
      applyUser: '', // 适用对象
      teacherTitle: '',
      teacherList: [], // 老师列表
      directoryList: [], // 课程目录
      courseIntro: '', // 课程详情
      buyNotice: '', // 购买须知
      bottomMessage: '', // 底部提示
      status: 1, // 商品状态
      showTeacherListModal: false, // 是否现在老师列表弹窗
      noCourseDesc: '',
      activityType: '', // 分销员，好友助力等活动；秒杀会从链接带上参数acticityType=seckill
      courseActivityType: '', // 课程相关的活动，会员价，拼团tag
      isShowEvaluate: false,
      activityInfo: {},
      tagName: '',
      cover: '', // 第一张图片，分享和好友助力会用到
      grouponInfo: {},
      isShowGroupList: false,
      isShowGroupon: false,
      grouponPrice: {},
      evaluate: {}, // 评价相关
      recommandData: [], // 推荐的课程商品
      hasCert: 0, // 1-入学、2-毕业、3-都有
      templateId: Args.get('templateId') || '',
      rewardStr: '',
      shopDetailInfo: {}, // 连锁校区地址信息
      campusName: shopMetaInfo.shopName || '',
      isGuang: _global.isGuang, // 判断入口是否是爱逛小程序
      // activityBannerInfo: {},
      themeType: window._global.themeType,
      purchaseButtonText: '', // 底部按钮文案

      minPointsPrice: {}, // 最低积分价格
      maxPointsPrice: {}, // 最低积分价格
      pointsSkuInfo: {}, // 积分活动sku信息
      showLimit: false, // sku是否显示限购数量
      limit: 0, // sku限购数量
      pointsName: _global.visPointsName || '积分',
      courseBoughtDisplay: 0,
      fansBenefitData: {}, // 公众号粉丝数据
      groupInfo: null,
    };
  },

  computed: {
    rootKdtId() {
      return shopMetaInfo.rootKdtId;
    },
    offlineData() {
      return _global.offlineData || {};
    },
    showPrice() {
      if (
        this.activityType === 'seckill' &&
        this.activityInfo.endAt > new Date()
      ) {
        return false;
      }
      return true;
    },
    invitePrice() {
      const cacheSku = this.cache.sku;
      let price = '';
      if (cacheSku.maxPrice && cacheSku.minPrice !== cacheSku.maxPrice) {
        // 有区间价
        const minPrice = parseFloat(cacheSku.minPrice / 100) || 0;
        price = `¥${minPrice}起`;
      } else {
        price =
          parseFloat(cacheSku.price) === 0
            ? '免费'
            : `¥${parseFloat(cacheSku.price)}`;
      }

      return price;
    },
    certTip() {
      if (this.hasCert === 1) return '购买课程即可领取入学证书';
      if (this.hasCert === 2) return '课程结束后即可领取毕业证书';
      if (this.hasCert === 3) return '入学证书、毕业证书等你来领';
      return '购买课程即可领取入学证书';
    },
    showPriceDesc() {
      if (this.isPaid) {
        return false;
      }
      let originPrice;
      if (this.cache.originMinPrice && this.cache.originMaxPrice) {
        originPrice = [this.cache.originMinPrice, this.cache.originMaxPrice];
        if (originPrice[0] === originPrice[1]) {
          return originPrice[0];
        }
        return !!originPrice;
      } else {
        return !!this.origin;
      }
    },
    serviceList() {
      const list = [
        {
          tag: '证书',
          tip: this.certTip,
          visible: Boolean(this.hasCert),
        },
        {
          tag: '奖励',
          tip: this.rewardStr,
          visible: this.rewardStr !== '',
        },
      ];
      return list;
    },
    hasOriginPrice() {
      return (
        isNumber(this.cache.originMinPrice) &&
        isNumber(this.cache.originMaxPrice)
      );
    },
    courseIcon() {
      if (this.servicePledge === 1) return '#icon_done';
      if (this.servicePledge === 2) return '#icon_wait';
      return '';
    },

    // 商品价格是否是0元，0元的价格会被隐藏
    // 从price-tag提上来的逻辑
    isZeroPrice() {
      const { maxPrice, minPrice } = this.cache;
      return maxPrice ? +maxPrice === 0 : +minPrice === 0;
    },
  },

  created() {
    this.initProdDetail();
    // 为了用户体验，将评价组件的ajax请求放在外面，不内置在评价组件内，不然会有一个明显的插入的过程
    this.initEvaluateData();
    this.clearSessionStorage();
    this.sendIncreaseQrScanNum();
    this.initVisitGift();
    this.fetchGroupData();

    skynet.skynetEnterMonitor();
  },

  mounted() {
    skynet.skynetMountedMonitor();
  },

  methods: {
    initProdDetail() {
      API.getCourseDetail({
        alias: this.alias || '',
      })
        .then(res => {
          if (res && res.data && res.data.product && res.data.course) {
            const { data } = res;
            if (!data.product.status) {
              // status为0， 课程已删除的情况
              this.handleNoCourse('HAS_DELETE');
              return;
            }
            if (data.product.isRiskLock) {
              this.onGoLockPage();
              return;
            }
            this.courseType = data.course.courseType; // 体验课，正式课
            this.courseTypeName = data.course.courseTypeName;
            this.title = data.product.title || ''; // 商品标题
            this.sellPoint = data.product.sellPoint || ''; // 课程卖点
            this.tagList = data.course.tagList || []; // 课程标签
            this.origin = data.product.origin || ''; // 课程划线价
            this.totalSoldNum = formatSalesNum(data.product.totalSoldNum) || 0; // 总销量(多少人学过)
            this.productAlias = data.product.alias || ''; // 商品alias
            this.productId = data.course.productId || 0; // 商品id
            this.applyUser =
              data.course.applyUser.replace(/\n/gi, '<br/>') || ''; // 适用对象
            this.directoryList =
              (data.course.directory && data.course.directory.directoryList) ||
              []; // 课程目录
            this.courseIntro = data.course.intro || ''; // 课程详情
            this.courseBoughtDisplay = data.product.courseBoughtDisplay;
            if (isWeapp) {
              this.courseIntro = weappRichtextFilter(this.courseIntro);
            }
            this.buyNotice = data.course.buyNotice || ''; // 购买须知
            this.status = data.product.status; // 商品状态 0：已删除 1：销售中 2：已售罄 3：停止销售 4：待开售
            this.hasCert = data.course.hasCert;
            const sku = data.product.skuFormatModel || {};
            this.shopDetailInfo = data.course.shopDetailInfo || {};
            // this.price = sku.maxPrice ? parseFloat(sku.maxPrice / 100).toFixed(2) : Number(sku.price);
            this.price = sku.minPrice;
            if (sku.list && sku.list.length === 0 && sku.tree.length === 0) {
              // 无规格的情况,取collectionId作为skuId
              this.skuId = sku.collectionId || 0;
              this.grouponSkuId = sku.collectionId || 0;
              this.collectSkuId = sku.collectionId || 0;
            }
            if (
              data.activity &&
              data.activity.length > 0 &&
              data.activity[0].type === 'vip'
            ) {
              this.isVip = true;
              this.tagName = '会员价';
              this.courseActivityType = 'vip';
            }
            if (get(data, 'product.courseBuyButton.buyBtnConfig') === 1) {
              this.purchaseButtonText = get(
                data,
                'product.courseBuyButton.buyBtnLabel'
              );
            }

            // 缓存数据，其他方法会用到
            this.cache.product = data.product || {};
            this.cache.pictures = data.product.pictures || [];
            this.cache.sku = data.product.skuFormatModel || {};
            this.cache.addressList = data.course.addressList || [];
            this.cache.teacherList = data.course.teacherList || [];
            this.cache.minPrice = this.cache.sku.minPrice || 0;
            this.cache.maxPrice = this.cache.sku.maxPrice || 0;
            this.cache.timingPublishAt = data.course.timingPublishAt || '';
            this.cache.purchaseLimit = data.product.purchaseLimit || false;
            this.cache.quota = data.product.quota || 0; // 用户购买限额
            this.cache.courseStartAt = data.course.courseStartAt || '';
            this.cache.courseEndAt = data.course.courseEndAt || '';
            this.cache.courseEffectiveType = data.course.courseEffectiveType; // 生效时间的类型
            this.cache.courseSellType = data.course.courseSellType; // 课程售卖方式
            this.cache.courseEffectiveDelayDays =
              data.course.courseEffectiveDelayDays; // 付款后延迟生效的天数
            this.cache.validityPeriodRange = data.course.validityPeriodRange; // 有效期数量
            this.cache.validityPeriodType = data.course.validityPeriodType; // 有效期类型
            this.cache.validityPeriodUnit = data.course.validityPeriodUnit; // 有效期单位
            this.cache.courseType = data.course.courseType; // 线下课类型 体验/正式
            this.cache.shopName = shopMetaInfo.shopName; // 校区名称
            this.cache.productId = data.course.productId || 0;
            this.cache.hideStock = data.product.hideStock;

            // 如果存在活动，价格逻辑重新处理：显示的价格为活动价格，划线价为原价
            if (data.activity && data.activity.length > 0) {
              const minPrice =
                (data.activity[0].data && data.activity[0].data.minPrice) || 0;
              const maxPrice =
                (data.activity[0].data && data.activity[0].data.maxPrice) || 0;
              this.cache.minPrice = minPrice;
              this.cache.maxPrice = maxPrice;
              // this.price = this.cache.maxPrice;
              this.price = maxPrice;
              this.cache.originMinPrice = this.cache.sku.minPrice;
              this.cache.originMaxPrice = this.cache.sku.maxPrice;
              this.cache.sku =
                (data.activity[0] && data.activity[0].skuFormatModel) ||
                this.cache.sku;
            }

            // 处理地址列表, 只需要id的数组
            this.storeIds = this.cache.addressList.map(address => {
              return address.id;
            });

            // handle 方法
            this.handleImageSwp(data); // 轮播
            this.handleCourseTime(
              data.course.courseStartAt,
              data.course.courseEndAt
            ); // 课程时间
            this.handleServiceInfo(data.course.servicePledge); // 服务承诺
            this.handleChooseLabel(
              data.product.skuFormatModel,
              data.course.addressList,
              this.shopDetailInfo
            ); // 处理选择地址和课程逻辑
            this.handleNav(data); // 导航栏
            this.handleTeacherList(data.course.teacherList); // 老师列表

            this.setShareConfig({
              video: data.product.videoModel || {},
              pictures: data.product.pictures || [],
              title: data.product.title || '',
              desc: data.product.subTitle || '',
            });

            document.title = this.title || '';

            // enterpage 埋点
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
                  name: this.title,
                  alias: this.alias,
                  price: this.price / 100,
                  imgs: [this.cover],
                },
              },
            });

            this.isHasCourse = true;
          } else {
            this.handleNoCourse('NO_COURSE');
          }
        })
        .then(() => {
          this.getActivity();
          this.findCourseProductRewardActivity();
        })
        .catch(() => {
          this.handleNoCourse('NO_COURSE');
        });
    },

    handlePay(type, forcePay, groupAlias) {
      if (!this.cache.sku.hasSku && this.activityType === 'ladderGroupOn' && !groupAlias) {
        ladderSelect({
          ladderPrice: this.grouponInfo.promotionDetail.ladderPrice,
          minPrice: this.grouponInfo.promotionDetail.minPrice,
          maxPrice: this.grouponInfo.promotionDetail.maxPrice,
          cover: this.cache.pictures[0] && this.cache.pictures[0].url,
        }).then(scale => {
          this.scale = scale;
          this.toPay(type, forcePay, groupAlias);
        });
        return;
      }
      this.toPay(type, forcePay, groupAlias);
    },

    fetchGroupData() {
      const groupType = Args.get('groupType');
      const groupAlias = Args.get('groupAlias');
      if (groupType && groupAlias) {
        API.getGroupOnDetail({
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

    handleGroupJoin(groupAlias) {
      this.handlePay(1, false, groupAlias || this.groupInfo.groupAlias);
    },

    findCourseProductRewardActivity() {
      API.findCourseProductRewardActivity({
        courseProductAlias: this.alias,
      })
        .then(res => {
          this.rewardStr = getRewardStr(res, this.cache.courseSellType);
        })
        .catch(() => {
          // 奖励查询失败不需要提示
          // Toast(err);
        });
    },

    getActivity() {
      if (Args.get('activityType') === 'seckill') {
        return API.getSeckillInfo(
          Args.get('ump_alias') || Args.get('ump_alias_bak')
        )
          .then(data => {
            this.activityType = 'seckill';
            this.activityInfo = data;
            this.parseSeckillDiscount(data);
            // 重构时做优化吧...
            each(this.activityInfo.skuInfos, item => {
              if (this.cache.sku.hasSku) {
                each(this.cache.sku.list, sku => {
                  if (item.skuId === sku.id) {
                    item.price = sku.price;
                  }
                });
              } else {
                item.price = this.cache.sku.minPrice;
              }
            });
            // 按期售卖课程，秒杀库存取最小值
            if (this.cache.courseSellType === 3) {
              this.activityInfo.currentStock = Math.min(
                this.cache.sku.restStock,
                this.activityInfo.currentStock
              );
            }
            this.handleBottomMessage();
          })
          .catch(err => {
            Toast.fail(err || '秒杀信息获取失败');
          })
          .finally(() => {
            this.isNotLoading = true;
          });
      }
      getActivityApi({
        alias: this.alias || '',
        productType: 10,
        activityType: this.activityType,
      })
        .then((res = {}) => {
          const data = res || [];
          this.activityType = '';
          data.forEach(item => {
            switch (item.type) {
              case 'groupon':
                this.activityType = item.type;
                this.parseGrouponData(item.data);
                break;
              case 'ladderGroupOn':
                this.activityType = item.type;
                this.parseLadderGroupOnData(item.data);
                break;
              case 'recommendPolite':
                this.activityType = item.type;
                this.parseReferralData(item.data);
                break;
              case 'collectZan':
                this.activityInfo = item.data;
                this.activityType = item.type;
                break;
              case 'invite':
                this.inviteCardInfo = item.data;
                break;
              case 'packageBuy':
                this.packageData = item.data;
                break;
              case 'timelimitedDiscount':
                this.activityType = item.type;
                this.timelimitedDiscountInfo = item.data;
                this.parseTimelimitedDiscount(this.timelimitedDiscountInfo);
                break;
              case 'meetReduce':
                const skuIds = [];
                if (this.cache.sku.hasSku) {
                  (this.cache.sku.list || []).forEach(item => {
                    skuIds.push(item.id);
                  });
                }
                this.parsePromotionInfo(item, skuIds);
                break;
              case 'pointsGoods':
                this.activityInfo = item.data;
                this.activityType = item.type;
                this.setPointsActivity(item.data, item.type);
                break;
              case 'fansBenefit':
                this.fansBenefitData = this.formatFansBenefit(item.data);
                break;
              default:
                break;
            }
          });
        })
        .then(() => {
          this.handleBottomMessage(); // 底部提示
        })
        .finally(() => {
          this.isNotLoading = true;
        });
    },

    // 设置积分活动
    setPointsActivity(activityInfo) {
      const hasSku = this.cache.sku.hasSku;

      // 1. 设置头部积分价格
      let minSku = {};
      let maxSku = {};
      const goodsSku = activityInfo.goodsSku || [];
      // 设置购买限制
      this.pointsLimit = activityInfo.quotaNum;
      this.pointsUsed = activityInfo.quotaUsed;

      if (hasSku) {
        goodsSku.forEach(sku => {
          if (
            minSku.pointsPrice === undefined ||
            sku.pointsPrice <= minSku.pointsPrice
          ) {
            minSku = sku;
          }
          if (
            maxSku.pointsPrice === undefined ||
            sku.pointsPrice > maxSku.pointsPrice
          ) {
            maxSku = sku;
          }
        });

        this.minPointsPrice = {
          points: minSku.pointsPrice,
          price: minSku.remainPrice,
        };
        if (goodsSku.length > 1 && minSku.skuId !== maxSku.skuId) {
          this.maxPointsPrice = {
            points: maxSku.pointsPrice,
            price: maxSku.remainPrice,
          };
        }
      } else {
        // 没有 sku 的情况
        this.pointsPrice = activityInfo.pointsPrice;

        this.minPointsPrice = {
          points: activityInfo.pointsPrice,
          price: activityInfo.remainPrice,
        };
      }

      // 如果不允许单独购买，单sku默认选中类型为积分商城
      this.selectedSkuType = activityInfo.buyLimit ? 5 : 0;

      // 2. 设置底部按钮
      // 沿用现有逻辑：
      // bottomButton 组件会根据活动类型设置底部按钮文案
      // this.activityType = activityType;
      // this.activityInfo = activityInfo;

      // 3. 设置 sku 面板信息
      // 3.1 设置 sku 面板初始价格
      this.priceStr = `${this.minPointsPrice.points}${this.pointsName}`;
      if (this.minPointsPrice.price) { this.priceStr += `+${this.minPointsPrice.price / 100}元`; }
      if (this.maxPointsPrice.points) { this.priceStr += ` <span>~</span> ${this.maxPointsPrice.points}${this.pointsName}`; }
      if (this.maxPointsPrice.price) { this.priceStr += `+${this.maxPointsPrice.price / 100}元`; }
      // 3.2 设置sku面板初始的限兑数量
      this.showLimit = !!activityInfo.quotaNum;
      this.limit = activityInfo.quotaNum;
      // 3.2 计算所有sku价格、限兑数量、已兑数量
      this.pointsSkuInfo = goodsSku.reduce((obj, sku) => {
        let price = `${sku.pointsPrice}${this.pointsName}`;
        if (sku.remainPrice) price += `+${sku.remainPrice / 100}元`;

        obj[sku.skuId] = {
          price,
          pointsPrice: sku.pointsPrice,
          showLimit: !!activityInfo.quotaNum,
          limit: activityInfo.quotaNum,
          used: activityInfo.quotaUsed,
          stock_num:
            sku.exchangedNum >= sku.totalNum
              ? 0
              : sku.totalNum - sku.exchangedNum,
        };

        return obj;
      }, {});
      // 3.3 把计算好的数据赋给sku列表
      // 3.4 TODO: 确定是否需要更新按钮链接
      // 4 设置限购提示
    },

    // 处理拼团数据
    parseGrouponData(data = {}) {
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
      this.grouponInfo = {
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
        promotionType: 4,
      };
      this.activityInfo = this.grouponInfo;
      data = this.grouponInfo;
      this.courseActivityType = 'groupon';

      const tagName = data.promotionDetail.groupType ? '老带新' : '';
      this.isShowGroupon = +data.promotionDetail.status === 1;
      // 用户未达到限购，且用户未参加该活动，且活动允许展示凑团列表时，为true
      this.isShowGroupList =
        !this.cache.purchaseLimit &&
        !data.userStatus.status &&
        data.promotionDetail.isShowJoinGroup &&
        this.status === 1;
      this.tagName = `${data.promotionDetail.conditionNum}人团`;
      this.grouponPrice = {
        minPrice: data.promotionDetail.minPrice,
        maxPrice: data.promotionDetail.maxPrice,
        skuPrices: data.promotionDetail.skuPrices,
        price: data.promotionDetail.price,
      };
      if (this.isShowGroupon) {
        this.isShowActivityBanner = this.isShowGroupon;
        this.activityBannerInfo = {
          tagName: `${tagName}${data.promotionDetail.conditionNum}人团`,
          activityPrice:
            data.promotionDetail.minPrice === data.promotionDetail.maxPrice
              ? data.promotionDetail.minPrice
              : [data.promotionDetail.minPrice, data.promotionDetail.maxPrice],
          startAt: data.startAt,
          endAt: data.endAt,
        };
      }
    },

    parseLadderGroupOnData(data) {
      const startAt = data.startAt * 1000;
      const endAt = data.endAt * 1000;
      const { ladderPrice } = data;
      const ladderPriceMap = {};
      let maxPrice = 0;
      let minPrice = null;

      Object.keys(ladderPrice).forEach(key => {
        ladderPrice[key].forEach(sku => {
          if (sku.skuPrice > maxPrice) {
            maxPrice = sku.skuPrice;
          }
          if (!minPrice || sku.skuPrice < minPrice) {
            minPrice = sku.skuPrice;
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

      let status = 0;
      if (Date.now() > startAt) {
        status = 1;
      }
      if (Date.now() > endAt) {
        status = 2;
      }

      this.courseActivityType = 'groupon';
      this.grouponPrice = {
        minPrice,
        maxPrice,
        price: minPrice,
      };
      this.grouponInfo = {
        promotionType: 26,
        promotionId: data.activityId,
        promotionDetail: {
          ...data,
          groupList: data.onGoingGroupList,
          endAt,
          startAt,
          groupType: 2,
          minPrice,
          maxPrice,
          ladderPrice: ladderPriceMap,
          status,
        },
        userStatus: {
          status: data.joinedGroup ? 1 : 0,
          groupAlias: data.joinedGroup && data.joinedGroup.alias,
        },
      };
      this.activityInfo = this.grouponInfo;
      this.isShowGroupon = (Date.now() > data.startAt * 1000) && (Date.now() < data.endAt * 1000);
      this.isShowGroupList = !this.cache.purchaseLimit &&
        !this.grouponInfo.userStatus.status &&
        this.grouponInfo.promotionDetail.isShowJoinGroup && this.status === 1;
      this.isShowActivityBanner = this.isShowGroupon;
      this.activityBannerInfo = {
        tagName: '阶梯拼团',
        activityPrice: maxPrice === minPrice ? minPrice : [minPrice, maxPrice],
        startAt: data.startAt * 1000,
        endAt: data.endAt * 1000,
      };
    },

    // 处理推荐有奖的数据
    parseReferralData(data = []) {
      this.referralData = data[0];
      const newerSubsidyPrice = this.referralData.recommendPoliteCourse
        .newerSubsidyPriceMap;
      this.isPaid = this.referralData.recommendPoliteCourse.isPaid;
      this.referralData.isShowReferral =
        !!this.bid && !this.referralData.recommendPoliteCourse.isPaid;
      if (this.referralData.isShowReferral) {
        this.cache.originMinPrice = this.cache.sku.minPrice;
        this.cache.originMaxPrice = this.cache.sku.maxPrice;
        this.cache.sku.minPrice = this.referralData.recommendPoliteCourse.minNewerPrice;
        this.cache.sku.maxPrice = this.referralData.recommendPoliteCourse.maxNewerPrice;
        this.cache.minPrice = this.referralData.recommendPoliteCourse.minNewerPrice;
        this.cache.maxPrice = this.referralData.recommendPoliteCourse.maxNewerPrice;
        (this.cache.sku.list || []).forEach(item => {
          item.price = newerSubsidyPrice[item.id];
        });
      }
      this.activityInfo = this.referralData;
    },

    initEvaluateData() {
      API.getLastEvaluationApi({
        courseAlias: this.alias || '',
      })
        .then(res => {
          if (res && res.data) {
            const data = res.data || {};
            this.evaluate.count = data.count || 0;
            if (data.lastEvaluation && data.lastEvaluation.length > 0) {
              this.evaluate.lastEvaluation = formatEvaluationData(
                data.lastEvaluation || []
              );
            }
          }
        })
        .catch(() => {
          this.evaluate.count = 0;
        })
        .finally(() => {
          this.isShowEvaluate = true;
        });
    },

    initVisitGift() {
      // 发券宝组件
      if (showVisitGift) {
        // 发券宝
        inject(['shop-ad'], { isPure: 0 });
      }
    },

    // 处理课程已删除或课程已失效的情况
    handleNoCourse(type) {
      let str = '失效';
      switch (type) {
        case 'HAS_DELETE':
          str = '删除';
          break;
        case 'NO_COURSE':
          str = '失效';
          break;
      }
      this.isHasCourse = false;
      this.noCourseDesc = `课程已${str}，看看其他课程吧`;
      document.title = `课程已${str}`;
      this.isNotLoading = true;

      window._global.spm = { logType: 'cg', logId: 0 };
      this.getRecommand();
    },
    // 获取推荐的课程商品
    getRecommand() {
      getRecommandCourse()
        .then(({ data }) => (this.recommandData = data.content)) // eslint-disable-line
        .catch(err => Toast.fail(err));
    },
    // 处理轮播
    handleImageSwp(data = {}) {
      if (!data.product) {
        return;
      }
      const video = data.product.videoModel || {};
      const pictures = data.product.pictures || [];
      const {
        goodsVideo,
        goodsPictures,
        goodsPictureRatio,
      } = handleImageSwpData(video, pictures);

      this.goodsVideo = goodsVideo;
      this.goodsPictures = goodsPictures;
      this.goodsPictureRatio = goodsPictureRatio;
    },
    // 处理课程时间
    handleCourseTime() {
      //  如果不需要展示时间，则使 this.courseTime = '';
      const {
        validityPeriodUnit,
        validityPeriodType,
        validityPeriodRange,
        courseEffectiveDelayDays,
        courseSellType,
        courseEffectiveType,
        courseType,
        courseStartAt: startAt,
        courseEndAt: endAt,
      } = this.cache;

      // 生效时间描述
      const validStartDesc =
        COURSE_EFFECTIVE_DESC[courseEffectiveType] &&
        COURSE_EFFECTIVE_DESC[courseEffectiveType](courseEffectiveDelayDays);
      // 有效期描述
      const validPeriodDesc =
        VALID_PERIOD_DESC[validityPeriodType] &&
        VALID_PERIOD_DESC[validityPeriodType](
          validityPeriodRange,
          validityPeriodUnit
        );

      if (
        courseType === COURSE_TYPE.CASUAL ||
        courseSellType === COURSE_SELL_TYPE.DIY
      ) {
        if (startAt && endAt) {
          if (startAt === endAt) {
            this.courseTime = this.formatTime(startAt);
          } else {
            this.courseTime = `${this.formatTime(startAt)}-${this.formatTime(
              endAt
            )}`;
          }
          return;
        }
        if (startAt) {
          this.courseTime = `${this.formatTime(startAt)}`;
        }
      } else if (
        validityPeriodType === VALID_PERIOD_TYPE.FOREVER &&
        courseSellType !== COURSE_SELL_TYPE.DURATION
      ) {
        return (this.courseTime = '');
      } else if (courseSellType === COURSE_SELL_TYPE.COUNT) {
        return (this.courseTime = `${validStartDesc},${validPeriodDesc}`);
      } else if (courseSellType === COURSE_SELL_TYPE.DURATION) {
        return (this.courseTime = validStartDesc);
      } else if (courseSellType === COURSE_SELL_TYPE.SESSION) {
        return (this.courseTime = '');
      }
    },
    // 处理选择地址和课程逻辑
    handleChooseLabel(sku = {}, addressList = [], shopDetailInfo = {}) {
      // 1. 有sku，有addressList 弹出sku选择弹窗
      // 2. 有sku，无addressList 弹出sku选择弹窗
      // 3. 无sku，有addressList 跳转到上课地址列表页
      // 4. 无sku，无addressList 不显示
      // 单店
      if (isEduSingleStore) {
        if (sku.hasSku && sku.stockNum && addressList.length > 0) {
          this.showChooseLabel = true;
          this.chooseText = this.cache.chooseText = '选择';
          this.chooseContent = this.cache.chooseContent = '课程及查看上课地点';
          this.chooseType = 'HAS_SKU_ADDRESS';
          return;
        }
        if (sku.hasSku && sku.stockNum && addressList.length === 0) {
          this.showChooseLabel = true;
          this.chooseText = this.cache.chooseText = '选择';
          this.chooseContent = this.cache.chooseContent = '课程';
          this.chooseType = 'HAS_SKU';
          return;
        }
        if ((!sku.hasSku || !sku.stockNum) && addressList.length > 0) {
          this.showChooseLabel = true;
          this.chooseText = '查看';
          this.chooseContent = this.cache.chooseContent = '上课地点';
          this.chooseType = 'HAS_ADDRESS';
          return;
        }
        if ((!sku.hasSku || !sku.stockNum) && addressList.length === 0) {
          this.showChooseLabel = false;
          this.chooseType = 'NONE_SKU_ADDRESS';
        }
      } else {
        if (sku.hasSku && sku.stockNum && shopDetailInfo.longitude) {
          this.showChooseLabel = true;
          this.chooseText = this.cache.chooseText = '选择';
          this.chooseContent = this.cache.chooseContent = '课程及查看上课校区';
          this.chooseType = 'HAS_SKU_ADDRESS';
          return;
        }
        if (sku.hasSku && sku.stockNum && !shopDetailInfo.longitude) {
          this.showChooseLabel = true;
          this.chooseText = this.cache.chooseText = '选择';
          this.chooseContent = this.cache.chooseContent = '课程';
          this.chooseType = 'HAS_SKU';
          return;
        }
        if ((!sku.hasSku || !sku.stockNum) && shopDetailInfo.longitude) {
          this.showChooseLabel = true;
          this.chooseText = '查看';
          this.chooseContent = this.cache.chooseContent = '上课校区';
          this.chooseType = 'HAS_ADDRESS';
          return;
        }
        if ((!sku.hasSku || !sku.stockNum) && !shopDetailInfo.longitude) {
          this.showChooseLabel = false;
          this.chooseType = 'NONE_SKU_ADDRESS';
        }
      }
    },
    // 处理服务信息
    handleServiceInfo(servicePledge = 0) {
      this.servicePledge = servicePledge;
      if (servicePledge === 1) {
        this.serviceMessage = '该课程购买成功后，不需预约到店即可体验';
      } else if (servicePledge === 2) {
        this.serviceMessage = '该课程购买成功后，需要等待商家确认';
      }
    },
    // 处理导航栏
    handleNav(data) {
      if (data.course.applyUser) {
        this.navList.push('介绍');
      }
      if (data.course.teacherList && data.course.teacherList.length > 0) {
        this.navList.push('老师');
      }
      if (
        data.course.directory &&
        data.course.directory.directoryList &&
        data.course.directory.directoryList.length > 0
      ) {
        this.navList.push('目录');
      }
      if (data.course.intro) {
        this.navList.push('详情');
      }
    },
    // 处理老师列表
    handleTeacherList(teacherList = []) {
      this.teacherList = teacherList.slice(0, 3);
      this.teacherTitle = `主讲老师 (${this.cache.teacherList.length})`;
    },
    // 底部提示
    handleBottomMessage() {
      // 达到商品限购或者活动限购时提示
      const { quota, quotaUsed, isAllowContinueBuy } = this.activityQuota;
      if (
        this.cache.purchaseLimit ||
        (+quota > 0 && +isAllowContinueBuy === 0 && +quotaUsed >= +quota)
      ) {
        // 达到限购
        this.bottomMessage = `你已超过购买次数限制（${
          this.cache.purchaseLimit ? this.cache.quota : quota
        }次）`;
        return;
      }
      if (this.status === 3) {
        // 停止销售
        this.bottomMessage = '课程停止报名了，看看其他课程吧';
        return;
      }
      if (this.status === 2) {
        // 已告罄
        this.bottomMessage = '报名人数已满，看看其他课程吧';
        return;
      }
      if (this.status === 0) {
        // 已删除
        this.bottomMessage = '课程已经失效了，看看其他课程吧';
        return;
      }
      if (this.activityType === 'seckill') {
        const {
          beginAt,
          endAt,
          isCheckRight,
          currentStock,
          isUserBooking,
          isUserRemind,
        } = this.activityInfo;
        const now = new Date();
        // 未开始
        if (now < new Date(beginAt) && now < new Date(endAt)) {
          // 开启秒杀预约
          if (isCheckRight) {
            // 已预约
            if (isUserBooking) {
              this.bottomMessage =
                '你已成功预约，活动暂未开始，但也可以原价购买';
            }
          } else {
            // 已提醒
            if (isUserRemind) {
              this.bottomMessage =
                '你已设置提醒，活动暂未开始，但也可以原价购买';
            }
          }
        }
        // 已开始
        if (new Date(beginAt) < now && now < new Date(endAt)) {
          if (currentStock) {
            // 开启秒杀预约
            if (isCheckRight) {
              // 已预约
              if (isUserBooking) {
              } else {
                this.bottomMessage =
                  '你未预约此活动，无法参与秒杀，下次记得预约哦';
              }
            }
          } else {
            this.bottomMessage = '秒杀价课程已售磬，你可以原价购买';
          }
        }
        // 已结束
        if (new Date(endAt) < now) {
          this.bottomMessage = '秒杀活动已结束，你还可以原价进行购买';
        }
        return;
      }
      if (this.status === 1) {
        return;
      }
      if (
        this.cache.timingPublishAt &&
        new Date() < new Date(this.cache.timingPublishAt.replace(/-/gi, '/'))
      ) {
        // 未开始，倒计时
        this.countDown();
      }
    },
    // 选择课程
    onChooseCourse() {
      if (
        this.chooseType === 'HAS_SKU_ADDRESS' ||
        this.chooseType === 'HAS_SKU'
      ) {
        // 弹出sku弹窗
        if (this.activityType === 'seckill') {
          this.onShowSku(4);
        } else {
          this.onShowSku(this.selectedSkuType);
        }
        // 添加选择课程埋点
        this.$log('select_sku');
        return;
      }
      if (this.chooseType === 'HAS_ADDRESS') {
        // 跳转上课地点列表
        // 添加查看上课地点埋点
        this.$log('view_address');
        // 点击地址的时候，先获取用户的位置
        if (isEduSingleStore) {
          const storeIds = JSON.stringify(this.storeIds) || '[]';
          getUserPosition()
            .then(res => {
              // 跳转到地址列表页
              const latitude = res.latitude || 0;
              const longitude = res.longitude || 0;
              SafeLink.redirect({
                url: `/wscvis/edu/address-list?latitude=${latitude}&longitude=${longitude}&storeIds=${storeIds}&kdt_id=${this.kdtId}`,
                kdtId: this.kdtId,
              });
            })
            .catch(() => {
              // 用户拒绝授权或获取用户地址失败，则不传当前的地址信息
              SafeLink.redirect({
                url: `/wscvis/edu/address-list?storeIds=${storeIds}&kdt_id=${this.kdtId}`,
                kdtId: this.kdtId,
              });
            });
        } else {
          const shopDetailInfo = this.shopDetailInfo;
          if (shopDetailInfo.longitude) {
            SafeLink.redirect({
              url: `/wscvis/edu/map?kdt_id=${window._global.kdt_id}&longitude=${shopDetailInfo.longitude}
              &latitude=${shopDetailInfo.latitude}&province=${shopDetailInfo.province}&city=${shopDetailInfo.city}
              &district=${shopDetailInfo.district}&address=${shopDetailInfo.address}`,
              kdtId: window._global.kdt_id,
            });
          }
        }
      }
    },
    // 无课程的时候，点击跳转到店铺主页
    onGoShop() {
      // 进店逛逛埋点
      this.$log('return_shop_home');
      navigateEnv();
    },
    // 弹出老师列表弹窗
    onShowTeacherListModal() {
      // 查看全部老师埋点
      this.$log('view_all_teachers');
      this.showTeacherListModal = true;
    },
    // 点击老师，跳转到老师列表
    onGoTeacherDetail(id) {
      // 点击老师埋点
      this.$log('view_teacher', {
        teacher_id: id,
      });
      SafeLink.redirect({
        url: `/wscvis/edu/master-detail?kdt_id=${this.kdtId}&teacherId=${id}&alias=${this.alias}`,
        kdtId: this.kdtId,
      });
    },

    // 跳转到评价页面
    onGoEvaluatePage() {
      if (this.evaluate.count > 0) {
        SafeLink.redirect({
          url: `https://h5.youzan.com/wscvis/edu/evaluation-list?kdt_id=${this.kdtId}&courseAlias=${this.alias}`,
          kdtId: this.kdtId,
        });
      }
    },
    // 跳转到锁定页面
    onGoLockPage() {
      SafeLink.redirect({
        url: `/wscvis/lock?alias=${this.alias}&kdt_id=${this.kdtId}`,
        kdtId: this.kdtId,
      });
    },
    // 清除下单时候的缓存， 之后可能会去掉
    clearSessionStorage() {
      sessionStorage.removeItem('selectedDate');
      sessionStorage.removeItem('selectedAddressItem');
      sessionStorage.removeItem('checkedStudent');
    },
    // 设置分享
    setShareConfig(config) {
      const video = config.video || {};
      const pictures = config.pictures || [];
      const cover = video.coverUrl ? video.coverUrl : pictures[0].url;
      this.cover = cover;
      const sls = salesmanInfo.seller || '';
      const activityType = Args.get('activityType');
      sls && (this.shareUrl = this.shareUrl + `&sls=${sls}`);
      if (activityType === 'seckill') {
        this.shareUrl = `${this.shareUrl}&activityType=seckill&ump_type=seckill&ump_alias=${this.umpAlias}`;
      }

      setShareData({
        title: config.title || '',
        desc: config.desc || '我发现了一门好课程，分享给你',
        link: getShareLink(this.shareUrl),
        cover,
        timeline_title: `${config.title || ''}`,
        weappPath: `/packages/edu/webview/index?targetUrl=${encodeURIComponent(
          this.shareUrl
        )}`,
      }).catch(() => {});
    },
    countDown() {
      const timingPublishAt = this.cache.timingPublishAt.replace(/-/gi, '/');
      const currentTime = new Date().getTime();
      const publishTime = new Date(timingPublishAt).getTime();
      let leftTime = parseInt((publishTime - currentTime) / 1000, 10); // 精确到秒

      const timer = setInterval(() => {
        const date = Math.floor(leftTime / (60 * 60 * 24));
        const hour = Math.floor((leftTime - date * 24 * 60 * 60) / 3600);
        const min = Math.floor(
          (leftTime - date * 24 * 60 * 60 - hour * 3600) / 60
        );
        const sec = Math.floor(
          leftTime - date * 24 * 60 * 60 - hour * 3600 - min * 60
        );
        leftTime--;
        if (date) {
          this.bottomMessage = `距开始报名还剩${date}天${hour}时${min}分${sec}秒`;
          return;
        }
        if (hour) {
          this.bottomMessage = `距开始报名还剩${hour}时${min}分${sec}秒`;
          return;
        }
        if (min) {
          this.bottomMessage = `距开始报名还剩${min}分${sec}秒`;
          return;
        }
        if (sec) {
          this.bottomMessage = `距开始报名还剩${sec}秒`;
          return;
        }
        if (!date && !hour && !min && !sec) {
          this.bottomMessage = '';
          this.status = 1;
          clearInterval(timer);
          this.$forceUpdate();
        }
      }, 1000);
    },
    formatTime(time) {
      const date = new Date(time.replace(/-/gi, '/'));
      const year = date.getFullYear();
      const month =
        date.getMonth() >= 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
      const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;

      return `${year}.${month}.${day}`;
    },
    sendIncreaseQrScanNum() {
      if (this.templateId) {
        API.increaseQrScanNum({
          templateId: this.templateId,
        })
          .then(data => {
            console.log('扫码', data);
          })
          .catch(err => {
            console.warn(err);
          });
      }
    },

    onCloseSkuPromotionPop() {
      this.isShowSkuPromotionPop = false;
    },
  },
};
</script>

<style lang="scss">
@import "mixins/index.scss";

.prod-detail-container {
  background: #f7f8fa;
  /* padding-bottom: 70px; */
  &__no-course {
    margin: 50px 0 0;
  }

  &__promotion {
    &-title {
      position: relative;
    }
  }

  &__sold-num {
    padding-top: 12px;
    font-size: 12px;
    color: #323233;
    line-height: 16px;
  }

  .sku-stock {
    color: #969799;
  }

  .choose-sku-content {
    height: 44px;
    overflow: hidden;
    padding-right: 32px;

    @include ellipsis;
  }

  .vis-activity-banner {
    margin: 0;

    &__date {
      .cap-countdown {
        font-size: 12px;
        color: #fff;

        &__day,
        &__hour,
        &__minute,
        &__second {
          background-color: rgba(0, 0, 0, 0.5);
        }

        &__day {
          background-color: transparent;
        }
      }
    }
  }

  .van-icon_certificate {
    display: flex;
    align-items: center;
    margin-right: 4px;
  }

  .course-svg {
    width: 16px;
    height: 16px;
    margin-right: 4px;
    margin-top: -2px;
  }

  .column-center {
    display: flex;
    align-items: center;
  }

  .label-van-label-right {
    display: flex;
    align-items: center;
  }

  .edu-content-desc {
    padding: 12px 0 2px;
  }

  .points-price {
    margin-top: 3px;
    margin-left: 1px;
    margin-bottom: 4px;
    line-height: 16px;
    font-size: 12px;
    color: #969799;
  }

  .has-top {
    top: 48px;
  }
}
body {
  padding-bottom: 70px;
  background-color: #f7f8fa;
}
.is-iphonex {
  padding-bottom: 100px;
}
.price-box {
  position: relative;
  width: 100%;
  .sold-num {
    position: absolute;
    top: 50%;
    right: 8px;
    font-size: 12px;
    color: #666;
    text-align: center;
    line-height: 16px;
    margin: -8px;
  }
}
.course-info {
  padding: 16px 16px 16px 0 !important;
  font-size: 14px;
  color: #333;
  line-height: 17px;
  min-height: 200px;

  img,
  video {
    width: 100%;
  }
}
.no-course {
  /* padding: 150px 0; */
  .btn {
    padding: 7px 22px;
    border: 1px solid #666;
    border-radius: 22px;
    font-size: 14px;
    text-align: center;
    line-height: 16px;
  }
  .btn-goShop {
    margin-bottom: 54px;
    display: inline-block;
    border: 1px solid #f44;
    color: #f44;
  }
}
.prod-detail-container-loading {
  width: 100%;
  height: 100%;
  .van-loading--white {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 10px;
    border-radius: 3px;
    background-color: rgba(0, 0, 0, 0.5);
  }
}
.footer,
.footer .copyright {
  background-color: #f7f8fa;
}

.van-toast {
  z-index: 3000 !important;
}

.sku-promotion-pop {
  height: 450px;

  .title {
    position: relatvie;
    height: 38px;
    line-height: 38px;
    font-weight: 500;
    font-size: 17px;
    text-align: center;

    .vis-icon {
      position: absolute;
      right: 15px;
      top: 11px;
    }
  }
}
/* 覆盖组件样式 */
.icon__send-coupon {
  bottom: 145px !important;
}
</style>
