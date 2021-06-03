<template>
  <section-container title="奖励详细">
    <div class="reward-list">
      <reward-item
        v-if="refereeAward.presentList.length > 0"
        :type="3"
        :list="refereeAward.presentList"
        :can-receive="reward.status === 1"
        @operate="handleClick"
      />
      <reward-item
        v-if="refereeAward.couponList.length > 0"
        :type="2"
        :list="refereeAward.couponList"
        :can-receive="reward.status === 1"
        @operate="handleClick"
      />
      <reward-item
        v-if="refereeAward.offlineList.length > 0"
        :type="5"
        :list="refereeAward.offlineList"
        :can-receive="false"
      />
      <reward-item
        v-if="refereeAward.point.awardAmount > 0"
        :type="1"
        :pointCount="refereeAward.point.awardAmount"
        :can-receive="reward.status === 1"
        @operate="handleClick"
      />
    </div>
  </section-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import * as SafeLink from '@youzan/safe-link';
import buildUrl from '@youzan/utils/url/buildUrl';
import SectionContainer from '../../../components/section-container';
import RewardItem from '../../../components/reward-item';

export default {
  name: 'reward-list',
  data() {
    return {};
  },
  computed: {
    ...mapState(['reward']),
    ...mapGetters(['refereeAward']),
  },
  components: {
    SectionContainer,
    RewardItem,
  },
  methods: {
    handleClick(type) {
      let url = '';
      const kdtId = window._global.kdt_id;
      switch (type) {
        case 1:
          url = `/wscump/pointstore/pointcenter?kdt_id=${kdtId}`;
          break;
        case 2:
          url = `/wscump/coupon/collection?kdt_id=${kdtId}`;
          break;
        case 3:
          url = `/wscump/presents?kdt_id=${kdtId}`;
          break;
        default:
          break;
      }
      SafeLink.redirect({
        url: buildUrl(url, 'h5', kdtId),
        kdtId,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
