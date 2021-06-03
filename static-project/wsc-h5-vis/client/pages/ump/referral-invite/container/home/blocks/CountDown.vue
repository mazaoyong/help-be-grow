<template>
  <div class="wrap">
    <van-count-down use-slot :time="remainTime">
      <template slot-scope="{ days, hours, minutes, seconds }">
        <div class="content">
          <span class="text">{{ recommendGift.startAt > curTime ? '距开始': '距结束' }}</span>
          <template v-if="days">
            <span class="block">{{ days }}</span>
            <span class="text">天</span>
          </template>
          <span class="block">{{ hours | tens }}</span>
          <span class="block">{{ hours | units }}</span>
          <span class="text">:</span>
          <span class="block">{{ minutes |tens }}</span>
          <span class="block">{{ minutes | units }}</span>
          <span class="text">:</span>
          <span class="block">{{ seconds | tens }}</span>
          <span class="block">{{ seconds | units }}</span>
        </div>
      </template>
    </van-count-down>
  </div>
</template>

<script>
import { CountDown } from 'vant';
import { mapState } from 'vuex';

export default {
  name: 'block-countdown',
  components: {
    'van-count-down': CountDown,
  },
  filters: {
    tens: function(value) {
      if (!value) return 0;
      return Math.floor(value / 10);
    },
    units: function(value) {
      if (!value) return 0;
      return value % 10;
    },
  },
  data() {
    return {
      curTime: Date.now(),
    };
  },
  computed: {
    ...mapState('recommend-gift', ['recommendGift']),
    remainTime() {
      if (this.recommendGift.startAt > this.curTime) {
        return this.recommendGift.startAt - Date.now();
      } else if (this.recommendGift.startAt < this.curTime) {
        return this.recommendGift.endAt - Date.now();
      }
      return 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.wrap {
  padding: 0 16px;
  height: 41px;
  background:rgba(255, 252, 241, 0.5);
  border-radius: 21px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.content {
  display: flex;
  align-items: center;
  justify-content: center;
}
.text {
  display: block;
  color: #FF5100;
  font-size: 14px;
  font-weight: 400;
}

.block {
  display: block;
  height: 22px;
  background: #FF5100;
  border-radius: 2px;
  color: #fff;
  font-size: 16px;
  padding: 2px;
  min-width: 13px;
  text-align: center;
}

.text + .block {
  margin-left: 6px;
}
.block + .text {
  margin-left: 6px;
}

.block + .block {
  margin-left: 2px;
}
</style>
