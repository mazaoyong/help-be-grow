<template>
  <div class="mini-calendar">
    <div
      ref="miniCalendar"
      class="mini-calendar__list"
      @scroll="handleCalendarScroll"
    >
      <template v-if="taskInit">
        <div
          v-for="(item, index) in calendarList"
          :key="index"
          :class="getItemConfig(item, index).class"
          :data-index="index"
          @click="handleClickDate"
        >
          <div class="mini-calendar__item-title">
            {{ item.week }}
          </div>
          <div class="mini-calendar__item-value circle">
            <span :style="getItemConfig(item, index).style">
              {{ getItemConfig(item, index).text }}
            </span>
          </div>
        </div>
      </template>
    </div>
    <div class="mini-calendar__month">
      {{ displayMonth }}
    </div>
    <div class="mini-calendar__extra">
      <slot />
    </div>
  </div>
</template>
<script>
import { getMonth } from 'date-fns';
import getDateConfig from './getDateConfig';

const CELL_WIDTH = 52;
const MIDDLE_OFFSET_CELLS = 2; // 居中偏移量
const TODAY_STYLE = {
  color: '#00b389',
  backgroundColor: 'rgba(255, 255, 255, 0)',
  border: '1px solid #00b389',
};

export default {
  name: 'mini-calendar',

  props: {
    startDate: {
      type: [Date, String, Number],
      default: undefined,
    },
    taskState: {
      type: Object,
      default: () => ({}),
    },
    taskInit: {
      type: Boolean,
      default: false,
    },
    chooseDate: {
      type: String,
      default: undefined,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      calendarList: [],
      currentIndex: -1,
      displayMonth: '',
      displayMonthCache: '',
    };
  },

  watch: {
    taskInit(value) {
      if (value) {
        this.getCalendarAndSetOffset();
      }
    },
  },

  methods: {
    getCalendarAndSetOffset() {
      const { list: calendarList, currentIndex } = getDateConfig(this.startDate);
      const displayMonth = this.getDisplayMonth(currentIndex, calendarList);
      this.calendarList = calendarList;
      this.currentIndex = currentIndex;
      this.displayMonth = displayMonth;
      this.displayMonthCache = displayMonth;

      this.initCurrentIndexByChooseDate(calendarList);
    },
    setOffset() {
      const calendarEle = this.$refs.miniCalendar;
      if (calendarEle && this.currentIndex > -1) {
        calendarEle.scrollLeft = CELL_WIDTH * (this.currentIndex - MIDDLE_OFFSET_CELLS);
      }
    },
    initCurrentIndexByChooseDate() {
      const calendarList = this.calendarList;
      if (this.chooseDate && (Array.isArray(calendarList) && calendarList.length > 0)) {
        this.currentIndex = calendarList.findIndex(calendarConfig => calendarConfig.formatDate === this.chooseDate);

        this.$nextTick(this.setOffset);
      }
    },
    getItemConfig(item, index) {
      const { today, dayNumber, formatDate } = item;
      const text = today ? '今' : dayNumber;
      const isCurrentIndex = Number(index) === this.currentIndex;
      let currentStyle = today ? TODAY_STYLE : undefined;

      const currentTask = (this.taskState || {})[formatDate];
      if (!currentStyle && currentTask) {
        currentStyle = currentTask.style;
      }
      return {
        class: {
          'mini-calendar__item': true,
          'is-today': today,
          'current': isCurrentIndex,
        },
        style: currentStyle,
        text,
      };
    },
    handleCalendarScroll(evt) {
      const scrollLeft = evt.target.scrollLeft;
      const propbablyIndex = Math.floor(scrollLeft / CELL_WIDTH);
      if (propbablyIndex >= 0) {
        const currentDisplayMonth = this.getDisplayMonth(propbablyIndex, this.calendarList);
        if (this.displayMonthCache !== currentDisplayMonth) {
          this.displayMonthCache = currentDisplayMonth;
          this.displayMonth = currentDisplayMonth;
        }
      }
    },
    getDisplayMonth(currentIndex, calendarList) {
      let res = '';
      const currentDateConf = calendarList[currentIndex];
      if (currentDateConf) {
        const currentMonth = getMonth(currentDateConf.date) + 1;
        res = currentMonth + '月';
      }
      return res;
    },
    handleClickDate(evt) {
      if (this.loading) {
        return undefined;
      }

      const currentEle = evt.currentTarget;
      if (currentEle) {
        const index = Number(currentEle.dataset.index);
        if (index >= 0) {
          const currentDateConf = this.calendarList[index];
          this.currentIndex = index;
          this.getDisplayMonth(index, this.calendarList);
          this.$emit('click-time', currentDateConf.date);
        }
      }
    },
  },
};
</script>

<style lang="scss">
.mini-calendar {
  position: relative;
  height: 70px;
  padding: 0 12px;
  overflow: hidden;
  align-items: center;
  background: #fff;
  box-shadow: rgba(0, 0, 0, .1) 0 1px 4px;
  box-sizing: border-box;

  &__month {
    position: absolute;
    left: 0;
    height: 70px;
    padding-right: 24px;
    padding-left: 16px;
    font-size: 14px;
    font-weight: 700;
    line-height: 70px;
    background-image: linear-gradient(90deg, #fff 70%, rgba(255, 255, 255, 0));
  }

  &__extra {
    position: absolute;
    right: 0;
    height: 70px;
    padding-top: 12px;
    padding-right: 16px;
    padding-left: 16px;
    background-image: linear-gradient(270deg, #fff 70%, rgba(255, 255, 255, 0));
  }

  &__list {
    position: absolute;
    display: flex;
    width: calc(100% - 128px);
    padding: 0 52px;
    flex-direction: row;
    overflow-y: scroll;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__item {
    min-width: 34px;
    min-height: 52px;
    margin: 9px;
    font-size: 14px;

    &.current {
      background-color: #ebedf0;
      border-radius: 4px;
    }

    &-title {
      width: 100%;
      margin-bottom: 6px;
      font-weight: bold;
    }

    &-title,
    &-value {
      line-height: 20px;
      text-align: center;
    }
  }

  .circle span {
    display: inline-block;
    width: 20px;
    height: 20px;
    font-size: 14px;
    line-height: 18px;
    border-radius: 20px;
    box-sizing: border-box;
  }
}
</style>
