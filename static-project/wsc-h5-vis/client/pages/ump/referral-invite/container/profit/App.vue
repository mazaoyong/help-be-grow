<template>
  <div>
    <my-earn @showRecommendPop="popShow = true" />
    <p class="earn-tips">
      温馨提示：此页面展示的收益仅来自于好友下单有礼活动
    </p>
    <earn-history />
    <recommend-popup v-model="popShow" />
  </div>
</template>

<script>
import MyEarn from './blocks/MyEarn';
import EarnHistory from './blocks/EarnHistory/index.vue';
import RecommendPopup from '../components/recommend-popup';
import { mapActions, mapState } from 'vuex';
import { reachPageBottom } from '@/common/utils';
import args from '@youzan/utils/url/args';

export default {
  components: {
    MyEarn,
    EarnHistory,
    RecommendPopup,
  },
  data: () => {
    return {
      popShow: false,
    };
  },
  computed: {
    ...mapState('recommend-gift', ['myProfitDetail']),
  },
  mounted() {
    this.getMyProfitDetail();
    this.fetchRecommendList();
    this.getActivityDetail({ goodsAlias: args.get('alias') });
    window.addEventListener('scroll', () => {
      if (reachPageBottom()) {
        this.getMyProfitDetail();
      }
    });
  },
  destroyed() {
    window.removeEventListener('scroll');
  },
  methods: {
    ...mapActions('recommend-gift', ['getMyProfitDetail', 'fetchRecommendList', 'getActivityDetail']),
  },
};
</script>

<style lang="scss" scoped>
.earn-tips {
  margin: 8px 16px 13px 16px;
  font-size: 12px;
  color: #969799;
}

</style>
