<template>
  <div v-if="!isEnd" class="acticity-bar">
    <slot name="header">
      <div class="price gradient-new-bg main-text">
        <i class="lines-bg activity-main-lines-bg" />
        <p class="price-line">
          <span>￥</span>
          <span class="main-price">{{ minPriceShow[0] }}</span>
          <span>{{ minPriceShow[1] }}</span>
          <span v-if="isRangePrice"> 起</span>
        </p>
        <p class="other-line">
          <span class="tag end-new-bg-text" round>{{ tag }}</span>
          <span class="origin">价格￥{{ isRangeOrigin ? `${minOriginShow}-${maxOriginShow}` : minOriginShow }}</span>
          <span v-if="totalStock && isBefore" class="divider" />
          <span v-if="totalStock && isBefore" class="stock">限前{{ totalStock }}名</span>
        </p>
      </div>
    </slot>
    <div class="count-down vice-new-bg vice-new-text">
      <i class="lines-bg activity-vice-lines-bg" />
      <div class="content">
        <p class="time-desc" v-html="timeDesc" />
        <div v-if="isBefore || (isStart && !hasStock)" class="time-left">
          <span v-if="day">{{ day }}天 </span>
          <template v-for="(item, index) in timeSpan">
            <span v-if="index !== 0" :key="`${index}-colon`" class="colon">:</span>
            <span :key="index" class="time-item vice-new-text-bg vice-new-bg-text">{{ item }}</span>
          </template>
        </div>
        <div v-if="isStart && hasStock" class="stock-left">
          <div class="progress">
            <span class="track vice-new-text-bg" />
            <span class="nail vice-new-text-bg" :style="{ width: stockPercent + '%' }" />
          </div>
          <span>剩余{{ leftStock }}名</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Tag } from 'vant';
import isBefore from 'date-fns/is_before';
import isAfter from 'date-fns/is_after';
import addDays from 'date-fns/add_days';
import endOfDay from 'date-fns/end_of_day';
import dateFormat from 'date-fns/format';
import differenceInDays from 'date-fns/difference_in_days';
import differenceInMilliseconds from 'date-fns/difference_in_milliseconds';
import moneyFormat from '@youzan/utils/money/format';
import { splitPrice, parseTime, prependZero } from './utils';

const loadTime = new Date();

export default {
  name: 'activity-bar',

  components: {
    [Tag.name]: Tag,
  },

  props: {
    minPrice: {
      type: Number,
      required: true,
    },
    maxPrice: {
      type: Number,
      required: true,
    },
    minOrigin: {
      type: Number,
      required: true,
    },
    maxOrigin: {
      type: Number,
      required: true,
    },
    totalStock: {
      type: Number,
      default: null,
    },
    leftStock: {
      type: Number,
      default: null,
    },
    tag: {
      type: String,
      required: true,
    },
    startTime: {
      type: [Date, Number],
      required: true,
    },
    endTime: {
      type: [Date, Number],
      required: true,
    },
  },

  data() {
    return {
      now: new Date(),
    };
  },

  computed: {
    isRangePrice() {
      return this.minPrice !== this.maxPrice;
    },

    isRangeOrigin() {
      return this.minOrigin !== this.maxOrigin;
    },

    minPriceShow() {
      return splitPrice(this.minPrice);
    },

    minOriginShow() {
      return moneyFormat(this.minOrigin, true, false);
    },

    maxOriginShow() {
      return moneyFormat(this.maxOrigin, true, false);
    },

    isBefore() {
      return isAfter(this.startTime, loadTime);
    },

    isStart() {
      return isBefore(this.startTime, loadTime) && isAfter(this.endTime, loadTime);
    },

    isEnd() {
      return isBefore(this.endTime, loadTime);
    },

    hasStock() {
      return this.totalStock && this.leftStock;
    },

    timeDesc() {
      if (this.isBefore) {
        const todayEnd = endOfDay(this.now);
        const tomorrowEnd = endOfDay(addDays(this.now, 1));
        const secondTomorrowEnd = endOfDay(addDays(this.now, 2));
        if (isAfter(this.startTime, secondTomorrowEnd)) {
          return dateFormat(this.startTime, 'M月D日HH:mm开抢');
        }
        if (isAfter(this.startTime, tomorrowEnd)) {
          return dateFormat(this.startTime, '后天HH:mm开抢');
        }
        if (isAfter(this.startTime, todayEnd)) {
          return dateFormat(this.startTime, '明天HH:mm开抢');
        }
        return dateFormat(this.startTime, '今天HH:mm开抢');
      }
      if (this.isStart) {
        if (this.hasStock) {
          let leftTime = '';
          const differenceMilliseconds = differenceInMilliseconds(this.endTime, this.now);
          const difference = parseTime(differenceMilliseconds);
          if (difference.day > 0) {
            leftTime = `${difference.day}天 ${prependZero(difference.hour)}:${prependZero(difference.minute)}:${prependZero(difference.second)}`;
          } else {
            leftTime = `${prependZero(difference.hour)}:${prependZero(difference.minute)}:${prependZero(difference.second)}:${prependZero(difference.millisecond)}`;
          }
          return `距结束仅剩 ${leftTime}`;
        }
        return '距结束仅剩';
      }
      return '';
    },

    day() {
      if (this.isBefore) {
        return differenceInDays(this.startTime, this.now);
      }
      if (this.isStart && !this.hasStock) {
        return differenceInDays(this.endTime, this.now);
      }
      return 0;
    },

    timeSpan() {
      if (this.isBefore || (this.isStart && !this.hasStock)) {
        let differenceMilliseconds = 0;
        if (this.isBefore) {
          differenceMilliseconds = differenceInMilliseconds(this.startTime, this.now);
        }
        if (this.isStart && !this.hasStock) {
          differenceMilliseconds = differenceInMilliseconds(this.endTime, this.now);
        }
        const difference = parseTime(differenceMilliseconds);
        if (difference.day > 0) {
          return [
            prependZero(difference.hour),
            prependZero(difference.minute),
            prependZero(difference.second),
          ];
        }
        return [
          prependZero(difference.hour),
          prependZero(difference.minute),
          prependZero(difference.second),
          prependZero(difference.millisecond),
        ];
      }
      return [];
    },

    stockPercent() {
      if (this.hasStock) {
        return Math.floor((this.leftStock / this.totalStock) * 100);
      }
      return 0;
    },
  },

  mounted() {
    const updateNow = () => {
      this.now = new Date();
      setTimeout(() => {
        if ((this.isBefore && this.now > this.startTime) || (this.isStart && this.now > this.endTime)) {
          location.reload();
        } else {
          updateNow();
        }
      }, 30); // 约30帧
    };
    updateNow();
  },

  methods: {},
};
</script>

