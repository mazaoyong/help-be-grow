<template>
  <div class="count-down__container">
    <template v-if="days.num > 0">
      <div class="count-down__time-card day">
        <div class="count-down__time-card masking" />
        <ul class="count-down__digit-box">
          <li
            v-for="(digit, index) in days.str"
            :key="index"
            class="count-down__digit-item"
            :style="getCurrentPositionY(digit)"
          />
        </ul>
      </div>
      <div class="count-down__primary-text">
        距离打卡开始还有{{ days.num }}天
      </div>
      <div class="count-down__des-text">
        课程开始时间{{ startDate }}
      </div>
    </template>
    <template v-else>
      <div class="count-down__primary-text">
        距课程打卡还有
      </div>
      <div class="count-down__time-box">
        <!-- 时 -->
        <div class="count-down__time-card hour">
          <div class="count-down__time-card masking" />
          <ul class="count-down__digit-box">
            <li
              v-for="(digit, index) in getStringifyTimeNumber(hours).str"
              :key="index"
              class="count-down__digit-item"
              :style="getCurrentPositionY(digit)"
            />
          </ul>
        </div>
        <span class="dots">:</span>
        <!-- 分 -->
        <div class="count-down__time-card min">
          <div class="count-down__time-card masking" />
          <ul class="count-down__digit-box">
            <li
              v-for="(digit, index) in getStringifyTimeNumber(mins).str"
              :key="index"
              class="count-down__digit-item"
              :style="getCurrentPositionY(digit)"
            />
          </ul>
        </div>
        <span class="dots">:</span>
        <!-- 秒 -->
        <div class="count-down__time-card sec">
          <div class="count-down__time-card masking" />
          <ul class="count-down__digit-box">
            <li
              v-for="(digit, index) in getStringifyTimeNumber(secs).str"
              :key="index"
              class="count-down__digit-item"
              :style="getCurrentPositionY(digit)"
            />
          </ul>
        </div>
      </div>
    </template>
    <div class="count-down__button" @click="handleHistoryBack">
      返回
    </div>
  </div>
</template>
<script>
import * as timeHelp from './calculate-time';

const DAY_MAX_SIZE = 823; // 按天显示的时候最大距离
const DAY_STEP = 84; // 减少一天所用的距离
const DAY_DEFAULT_OFFSET = -18; // 数值为0的默认偏移量

const TIME_MAX_SIZE = 526;
const TIME_STEP = 54;
const TIME_DEFAULT_OFFSET = -12;

let timer = null;

export default {
  name: 'count-down',
  props: {
    startDate: {
      type: [String, Date, Number],
      default: undefined,
      required: true,
    },
  },

  data() {
    return {
      days: {},
      secondsLeft: 0,
    };
  },

  computed: {
    hours() {
      return timeHelp.getHours(this.secondsLeft);
    },
    mins() {
      return timeHelp.getMins(this.secondsLeft);
    },
    secs() {
      return timeHelp.getSecs(this.secondsLeft);
    },
  },

  mounted() {
    const num = Math.min(timeHelp.getDays(this.startDate), 99);
    if (num > 0) {
      this.days = this.getStringifyTimeNumber(num);
    } else {
      const initSeconds = timeHelp.getInitSeconds(this.startDate);
      this.secondsLeft = initSeconds;
      const setTime = () => {
        if (this.secondsLeft === 0) {
          location.reload();
        }
        this.secondsLeft -= 1000;
        clearTimeout(timer);
        timer = setTimeout(setTime, 1000);
      };
      timer = setTimeout(setTime, 1000);
    }
  },

  beforeDestroy() {
    if (timer) {
      clearTimeout(timer);
    }
  },

  methods: {
    getStringifyTimeNumber(num) {
      const str = num < 10 ? `0${num}` : String(num);
      return {
        num,
        str: str.split(''),
      };
    },
    getCurrentPositionY(digit) {
      const isDayType = this.days.num > 0;
      const step = isDayType ? DAY_STEP : TIME_STEP;
      const maxSize = isDayType ? DAY_MAX_SIZE : TIME_MAX_SIZE;
      const defaultOffset = isDayType ? DAY_DEFAULT_OFFSET : TIME_DEFAULT_OFFSET;
      let currentPositionY = defaultOffset + Number(digit * step);
      if (currentPositionY >= maxSize) {
        currentPositionY = defaultOffset;
      }
      return {
        backgroundPositionY: -currentPositionY + 'px',
      };
    },
    handleHistoryBack() {
      history.back();
    },
  },
};
</script>
<style lang="scss">
.count-down {
  &__container {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: inherit;
    justify-content: center;
    align-items: center;
  }

  &__time-box {
    display: flex;
    margin-top: 20px;
    flex-direction: row;

    .dots {
      width: 20px;
      height: 64px;
      font-size: 32px;
      font-weight: 700;
      line-height: 64px;
      color: #574f60;
      text-align: center;
    }
  }

  &__digit-box {
    display: flex;
    justify-content: center;
    margin-top: -1px;
  }

  &__digit-item {
    background-image: url("https://b.yzcdn.cn/cdn/number-sprite.png");
    background-repeat: no-repeat;
    transition: background-position-y .2s linear;
  }

  &__time-card {
    position: relative;
    overflow: hidden;
    background-color: #00b389;
    border-radius: 6px;

    &.masking {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      background-color: rgba(0, 0, 0, .2);
      border-radius: 0;
    }

    &.day {
      width: 100px;
      height: 100px;

      .count-down__digit-item {
        width: 38.5px;
        height: 100px;
        background-size: 35px;
        background-position-x: 2.2px;
      }

      .masking {
        height: 50px;
      }
    }

    &.hour,
    &.min,
    &.sec {
      width: 64px;
      height: 64px;

      .count-down__digit-item {
        width: 24.64px;
        height: 64px;
        background-size: 22.4px;
        background-position-x: 1.4px;
      }

      .masking {
        height: 32px;
      }
    }
  }

  &__primary-text {
    margin-top: 30px;
    font-size: 18px;
    font-weight: bold;
    line-height: 20px;
    color: #323233;
  }

  &__des-text {
    margin-top: 5px;
    font-size: 14px;
    line-height: 20px;
    color: #999;
  }

  &__button {
    height: 38px;
    padding: 11px 44px;
    margin-top: 20px;
    font-size: 16px;
    color: #00b389;
    border: 1px solid #00b389;
    border-radius: 22px;
    box-sizing: border-box;
  }
}
</style>
