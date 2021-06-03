<template>
  <div class="groupon-title">
    <div class="groupon-title__left">
      <vis-price-current :price="promotionPrice" />
      <div class="groupon-title__left-old">
        <vis-price-old disable-color="rgba(0, 0, 0, .5)" :price="originPrice" />
        <div class="groupon-title__num">
          <span>{{ conditionNum }}{{ conditionType }}</span>
        </div>
      </div>
    </div>

    <!-- 为课程区间价留了个口子 -->

    <div class="groupon-title__time">
      <p class="groupon-title__time-label">
        距结束仅剩
      </p>
      <cap-countdown
        class="groupon-title__time-countdown"
        :start="startTime"
        :end="endTime"
        :hide-zero-day="true"
        :time-separator="timeSeparator"
      />
    </div>
  </div>
</template>

<script>
import { PriceLabel } from '@youzan/vis-ui';
import { Countdown } from 'captain-ui';
const { CurrentPrice, OldPrice } = PriceLabel;

export default {
  name: 'groupon-title',

  components: {
    'vis-price-current': CurrentPrice,
    'vis-price-old': OldPrice,
    'cap-countdown': Countdown,
  },

  props: {
    /*
    * 拼团活动成团人数
    */
    conditionNum: Number,
    conditionType: {
      type: String,
      default: '人团',
    },
    promotionPrice: [String, Number, Array],
    originPrice: [String, Number, Array],
    startTime: Number,
    /*
    * 活动剩余时间
    */
    endTime: Number,
  },

  data() {
    return {
      timeSeparator: ['天', ':', ':'],
    };
  },

  computed: {
    startTime1() {
      console.log('666', this.startTime);
      return this.startTime;
    },

    endTime1() {
      console.log('777', this.endTime);
      return this.endTime;
    },
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';
@import 'var';

.groupon-title {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-image: linear-gradient(180deg, #01cb9c 0%, #00b389 100%);
  background-color: #00b389;
  height: 56px;
  border-radius: 4px;
  padding: 0 10px;

  &__left {
    display: flex;
    align-items: flex-end;

    &-old {
      margin-left: 10px;

      .groupon-title__num {
        background-color: rgba(0, 0, 0, .5);
        border-radius: 2px;
        font-size: 10px;
        padding: 2px 3px;
        line-height: 15px;
        color: #fff;
        text-align: center;
      }
    }
  }

  .vis-price-label__item__active {

    .vis-price-label__item {
      font-size: 24px;
      color: #fff;
      font-weight: 400;

      .vis-price-decimal {
        font-size: 10px !important;
      }

      .vis-price-symbol {
        font-size: 10px;
      }
    }
  }

  .vis-price-label__item__disable {
    font-size: 10px;

    .vis-price-decimal {
      font-size: 10px;
    }

    .vis-price-symbol {
      font-size: 10px;
    }
  }

  &__time {

    &-label {
      font-size: 10px;
      color: $white;
      line-height: 14px;
      text-align: right;
      margin-right: 3px;
      margin-bottom: 3px;
    }

    &-countdown {
      font-size: 12px;

      .cap-countdown__hour,
      .cap-countdown__minute,
      .cap-countdown__second {
        background-color: rgba(0, 0, 0, .5) !important;
        border-radius: 2px;
      }

      .cap-countdown__day {
        background-color: transparent !important;
        margin: 0 !important;
      }

      .cap-countdown__time-text {
        color: $white !important;
      }
    }
  }
}
</style>
