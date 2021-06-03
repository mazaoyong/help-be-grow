<template>
  <div class="vip-container">
    <div class="vip-header">
      <detail-cover :cover-url="benefitInfo.cover" />

      <div class="vip-header__content">
        <h2 class="vip-header__title">
          {{ benefitInfo.name }}
        </h2>
        <p class="vip-header__summary">
          {{ benefitInfo.summary }}
        </p>
        <p v-if="isShowUpdateTip" class="vip-header__content-num">
          <span class="vip-header__content-num-label">更新</span>
          <span>已更新{{ tip }}</span>
        </p>
        <!-- <p
          v-if="isNormalVip"
          class="vip-header__show-detail"
          @click="onClickShowDetail"
        >
          查看详情 >
        </p> -->
      </div>
    </div>

    <!-- 未开通会员，分tab展示 -->
    <van-tabs
      v-if="benefitInfo.name"
      v-model="activeTab"
      class="vip-tab common-tab-style"
      line-width="40"
    >
      <van-tab title="详情" :name="0">
        <div
          v-if="benefitInfo.description"
          class="vip-tab__desc custom-richtext"
          v-html="benefitInfo.description"
        />
        <div v-else class="vip-tab__desc custom-richtext">
          还没有设置会员权益详情哦
        </div>
      </van-tab>
      <van-tab title="目录" :name="1">
        <show-more-list
          v-if="columnTotal"
          :total="columnTotal"
          :finished="columnFinished"
          title="专栏"
          @show-more="onClickShowmore('column')"
        >
          <column-item
            v-for="item in columnList"
            :key="item.alias"
            :item="item"
            :is-paid="!!benefitInfo.isUserTaken"
          />
        </show-more-list>
        <show-more-list
          v-if="contentTotal"
          :total="contentTotal"
          :finished="contentFinished"
          title="内容"
          @show-more="onClickShowmore('content')"
        >
          <content-item
            v-for="item in contentList"
            :key="item.alias"
            :item="item"
            :is-paid="(benefitInfo.isUserTaken && (benefitInfo.card || {}).status === 0)
              || (item.buyStatus && !!item.buyStatus.isBought)"
          />
        </show-more-list>
        <show-more-list
          v-if="liveTotal"
          :total="liveTotal"
          :finished="liveFinished"
          title="直播"
          @show-more="onClickShowmore('live')"
        >
          <live-item
            v-for="item in liveList"
            :key="item.alias"
            :item="item"
            :is-paid="(benefitInfo.isUserTaken && (benefitInfo.card || {}).status === 0)
              || (item.buyStatus && !!item.buyStatus.isBought)"
          />
        </show-more-list>
      </van-tab>
    </van-tabs>

    <!-- 已开通会员，去掉tab展示 -->
    <!-- <template v-else-if="benefitInfo.name">
      <show-more-list
        v-if="columnTotal"
        :total="columnTotal"
        :finished="columnFinished"
        title="专栏"
        @show-more="onClickShowmore('column')"
      >
        <column-item
          v-for="item in columnList"
          :key="item.alias"
          :item="item"
          :is-paid="!!benefitInfo.isUserTaken"
        />
      </show-more-list>
      <show-more-list
        v-if="contentTotal"
        :total="contentTotal"
        :finished="contentFinished"
        title="内容"
        @show-more="onClickShowmore('content')"
      >
        <content-item
          v-for="item in contentList"
          :key="item.alias"
          :item="item"
          :is-paid="(benefitInfo.isUserTaken && (benefitInfo.card || {}).status === 0)
            || (item.buyStatus && !!item.buyStatus.isBought)"
        />
      </show-more-list>
      <show-more-list
        v-if="liveTotal"
        :total="liveTotal"
        :finished="liveFinished"
        title="直播"
        @show-more="onClickShowmore('live')"
      >
        <live-item
          v-for="item in liveList"
          :key="item.alias"
          :item="item"
          :is-paid="(benefitInfo.isUserTaken && (benefitInfo.card || {}).status === 0)
            || (item.buyStatus && !!item.buyStatus.isBought)"
        />
      </show-more-list>
    </template> -->

    <van-goods-action
      v-if="isNotIosWeapp && benefitInfo.name && !isNormalVip"
      class="vip-btn"
    >
      <van-goods-action-button
        class="main-btn"
        :disabled="actionButtonInfo.disabled"
        @click="onClickOpenVip"
      >
        {{ actionButtonInfo.text }}
      </van-goods-action-button>
    </van-goods-action>
  </div>
