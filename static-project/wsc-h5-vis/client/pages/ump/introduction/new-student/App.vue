<template>
  <vis-page-container v-if="fetched" class="new-student">
    <div :class="['new-student__content', `new-student__content-style-${pageStyle}`]">
      <activity-upgrading v-if="isShowActivityGuide" :share-url="guideUrl" class="activity-guide" />
      <template v-else>
        <template v-if="!activityError">
          <header-info />
          <reward-info />
          <collect-list />
          <reward-list />
          <insti-intro />
        </template>
        <div class="new-student__error" v-else>
          <activity-error :padding-top="24" :tip="activityError" />
        </div>
      </template>
    </div>
    <!-- 分享浮层 -->
    <share-mask :value="isShowShareGuide" @close="onShareGuideHide" />

    <!-- 分享弹窗 -->
    <multi-share-pop
      v-model="isShowSharePop"
      :share-options="shareOptions"
      title="选择分享方式"
      @link="showShareGuide"
      @copy="copyLink"
    >
    </multi-share-pop>

    <boost-popup
      v-model="isShowBoost"
      :award-desc="awardDesc"
      :alias="alias"
      :new-stu-award-desc="newStuAwardDesc"
      :referee-user-id="refereeUserId"
    />

    <poster-popup v-if="isShowSharePop" :url="boostPoster" />
    <!-- 课程推荐 -->
    <recommend-list v-if="showRecommendGoods" />
  </vis-page-container>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import PageContainer from '@/pages/edu/components/page-container';
import ShareMask from '@/components/share-mask';
import MultiSharePop from 'components/multi-share-pop';

import RewardInfo from './blocks/reward-info';
import RewardList from './blocks/reward-list';
import CollectList from './blocks/collect-list';
import InstiIntro from './blocks/insti-intro';
import HeaderInfo from './blocks/header-info';
import PosterPopup from './blocks/poster-popup';

import RecommendList from '../blocks/recommend-list';
import ActivityUpgrading from '../blocks/activity-upgrading';

import ActivityError from '../../components/activity-error';

import BoostPopup from '../components/boost-popup';

export default {
  name: 'new-student',

  components: {
    'vis-page-container': PageContainer,
    RewardInfo,
    CollectList,
    InstiIntro,
    RecommendList,
    ActivityError,
    ActivityUpgrading,
    PosterPopup,
    MultiSharePop,
    ShareMask,
    HeaderInfo,
    RewardList,
    BoostPopup,
  },

  computed: {
    ...mapState([
      'showRecommendGoods',
      'reward',
      'fetched',
      'isShowGuide',
      'activityError',
      'guideUrl',
      'isShowActivityGuide',
      'boostPoster',
      'shareOptions',
      'refereeUserId',
      'alias',
    ]),

    ...mapGetters(['pageStyle', 'awardDesc']),

    isShowSharePop: {
      get() {
        return this.$store.state.isShowSharePop;
      },

      set(value) {
        this.$store.state.isShowSharePop = value;
      },
    },

    isShowShareGuide: {
      get() {
        return this.$store.state.isShowShareGuide;
      },

      set(value) {
        this.$store.state.isShowShareGuide = value;
      },
    },

    isShowBoost: {
      get() {
        return this.$store.state.isShowBoost;
      },

      set(value) {
        this.$store.state.isShowBoost = value;
      },
    },
  },

  created() {
    this.fetchRefereeActivity();
  },

  mounted() {
    document.addEventListener('visibilitychange', () => {
      const isHidden = document.hidden;
      if (this.fetched && !isHidden) {
        this.setShareInfo();
      }
    });
  },

  methods: {
    ...mapActions([
      'fetchRefereeActivity',
      'showShareGuide',
      'getBoostPoster',
      'onShareGuideHide',
      'copyLink',
      'newStuAwardDesc',
      'setShareInfo',
    ]),
  },
};
</script>

<style lang="scss" scoped>
.new-student {
  min-height: inherit !important;
  &__content {
    height: auto;
    min-height: inherit;
    padding-bottom: 16px;
    background-repeat: no-repeat;
    background-size: 100% auto;

    &-style-1 {
      background-color: #e0a567;
      background-image: url('https://img01.yzcdn.cn/public_files/df417290be627a10e72bc9bb4779c722.png');
    }

    &-style-2 {
      background-color: #952c00;
      background-image: url('https://img01.yzcdn.cn/public_files/70965a56c973491f73e386aa327888d1.png');
    }

    &-style-3 {
      background-color: #95c14a;
      background-image: url('https://img01.yzcdn.cn/public_files/392461b516c790e7945309a575e5a9ed.png');
    }
  }

  &__error {
    margin: 0px 16px;
    position: relative;
    top: 99px;
    background: #fff;
    border-radius: 16px;
  }
}
</style>
