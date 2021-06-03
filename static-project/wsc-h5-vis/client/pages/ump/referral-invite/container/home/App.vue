<template>
  <div
    class="home"
    :class="{
      'course-bg': isCourseEntry,
      'usercenter-bg': isUserCenterEntry,
    }"
  >
    <block-header
      @show-profit-modal="showProfitModal=true"
      @show-rule-popup="showRulePopup=true"
    />
    <block-flash />
    <div class="main">
      <div v-if="isCourseEntry">
        <count-down class="count-down" />
        <red-bag v-if="recommendGift.commissionPrice" ref="redBag" />
        <my-invite v-if="recommendGift.phasedRewardDetails.length" class="view-block my-invite" />
        <template v-if="recommendGift.phasedRewardDetails.length">
          <stage-reward
            class="view-block"
            :stages="recommendGift.phasedRewardDetails"
            :invited-count="recommendGift.helpedCount"
          />
        </template>
        <my-earn class="view-block" @show-profit-modal="showProfitModal=true" />
      </div>
      <div v-if="isUserCenterEntry">
        <my-earn class="view-block" @show-profit-modal="showProfitModal=true" />
        <!-- 个人中心展示的是历史邀请总人数 -->
        <my-invite v-if="inviteRecord.pageRequest.total" class="my-invite" @showRecommendPop="popShow = true" />
        <recommend-list />
        <recommend-popup v-model="popShow" />
      </div>
    </div>
    <profit-modal v-model="showProfitModal" />
    <rule-popup v-model="showRulePopup" />
    <template v-if="showBottomActions">
      <bottom-actions />
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import BlockHeader from './blocks/header';
import BlockFlash from './blocks/flash';
import MyInvite from './blocks/my-invite';
import StageReward from './blocks/stage-reward/index';
import MyEarn from './blocks/MyEarn';
import CountDown from './blocks/CountDown';
import RedBag from './blocks/red-bag';
import BottomActions from './blocks/BottomActions';
import RecommendList from './blocks/RecommendList';
import RecommendPopup from '../components/recommend-popup';

import ProfitModal from './blocks/profit-modal';
import RulePopup from './blocks/rule-popup';
import { isInViewPort } from '@/common/utils';
export default {
  components: {
    BlockHeader,
    BlockFlash,
    MyInvite,
    StageReward,
    MyEarn,
    CountDown,
    RedBag,
    BottomActions,
    RecommendList,
    RecommendPopup,
    ProfitModal,
    RulePopup,
  },
  data: () => {
    return {
      showProfitModal: false,
      showRulePopup: false,
      showBottomActions: false,
      popShow: false,
    };
  },

  computed: {
    ...mapState(['alias']),
    ...mapState('recommend-gift', ['recommendGift', 'inviteRecord', 'activityInviteRecord']),
    ...mapGetters(['isCourseEntry', 'isUserCenterEntry']),
  },
  watch: {
    'recommendGift.activityId': function(value) {
      if (this.isCourseEntry) {
        this.getInviteRecord(this.recommendGift.activityId);
        this.checkBtnInViewport();
      }
    },
  },
  created() {
  },
  mounted() {
    if (this.isCourseEntry) {
      window.addEventListener('scroll', this.checkBtnInViewport);
      this.getActivityDetail({ goodsAlias: this.alias });
      this.getGoodsDetail(this.alias);
    }

    if (this.isUserCenterEntry) {
      this.fetchRecommendList();
      this.getInviteRecord();
    }
  },
  destroyed() {
    window.removeEventListener('scroll', this.eventFunc);
  },
  methods: {
    ...mapActions('recommend-gift', ['getActivityDetail', 'getGoodsDetail', 'getInviteRecord', 'fetchRecommendList']),
    checkBtnInViewport() {
      if (this.recommendGift.commissionPrice) {
        this.$nextTick(() => {
          const redBagEl = this.$refs.redBag.$el;
          this.showBottomActions = !isInViewPort(redBagEl);
        });
      } else {
        this.showBottomActions = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.my-invite {
  padding: 16px 16px 10px 16px !important;
}

.home {
  min-height: 700px;
  padding-bottom: 90px;
  background-color: #ffb311;
  background-repeat: no-repeat;
  background-size: 100%;
  background-position-x: center;
  background-position-y: 0;

  .vis-price-label__box {
    font-family: Akrobat;
  }
}

.count-down {
  max-width: 242px;
  margin: 0 auto;
  margin-bottom: 35px;
}

.view-block {
  margin-top: 12px;
}

.course-bg {
  background-image: url('https://img01.yzcdn.cn/upload_files/2020/11/09/FqmRI1hEzFDAx3ChGKSzrdNyL749.png');
}

.usercenter-bg {
  background-image: url('https://img01.yzcdn.cn/upload_files/2020/11/09/FvpuQsYK3naeojLJH0FG3dvUbAFv.png');
}
</style>