</template>

<script>
import {
  Tab,
  Tabs,
  Toast,
  GoodsAction,
  GoodsActionButton,
} from 'vant';
import $ from 'zepto';
import { setShareData, ZNB } from '@youzan/wxsdk';
import checkFansBuy from '@/common/utils/checkFansBuy';
import UA from '@youzan/utils/browser/ua_browser';
import apis from 'pct/api';
import ShowMoreList from './components/ShowMoreList';
import ColumnItem from './components/ColumnItem';
import ContentItem from './components/ContentItem';
import LiveItem from './components/LiveItem';
import mixinVisPage from 'common/mixins/mixin-vis-page';
import DetailCover from 'pct/components/DetailCover';
import * as SafeLink from '@youzan/safe-link';

const { miniprogram = {} } = _global;
const isWeapp = miniprogram.isWeapp;
const activeTabMap = {
  desc: 0,
  list: 1,
};

export default {
  name: 'vip-benefit',

  config: {
    title: '知识付费会员',
  },

  components: {
    'van-tab': Tab,
    'van-tabs': Tabs,
    'van-goods-action': GoodsAction,
    'van-goods-action-button': GoodsActionButton,
    ShowMoreList,
    ColumnItem,
    DetailCover,
    ContentItem,
    LiveItem,
  },

  mixins: [mixinVisPage],

  data() {
    return {
      benefitInfo: {},
      columnList: [],
      contentList: [],
      liveList: [],

      // 请求相关
      columnPageNum: 1,
      columnPageSize: 10,
      columnLoading: false,
      columnFinished: false,
      columnTotal: 0,
      contentPageNum: 1,
      contentPageSize: 10,
      contentLoading: false,
      contentFinished: false,
      contentTotal: 0,
      livePageNum: 1,
      livePageSize: 10,
      liveLoading: false,
      liveFinished: false,
      liveTotal: 0,

      activeTab: activeTabMap.desc,
    };
  },

  computed: {
    actionButtonInfo() {
      const card = this.benefitInfo.card || {};
      if (this.benefitInfo.isUserTaken && card.status === 0) {
        return {
          show: false,
        };
      } else if (card.status === 0 || card.status === 1) {
        // 非vip或者vip已过期，都提示去开通
        return {
          show: true,
          disabled: false,
          text: '开通会员',
        };
      } else if (card.status === 2) {
        // status 2: 已禁用
        return {
          show: true,
          disabled: true,
          text: '会员权益已禁用',
        };
      } else {
        // 尚未关联会员卡
        return {
          show: true,
          disabled: true,
          text: '暂不支持开通会员',
        };
      }
    },
    isNormalVip() {
      return (this.benefitInfo.isUserTaken &&
        (this.benefitInfo.card || {}).status === 0);
    },
    headerImgHeight() {
      return parseInt(window.innerWidth > 600 ? 375 * 9 / 16 : window.innerWidth * 9 / 16);
    },
    isShowUpdateTip() {
      const { benefitInfo } = this;
      return benefitInfo.contentCount > 0 || benefitInfo.columnCount > 0 || benefitInfo.liveCount > 0;
    },
    tip() {
      const { benefitInfo } = this;
      const tipArr = [];
      if (benefitInfo.contentCount > 0) {
        tipArr.push(`${benefitInfo.contentCount}篇内容`);
      }
      if (benefitInfo.columnCount > 0) {
        tipArr.push(`${benefitInfo.columnCount}篇专栏`);
      }
      if (benefitInfo.liveCount > 0) {
        tipArr.push(`${benefitInfo.liveCount}篇直播`);
      }

      return tipArr.join('、');
    },

    isNotIosWeapp() {
      return !(UA.isIOS() && isWeapp);
    },
  },

  created() {
    this.getBenefitInfo();
    this.getContentList();
    this.getCulumnList();
    this.getLiveList();
    $('body').css({ paddingBottom: '50px' });
  },

  methods: {
    // 获取权益简介
    getBenefitInfo() {
      apis.getVipBenefit({
        alias: this.$route.query.alias || '',
      }).then(data => {
        this.benefitInfo = data;
        // 底部按钮留空
        if (!this.isNormalVip) {
          $('body').css({ paddingBottom: '50px' });
        } else {
          $('body').css({ paddingBottom: 0 });
          this.activeTab = activeTabMap.list;
        }
        // 修改分享内容
        setShareData({
          notShare: true,
        });
      }).catch((errMsg) => {
        Toast(errMsg || `获取会员权益简介失败,请稍后再试!`);
        console.warn(errMsg);
      });
    },
    // 获取专栏列表
    getCulumnList() {
      apis.getBenefitItems({
        alias: this.$route.query.alias || '',
        pageNumber: this.columnPageNum,
        pageSize: this.columnPageSize,
        type: 1,
      }).then(data => {
        this.columnList = this.columnList.concat(data.content);
        this.columnPageNum++;
        this.columnTotal = data.total;
        if (this.columnList.length >= data.total) {
          this.columnFinished = true;
        }
      }).catch((errMsg) => {
        Toast(errMsg || `获取会员权益专栏列表失败,请稍后再试!`);
        console.warn(errMsg);
      });
    },
    // 获取内容列表
    getContentList() {
      apis.getBenefitItems({
        alias: this.$route.query.alias || '',
        pageNumber: this.contentPageNum,
        pageSize: this.contentPageSize,
        type: 2,
      }).then(data => {
        this.contentList = this.contentList.concat(data.content);
        this.contentPageNum++;
        this.contentTotal = data.total;
        if (this.contentList.length >= data.total) {
          this.contentFinished = true;
        }
      }).catch((errMsg) => {
        Toast(errMsg || `获取会员权益内容列表失败,请稍后再试!`);
        console.warn(errMsg);
      });
    },
    // 获取直播列表
    getLiveList() {
      apis.getBenefitItems({
        alias: this.$route.query.alias || '',
        pageNumber: this.livePageNum,
        pageSize: this.livePageSize,
        type: 4,
      }).then(data => {
        this.liveList = this.liveList.concat(data.content);
        this.livePageNum++;
        this.liveTotal = data.total;
        if (this.liveList.length >= data.total) {
          this.liveFinished = true;
        }
      }).catch((errMsg) => {
        Toast(errMsg || `获取会员权益直播列表失败,请稍后再试!`);
        console.warn(errMsg);
      });
    },
    onClickShowmore(source) {
      if (source === 'column') {
        this.getCulumnList();
      } else if (source === 'content') {
        this.getContentList();
      } else {
        this.getLiveList();
      }
    },
    onClickOpenVip() {
      // 查询店铺是否设置了购物门槛
      checkFansBuy()
        .then(() => {
          if (isWeapp) {
            ZNB.navigate({
              weappUrl: `/packages/benefit-card/detail/index?alias=${(this.benefitInfo.card || {}).alias}`,
            });
          } else {
            SafeLink.redirect({
              url: `${window._global.url.h5}/v2/card/membercard/index?card_alias=${(this.benefitInfo.card || {}).alias}`,
            });
          }
        });
    },
    // 已购买的查看详情点击
    onClickShowDetail() {
      this.$router.push({
        name: 'VipBenefitDesc',
        query: {
          alias: this.$route.query.alias,
        },
      });
    },
  },

};
</script>