<style lang="scss" scoped>
.acticity-bar {
  display: flex;
  overflow: hidden;
}

.price {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  padding: 8px 16px;

  i.lines-bg {
    position: absolute;
    top: 0;
    left: 60px;
    width: 172px;
    height: 100%;
    background-position: 0 -180px;
    transform: rotate(180deg);
  }

  .price-line {
    height: 22px;
    font-size: 14px;
    font-weight: bold;
    line-height: 22px;

    .main-price {
      font-size: 24px;
    }
  }

  .other-line {
    height: 18px;
    margin-left: -8%;
    font-size: 12px;
    line-height: 18px;
    transform: scale(.833333);

    .tag {
      display: inline-block;
      padding: 1px 4px 0;
      background-color: #fff;
      border-radius: 1rem;
    }

    .origin {
      margin-left: 4px;
      text-decoration: line-through;
      opacity: .7;
    }

    .divider::after {
      margin: 0 3px;
      content: '|';
      opacity: .2;
    }

    .stock {
      opacity: .7;
    }
  }
}

.count-down {
  position: relative;
  display: flex;
  padding: 12px 16px;
  // 因为30deg的时候，会导致出现白色的像素点，所以解决方案是，保持角度不变
  // 增加横向偏移量，然后将平行四边形整体向左收紧2倍偏移量来抵消这个偏移量
  margin-right: -34px;
  overflow: hidden;
  font-size: 12px;
  text-align: right;
  transform: skew(-30deg) translateX(-17px);
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;

  i.lines-bg {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-position: 0 -90px;
    transform: skewX(30deg) translateX(-16px);
  }

  .content {
    transform: skew(30deg);
  }

  .time-desc {
    position: relative;
    left: 4px;
    line-height: 14px;
    text-align: justify;
    transform: scale(.833333);
  }

  .time-left {
    margin: 3px 16px 0 0;
    line-height: 16px;

    .colon {
      margin: 0 2px;
    }

    .time-item {
      display: inline-block;
      width: 16px;
      height: 16px;
      text-align: center;
      border-radius: 2px;
    }
  }

  .stock-left {
    margin: 3px 16px 0 0;
    line-height: 14px;

    .progress {
      position: relative;
      display: inline-block;
      width: 64px;
      height: 6px;
      margin-right: 4px;
    }

    .track {
      display: block;
      height: 100%;
      border-radius: 3px;
      opacity: .2;
    }

    .nail {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      border-radius: 3px;
    }
  }
}
</style>
