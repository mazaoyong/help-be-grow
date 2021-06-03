<template>
  <div class="calendar">
    <!-- 日历头部 -->
    <div class="calendar__header">
      <div class="calendar__header__before">
        <slot name="header-before">
          <!-- 占位元素，为了使底下的 paginator 居中 -->
          <div style="min-width: 28px;" />
        </slot>
      </div>

      <div class="calendar__paginator">
        <van-icon
          name="arrow-left"
          size="14px"
          color="#00B389"
          @click="onPrevMonthClick"
        />
        <div class="calendar__paginator__current-month">
          {{ currentMonth | toMonthText }}
        </div>
        <van-icon
          name="arrow"
          size="14px"
          color="#00B389"
          @click="onNextMonthClick"
        />
      </div>

      <div class="calendar__header__after">
        <slot name="header-after">
          <div class="calendar__btn-today" @click="toToday">
            今天
          </div>
        </slot>
      </div>
    </div>

    <!-- 日历主体 -->
    <div class="calendar__body">
      <div class="calendar__week-list">
        <span
          v-for="(date, index) in weekList"
          :key="index"
          class="calendar__week-text"
        >
          {{ date }}
        </span>
      </div>
      <div class="calendar__table">
        <div
          v-for="(row, index) in dateList"
          :key="index"
          class="calendar__table__row"
        >
          <div
            v-for="(date, i) in row"
            :key="i"
            class="calendar__table__cell date--normal"
            :class="[
              isToday(date) ? 'date--today' : '',
              isSameDay(date, currentDate) ? 'date--selected' : '',
              isSameMonth(date, currentMonth)
                ? 'date--current-month' :
                  hideIfNotCurrentMonth ? 'date--hidden' : 'date--not-current-month',
              dateClassMap[format(date, 'YYYY-MM-DD')],
            ]"
            @click="toDate(date)"
          >
            {{ date | toDateText }}
          </div>
        </div>
      </div>
    </div>

    <!-- 日历底部 -->
    <div class="calendar__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
import { Icon } from 'vant';
import {
  format,
  isSameDay,
  isToday,
  isSameMonth,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDay,
} from 'date-fns';

export default {
  name: 'calendar',

  components: {
    'van-icon': Icon,
  },

  filters: {
    toDateText(date) {
      if (isSameDay(date, new Date())) {
        return '今';
      } else {
        return date.getDate();
      }
    },
    toMonthText(date) {
      return format(date, 'YYYY [年] M [月]');
    },
  },

  props: {
    selectedDate: {
      type: Date,
      default() {
        return new Date();
      },
    },
    firstDayOfWeek: {
      type: Number,
      default: 0,
    },
    selectType: {
      type: String,
      default: 'date',
    },
    dateClassList: {
      type: Array,
      default() {
        return [];
      },
    },
    hideIfNotCurrentMonth: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
      default() {
        return null;
      },
    },
    endDate: {
      type: Date,
      default() {
        return null;
      },
    },
    startMonth: {
      type: Date,
      default() {
        return null;
      },
    },
    endMonth: {
      type: Date,
      default() {
        return null;
      },
    },
  },

  data() {
    return {
      currentDate: new Date(),
      currentMonth: new Date(),
    };
  },

  computed: {
    weekList() {
      const weekList = [];
      const arr = ['日', '一', '二', '三', '四', '五', '六'];

      let i = this.firstDayOfWeek;
      if (i === 0) {
        return arr;
      }
      do {
        weekList.push(arr[i]);
        i++;
        if (++i === 7) {
          i = 0;
        }
      } while (i !== this.firstDayOfWeek - 1);
      return weekList;
    },

    dateClassMap() {
      return this.dateClassList.reduce((map, dateObj) => {
        map[dateObj.date] = dateObj.className;
        return map;
      }, {});
    },

    dateList() {
      const firstOfMonth = startOfMonth(this.currentMonth);
      const lastOfMonth = endOfMonth(this.currentMonth);
      const firstOfDateList = startOfWeek(firstOfMonth, { weekStartsOn: this.firstDayOfWeek });
      const lastOfDateList = endOfWeek(lastOfMonth, { weekStartsOn: this.firstDayOfWeek });
      const dayList = eachDay(firstOfDateList, lastOfDateList);

      const dateList = [];
      let i = 0;
      for (let j = 0; j < dayList.length / 7; j++) {
        let list = [];
        for (let k = 0; k < 7; k++, i++) {
          list.push(dayList[i]);
        }
        dateList.push(list);
      }

      return dateList;
    },
  },

  watch: {
    selectedDate(newDate) {
      if (!isSameDay(newDate, this.currentDate)) {
        this.currentDate = newDate;
        this.currentMonth = newDate;
      }
    },
  },

  methods: {
    format,
    isSameDay,
    isSameMonth,
    isToday,

    toToday() {
      const today = new Date();
      if (this.startDate && today < this.startDate) {
        this.$emit('exceed-start-date');
      } else if (this.endDate && today > this.endDate) {
        this.$emit('exceed-end-date');
      } else {
        this.currentDate = today;
        this.currentMonth = new Date();
        this.$emit('select', today);
      }
    },
    toDate(date) {
      if (this.startDate && date < this.startDate) {
        this.$emit('exceed-start-date');
      } else if (this.endDate && date > this.endDate) {
        this.$emit('exceed-end-date');
      } else {
        this.currentDate = date;
        this.$emit('select', date);
      }
    },
    onNextMonthClick() {
      const nextMonth = startOfMonth(addMonths(this.currentMonth, 1));
      if (this.endMonth && nextMonth > this.endMonth) {
        this.$emit('exceed-end-month');
      } else {
        this.currentMonth = nextMonth;
        this.$emit('next-month');
      }
    },
    onPrevMonthClick() {
      const prevMonth = endOfMonth(subMonths(this.currentMonth, 1));
      if (this.startMonth && prevMonth < this.startMonth) {
        this.$emit('exceed-start-month');
      } else {
        this.currentMonth = prevMonth;
        this.$emit('prev-month');
      }
    },
  },
};
</script>

<style lang="scss">
.container {
  background: #fff;
}

.calendar {
  padding: 5px 0 7px;
  background: #fff;

  &__header {
    display: flex;
    justify-content: space-between;
    padding: 4px 10px;
    line-height: 20px;
  }

  &__paginator {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 142px;

    &__current-month {
      font-size: 14px;
      color: #333;
    }

    .van-icon {
      font-weight: 700;
    }
  }

  &__btn-today {
    font-size: 14px;
    color: #00b389;
  }

  &__body {
    padding: 0 10px;
  }

  &__week-list {
    display: flex;
    justify-content: space-between;
    margin: 12px 0;
    line-height: 20px;
  }

  &__week-text {
    width: 38px;
    font-size: 14px;
    color: #333;
    text-align: center;
  }

  &__table {

    &__row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
    }

    &__cell {
      width: 38px;
      height: 38px;
      font-size: 14px;
      line-height: 38px;
      color: #ccc;
      text-align: center;
      background: #f9fafb;
      border-radius: 50%;
      box-sizing: border-box;

      &.date--normal {}

      &.date--today {
        color: #00b389;
      }

      &.date--selected {
        line-height: 34px;
        border: 2px solid #ccc;
      }

      &.date--current-month {}

      &.date--not-current-month {}

      &.date--hidden {
        visibility: hidden;
      }
    }
  }
}
</style>