<style lang="scss">
@import "components/custom_richtext.scss";

.vip-container {
  .vip-header {
    background: #fff;
    margin-bottom: 8px;

    &__img {
      width: 100%;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: 50% 50%;
    }

    &__content {
      padding: 16px;
    }

    &__title {
      font-size: 18px;
      color: #323233;
      line-height: 22px;
    }

    &__summary {
      font-size: 12px;
      color: #323233;
      line-height: 18px;
      margin-top: 12px;
    }

    &__content-num {
      font-size: 12px;
      color: #323233;
      line-height: 18px;
      margin-top: 12px;
      &-label {
        color: #969799;
        padding-right: 16px;
      }
    }

    &__show-detail {
      font-size: 12px;
      color: #999;
      padding-top: 16px;
    }
  }

  .vip-tab {
    background: #fff;

    &__desc {
      background: #fff;
      padding: 16px;
      min-height: 100px;
    }

    &__showmore {
      height: 30px;
      font-size: 12px;
      color: #999;
      line-height: 30px;
      text-align: center;
    }

    &__loading {
      margin: auto;
    }
  }

  .vip-list-item {
    padding: 12px 16px 16px;
  }

  .main-btn {
    margin: 5px 16px;
  }
}

.pc-mode .vip-btn {
  width: 375px;
  margin: auto;
}
</style>
