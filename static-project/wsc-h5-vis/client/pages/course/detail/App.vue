
<template>
  <div class="page-detail" :style="{ width: `${pageWidth}px` }">
    <div class="module-top">
      <component
        :is="item.type"
        v-for="item in layoutTop"
        :key="item.type"
      />
    </div>
    <div class="module-pic">
      <component
        :is="item.type"
        v-for="item in layoutPic"
        :key="item.type"
      />
    </div>
    <div class="module-main">
      <component
        :is="item.type"
        v-for="item in layoutMain"
        :key="item.type"
      />
    </div>
    <div class="module-bottom">
      <component
        :is="item.type"
        v-for="item in layoutBottom"
        :key="item.type"
      />
    </div>
  </div>
</template>

<script>
import { ZNB } from '@youzan/wxsdk';
import LogPointVue from '@youzan/log-point-vue';
import compareVersions from '@youzan/utils/string/compareVersions';
import args from '@youzan/utils/url/args';
import { addSalesmanParams } from '@youzan/salesman-params-handler';
import { appendLogParamsTo } from 'pct/utils';
import { GOODS_TYPE_TO_SPM } from '@/constants/course/goods-type';
import { getSafeUrl } from '@/common/utils/custom-safe-link';
import { getColumnsPermission } from '@/common-api/utils';
import asyncComponentLoader from './common/async-component-loader';
import { getDefaultLogParams } from './store';
import log from './utils/log';
import { resetTrackState } from './track-list';

// 首屏基础信息组件直接打包，其他组件自行斟酌是否走chunk
import CampusSwitchBlock from './blocks/top/campus-switch-block';

import ImageBlock from './blocks/pic/image-block';
import PctImageBlock from './blocks/pic/pct-image-block';

import BaseInfoBlock from './blocks/main/base-info-block';
import PromotionBlock from './blocks/main/promotion-block';
import TuitionBlock from './blocks/main/tuition-block';
import ServiceBlock from './blocks/main/service-block';
import SkuBlock from './blocks/main/sku-block';
import CourseEvaluateBlock from './blocks/main/course-evaluate-block';
import CourseTabBlock from './blocks/main/course-tab-block';
import ColumnTabBlock from './blocks/main/column-tab-block';
import IntroBlock from './blocks/main/intro-block';
import ApplyUserBlock from './blocks/main/apply-user-block';
import PriceDescBlock from './blocks/main/price-desc-block';
import ColumnCatalogueBlock from './blocks/main/column-catalogue-block';
import JoinGroupBlock from './blocks/main/join-group-block';
import ColumnEntryBlock from './blocks/main/column-entry-block';
import { CourseExamBlock } from 'supv/examination/modules/course-exam';

import SubmitBlock from './blocks/bottom/submit-block';

