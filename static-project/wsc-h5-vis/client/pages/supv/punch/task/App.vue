<template>
  <div class="punch-list-layout">
    <template v-if="!showCountDown">
      <punch-list-header />
      <punch-list-content />
      <div class="punch-list-layout__cell">
        <punch-list-list />
      </div>
      <coupons-popup
        :show="showCoupons"
        :coupons="couponsList"
        @close="onCouponsClose"
      />
    </template>
    <count-down v-else :start-date="startDate" />

    <!-- 由 mixin-share-popup 注册 -->
    <share-popup v-model="showSharePopup" :url="shareUrl" />
  </div>
</template>
<script>
import { isBefore, parse, format } from 'date-fns';
import Args from '@youzan/utils/url/args';
import SessionStorage from '@youzan/utils/browser/session_storage';

import mixinShare from '../mixins/mixin-share';
import CouponsPopup from '../components/coupons-popup';
import { redirectToIntroduction } from '../utils';
import PunchListHeader from './blocks/header';
import PunchListContent from './blocks/content';
import PunchListList from './blocks/list';
import CountDown from './components/count-down';

const global = window._global;
const platform = global.platform || '';

export default {
  name: 'punch-list',

  components: {
    'punch-list-header': PunchListHeader,
    'punch-list-content': PunchListContent,
    'punch-list-list': PunchListList,
    'count-down': CountDown,
    'coupons-popup': CouponsPopup,
  },

  mixins: [mixinShare],

  data() {
    const startDate = Args.get('start_date');
    const formattedDate = format(startDate, 'YYYY/MM/DD 00:00:00');
    const ISODate = parse(formattedDate);
    return {
      showCountDown: isBefore(new Date(), ISODate),
      startDate,

      showCoupons: false,
      couponsList: [],
    };
  },

  mounted() {
    if (platform !== 'weixin') {
      redirectToIntroduction();
      return;
    }

    if (+SessionStorage.getItem('punch:completed')) {
      // 完成打卡后的流程
      // 处理优惠券的逻辑
      const couponsListString = SessionStorage.getItem('punch:coupons');
      try {
        const couponsList = JSON.parse(couponsListString);
        if (Array.isArray(couponsList) && couponsList.length > 0) {
          this.showCoupons = true;
          this.couponsList = couponsList;
        }
      } catch (err) {
        // do nothing
      }
      SessionStorage.removeItem('punch:coupons');

      // 如果没有奖励，就直接展示日签/长图
      if (!this.showCoupons) {
        this.openSharePopup();
      }
    }
  },

  methods: {
    onCouponsClose() {
      this.showCoupons = false;

      this.openSharePopup();
    },
  },
};
</script>
<style lang="scss" scoped>
.punch-list-layout {
  min-height: 100vh;

  &__cell {
    position: relative;
    margin-top: 10px;
    background-color: #fff;
  }
}
</style>
