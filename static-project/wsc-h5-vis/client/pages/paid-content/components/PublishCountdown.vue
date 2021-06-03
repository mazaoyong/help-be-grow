<template>
  <div class="goods-bottom-bar">
    <p class="goods-bottom-bar-content">
      <span>{{ text }}</span>
      <cap-countdown
        :start="now"
        :end="end"
        :hide-zero-day="true"
        :hide-zero-hour="true"
        :time-separator="['天', '时', '分', '秒']"
        @timechange="onCountChange"
        @countdown-ended="onCountdownEnded"
      />
    </p>
  </div>
</template>

<script>
import { Countdown } from 'captain-ui';
import getValidDate from '@youzan/utils/date/getValidDate.js';

export default {
  name: 'publish-countdown',
  components: {
    'cap-countdown': Countdown,
  },
  props: {
    publishAt: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    const now = new Date().getTime();
    const end = getValidDate(this.publishAt).getTime();
    return {
      now,
      end,
      text: '',
    };
  },
  methods: {
    onCountChange({ day }) {
      this.text = day > 0 ? '距开始报名还剩' : '距开售还剩';
    },
    onCountdownEnded() {
      window.location.reload();
    },
  },
};
</script>

<style lang='scss'>
.pc-mode {
  .goods-bottom-bar {
    margin: 0 auto;
    width: 375px;
  }
}

.goods-bottom-bar-content {
  margin: 0;
  min-height: 35px;
  line-height: 35px;
  background: #fffbe8;
  font-size: 14px;
  color: #ed6a0c;
  text-align: center;

  .cap-countdown__day,
  .cap-countdown__hour,
  .cap-countdown__minute,
  .cap-countdown__second,
  .cap-countdown__time-text {
    padding: 0;
    margin: 0;
    font-size: 14px;
    background-color: #fffbe8;
    color: #ed6a0c;
  }
}
</style>