/* eslint-disable comma-dangle */
const PreviewQrcodeBlock = asyncComponentLoader(
  () => import(
    // webpackChunkName: 'preview-qrcode-block'
    './blocks/top/preview-qrcode-block'
  ),
  'preview-qrcode-block',
);
const TradeCarouselBlock = asyncComponentLoader(
  () => import(
    // webpackChunkName: 'trade-carousel-block'
    './blocks/top/trade-carousel-block'
  ),
  'trade-carousel-block',
);
const VisitGiftBlock = asyncComponentLoader(
  () => import(
    // webpackChunkName: 'visit-gift-block'
    './blocks/top/visit-gift-block'
  ),
  'visit-gift-block',
);
const GiftReceiveBlock = asyncComponentLoader(
  () => import(
    // webpackChunkName: 'gift-receive-block'
    './blocks/top/gift-receive-block'
  ),
  'gift-receive-block',
);
const ColumnUpdateNoticeBlock = asyncComponentLoader(
  () => import(
    // webpackChunkName: 'column-update-notice-block'
    './blocks/top/column-update-notice-block'
  ),
  'column-update-notice-block',
);
const PackageBuyBlock = asyncComponentLoader(
  () => import(
    // webpackChunkName: 'package-buy-block'
    './blocks/main/package-buy-block'
  ),
  'package-buy-block',
);
const TeacherListBlock = asyncComponentLoader(
  () => import(
    // webpackChunkName: 'teacher-list-block'
    './blocks/main/teacher-list-block'
  ),
  'teacher-list-block',
);
const DirectoryListBlock = asyncComponentLoader(
  () => import(
    // webpackChunkName: 'directory-list-block'
    './blocks/main/directory-list-block'
  ),
  'directory-list-block',
);
const BuyNoticeBlock = asyncComponentLoader(
  () => import(
    // webpackChunkName: 'buy-notice-block'
    './blocks/main/buy-notice-block'
  ),
  'buy-notice-block',
);
const ColumnFreeBlock = asyncComponentLoader(
  () => import(
    // webpackChunkName: 'column-free-block'
    './blocks/main/column-free-block'
  ),
  'column-free-block',
);
const GroupSignBlock = asyncComponentLoader(
  () => import(
    // webpackChunkName: 'group-sign-block'
    './blocks/main/group-sign-block'
  ),
  'group-sign-block',
);
const NextContentBlock = asyncComponentLoader(
  () => import(
    // webpackChunkName: 'next-content-block'
    './blocks/main/next-content-block'
  ),
  'next-content-block',
);
const RecommendsGoodsBlock = asyncComponentLoader(
  () => import(
    // webpackChunkName: 'recommends-goods-block'
    './blocks/main/recommends-goods-block'
  ),
  'recommends-goods-block',
);
const CommentBlock = asyncComponentLoader(
  () => import(
    // webpackChunkName: 'comment-block'
    './blocks/main/comment-block'
  ),
  'comment-block',
);
const UmpBlock = asyncComponentLoader(
  () => import(
    // webpackChunkName: 'ump-block'
    './blocks/main/ump-block'
  ),
  'ump-block',
);
const GroupBuyBlock = asyncComponentLoader(
  () => import(
    // webpackChunkName: 'group-buy-block'
    './blocks/main/group-buy-block'
  ),
  'group-buy-block'
);
const PresentBlock = asyncComponentLoader(
  () => import(
    // webpackChunkName: 'present-block'
    './blocks/main/present-block'
  ),
  'present-block',
);
const ShareBlock = asyncComponentLoader(
  () => import(
    // webpackChunkName: 'share-block'
    './blocks/main/share-block'
  ),
  'share-block',
);
const LiveGuideBlock = asyncComponentLoader(
  () => import(
    // webpackChunkName: 'live-guide-block'
    './blocks/bottom/live-guide-block'
  ),
  'live-guide-block'
);
const PopupBlock = asyncComponentLoader(
  () => import(
    // webpackChunkName: 'popup-block'
    './blocks/main/popup-block'
  ),
  'popup-block'
);

