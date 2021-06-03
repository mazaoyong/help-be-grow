<template>
  <div class="message">
    <van-count-down
      v-if="countDown"
      class="content"
      :time="countDown"
      @finish="countDownFinish"
    >
      <template slot-scope="{ days, hours, minutes, seconds }">
        <!-- 0秒时其实还有1秒，此时只显示‘距开始报名还剩’，加上判断避免这种情况 -->
        <span v-if="days || hours || minutes || seconds">距开始报名还剩</span>
        <span v-if="days">{{ days }}天</span>
        <span v-if="days || hours">{{ padZero(hours) }}时</span>
        <span v-if="days || hours || minutes">{{ padZero(minutes) }}分</span>
        <span v-if="days || hours || minutes || seconds">{{ padZero(seconds) }}秒</span>
      </template>
    </van-count-down>
    <span v-else-if="message" class="content">
      {{ message }}
    </span>
  </div>
</template>

<script>
import { CountDown } from 'vant';
import { GOODS_STATUS } from '@/constants/course/goods-status';

export default {
  components: {
    'van-count-down': CountDown,
  },

  rootState: ['goodsData', 'message'],

  computed: {
    countDown() {
      const { publishAt, status, isOwnAsset } = this.goodsData;
      if (publishAt && status === GOODS_STATUS.PRESELL && !isOwnAsset) {
        const now = Date.now();
        // 后端状态更新有延迟，前端统一延时3秒
        if (now < publishAt + 3000) {
          return publishAt + 3000 - now;
        }
      }
      return 0;
    },
  },

  methods: {
    countDownFinish() {
      location.reload();
    },

    padZero(num) {
      if (num < 10) {
        return `0${num}`;
      }
      return num;
    },
  },
};
</script>

<style lang="scss" scoped>
.message {
  position: fixed;
  right: 0;
  bottom: 50px;
  left: 0;
  z-index: 1;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);

  .content {
    display: block;
    font-size: 13px;
    line-height: 32px;
    color: #ed6a0c;
    text-align: center;
    background-color: #fffbe8;
  }
}
</style>
