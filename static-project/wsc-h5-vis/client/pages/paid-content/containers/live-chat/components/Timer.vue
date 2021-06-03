<template>
  <van-popup
    v-model="innerVisible"
    class="timer-popup"
    :style="{ zoom }"
    :close-on-click-overlay="false"
  >
    <div class="timer-popup-content">
      <p>距离直播开始还有</p>
      <div class="timer-popup-content__timer">
        <div class="timer-popup-content__timer-number">
          {{ day }}
        </div>
        <div class="timer-popup-content__timer-text">
          天
        </div>
        <div class="timer-popup-content__timer-number">
          {{ hour }}
        </div>
        <div class="timer-popup-content__timer-text">
          时
        </div>
        <div class="timer-popup-content__timer-number">
          {{ minute }}
        </div>
        <div class="timer-popup-content__timer-text">
          分
        </div>
        <div class="timer-popup-content__timer-number">
          {{ second }}
        </div>
        <div class="timer-popup-content__timer-text">
          秒
        </div>
      </div>
    </div>
    <van-icon
      class="timer-popup__close-btn"
      name="close"
      @click="closePopup"
    />
  </van-popup>
</template>

<script>
import { Icon, Popup } from 'vant';

export default {
  name: 'timer',

  components: {
    [Popup.name]: Popup,
    [Icon.name]: Icon,
  },

  props: {
    startTime: {
      type: String,
      required: true,
      default: '',
    },
    value: Boolean,
  },

  data() {
    return {
      innerVisible: false,
      timer: 0,
      begin: false,
      now: Date.now(),
      zoom: window.innerWidth < 375 ? ((window.innerWidth - 60) / 315).toFixed(2) : 1,
      tomorrow: Date.now() + 86400000,
    };
  },

  computed: {
    leaveTime() {
      // eslint-disable-next-line no-useless-escape
      const leaveTime = new Date(this.startTime.replace(/\-/g, '/')) - this.now;
      if (leaveTime <= 0 && this.begin) {
        this.clearTimer();
        this.$emit('end');
      }
      return leaveTime;
    },
    day() {
      const day = this.leaveTime / 86400000 >> 0;
      return day > 0 ? day : 0;
    },
    hour() {
      const hour = this.leaveTime % 86400000 / 3600000 >> 0;
      return hour > 0 ? hour : 0;
    },
    minute() {
      const minute = this.leaveTime % 86400000 % 3600000 / 60000 >> 0;
      return minute > 0 ? minute : 0;
    },
    second() {
      const second = this.leaveTime % 86400000 % 3600000 % 60000 / 1000 >> 0;
      return second > 0 ? second : 0;
    },
  },

  watch: {
    value: {
      immediate: true,
      handler(newV) {
        this.innerVisible = newV;
      },
    },
  },

  mounted() {
    if (this.leaveTime > 0) this.beginTimer();
  },

  destroyed() {
    this.clearTimer();
  },

  methods: {
    beginTimer() {
      this.begin = true;
      this.timer = setInterval(() => {
        this.now = Date.now();
      }, 1000);
    },

    clearTimer() {
      clearInterval(this.timer);
    },

    closePopup() {
      this.innerVisible = false;
      this.$emit('input', false);
    },
  },
};
</script>

<style lang="scss">
@import 'var';

.timer-popup {
  overflow-y: visible !important;
  background: transparent;

  &-content {
    width: 315px;
    height: 250px;
    overflow: hidden;
    text-align: center;
    background-image: url(https://img01.yzcdn.cn/paid-content/timer_bg.png);
    background-size: cover;
    border-radius: 6px;

    p {
      margin-top: 158px;
      font-size: 14px;
      line-height: 24px;
      color: $c-black;
    }

    &__timer {
      margin-top: 10px;
      line-height: 28px;

      &-number {
        display: inline-block;
        width: 28px;
        font-size: 20px;
        color: #fff;
        text-align: center;
        background-image: linear-gradient(-180deg, #b9e4fb 0%, #83c4f5 100%);
        border-radius: 2px;
      }

      &-text {
        display: inline-block;
        width: 24px;
        font-size: 14px;
        text-align: center;
      }
    }
  }

  &__close-btn {
    position: absolute;
    top: -40px;
    right: 0;
    font-size: 32px;
    color: $c-white;
  }
}
</style>