export default {

  components: {
    PreviewQrcodeBlock,
    CampusSwitchBlock,
    TradeCarouselBlock,
    VisitGiftBlock,
    GiftReceiveBlock,
    ColumnUpdateNoticeBlock,

    ImageBlock,
    PctImageBlock,

    UmpBlock,
    BaseInfoBlock,
    GroupBuyBlock,
    PromotionBlock,
    ServiceBlock,
    SkuBlock,
    PackageBuyBlock,
    CourseEvaluateBlock,
    CourseTabBlock,
    ApplyUserBlock,
    TeacherListBlock,
    DirectoryListBlock,
    IntroBlock,
    BuyNoticeBlock,
    PriceDescBlock,
    ColumnTabBlock,
    JoinGroupBlock,
    ColumnFreeBlock,
    ColumnCatalogueBlock,
    ColumnEntryBlock,
    CourseExamBlock,
    GroupSignBlock,
    NextContentBlock,
    RecommendsGoodsBlock,
    CommentBlock,
    PresentBlock,
    ShareBlock,

    LiveGuideBlock,
    SubmitBlock,
    TuitionBlock,
    PopupBlock,
  },
  data() {
    return {
      count: 0,
    };
  },

  rootState: [
    'design',
    'goodsType',
    'goodsData',
    'env',
    'kdtId',
    'salesmanInfo',
    'onlineCourseCollectSetting',
    'shareInfo',
    'activityTypes',
    'activityDataMap',
    'priorActivityType',
  ],
  rootGetters: [
    'pageWidth',
    'isImageText',
    'isLive',
    'isContent',
    'isColumn',
    'needCollectInfo',
  ],

  computed: {
    layoutTop() {
      return this.design.top;
    },

    layoutPic() {
      return this.design.pic;
    },

    layoutMain() {
      return this.design.main;
    },

    layoutBottom() {
      return this.design.bottom;
    },
  },

  watch: {
    '$route.params'(params) {
      // 重置track的状态
      $track.resetTasks();
      resetTrackState();
      this.$rootDispatch('pageUpdate', params.alias);
    },

    'goodsData.alias'() {
      LogPointVue.setOption({
        defaultParams: getDefaultLogParams(),
      });
      _global.spm = {
        logType: GOODS_TYPE_TO_SPM[this.goodsType],
        logId: this.goodsData.goodsId,
      };
      log({
        et: 'display',
        ei: 'enterpage',
        en: '浏览页面',
      });
      this.$tab.reset();
      this.ImageTextLog();
      this.liveLimit();
      this.initWXSdk();
      this.initTrackData();
    },

    'onlineCourseCollectSetting.alias'() {
      if (this.isLive || this.isColumn) {
        this.$rootDispatch('reCalcActivityData');
      }
    }
  },

  created() {
    this.ImageTextLog();
    this.liveLimit();
    this.initWXSdk();
  },

  mounted() {
    this.initTrackData();

    if (this.needCollectInfo) {
      this.$rootDispatch('fetchCollectInfo', this.goodsData.alias);
    }
  },

  methods: {
    async initTrackData() {
      this.$track.resetStore();
      this.$track.resetTasks();
      if (this.isContent) {
        // 埋点额外信息，当页面加载完成之后收集用户是否有权限
        // 以及如果该内容属于某个专栏，应该带上parent_alias
        // 判断是否有权限
        const goodsData = this.goodsData;
        // 先设置parentAlias
        const parentAlias = goodsData.column.alias;
        if (parentAlias) {
          try {
            // 如果商品在专栏下，需要额外查询专栏是否有权限
            this.$track.collect('parentAlias', goodsData.column.alias);
            const { isOwnAsset } = await getColumnsPermission(parentAlias);
            this.$track.collect('hasParentPermission', Number(isOwnAsset));
          } catch (err) {
            console.error('查询专栏权限出错');
            console.error(err);
            this.$track.collect('hasParentPermission', 0);
          }
        }
        this.$track.collect('mediaType', goodsData.mediaType);
        this.$track.collect('goodsId', goodsData.goodsId);
        this.$track.collect('goodAlias', goodsData.alias);
        this.$track.collect('initGoodsInfo', goodsData !== undefined);
        // 最后再设置内容所有权
        const hasPermission = goodsData.isOwnAsset || false;
        this.$track.collect('hasPermission', Number(hasPermission));
      } else {
        this.$track.collect('hasPermission', 0);
      }
      // detail enter收集
      this.$track.collect('is_own', this.goodsData.isOwnAsset);
      this.$track.collect('media_type', this.goodsData.mediaType);
      this.$track.collect('prior_activity', this.priorActivityType);
      this.$track.collect('activity_list', this.activityTypes);
      try {
        const lightActivityDataMap = {};
        Object.keys(this.activityDataMap).forEach(key => {
          const aItem = this.activityDataMap[key];
          lightActivityDataMap[key] = Object.keys(aItem).reduce((r, e) => {
            if (typeof aItem[e] !== 'object') r[e] = aItem[e];
            return r;
          }, {});
        });
        this.$track.collect('activity_data', lightActivityDataMap);
      } catch (error) {
        this.$track.collect('activity_data', {});
      }

      // 图文内容，在初始化完成后上报一次进度
      // 解决在图文内容过短时，丢失进度的问题
      this.$track.runDisplayTasks();
    },
    ImageTextLog() {
      if (this.isImageText && this.goodsData.isOwnAsset) {
        log({
          et: 'custom',
          ei: 'paid_enterpage',
          en: '购买后浏览页面',
        });
      }
    },

    liveLimit() {
      const LIMIT_WEAPP_VERSION = '2.46.8';
      if (this.isLive) {
        const { isWeapp, weappVersion } = this.env;
        if (isWeapp && weappVersion && compareVersions(weappVersion, LIMIT_WEAPP_VERSION) >= 0) {
          ZNB.navigate({
            weappUrl: '/packages/paidcontent/live/index',
          });
        }
      }
    },

    initWXSdk() {
      let shareUrl = getSafeUrl({
        url: `/wscvis/course/detail/${this.goodsData.alias}`,
        kdtId: this.kdtId,
      });
      const sls = this.salesmanInfo.seller;
      if (sls) {
        shareUrl = addSalesmanParams({
          url: shareUrl,
          kdtId: this.kdtId,
          sls,
        });
      }

      const umpType = args.get('ump_type');
      const umpAlias = args.get('ump_alias') || args.get('ump_alias_bak');
      if (umpType && umpAlias) {
        shareUrl = args.add(shareUrl, {
          ump_type: umpType,
          ump_alias: umpAlias,
        });
      }

      ZNB.configShare({
        link: appendLogParamsTo(shareUrl),
        ...this.shareInfo,
      });
      ZNB.init({
        kdtId: _global.kdt_id,
        wxOpenTagList: ['wx-open-audio'],
      });
    },
  },
};
</script>

<style lang="scss">
.page-detail {
  margin: 0 auto;

  // 😂
  .van-cell {
    padding: 10px 12px 10px 16px;
  }
}

.module-pic {
  position: relative;
}
</style>
