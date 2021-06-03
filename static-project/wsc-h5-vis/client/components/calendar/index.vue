<template>
  <div class="card-panel calendar">
    <div class="calendar-header">
      <div class="flex-middle">
        <div class="prev" @click="prevMonth">
          <van-icon name="arrow-left" />
        </div>
        <div>{{ current }}</div>
        <div class="next" @click="nextMonth">
          <van-icon name="arrow" />
        </div>
      </div>
      <div class="today" @click="goCurrentDay">
        <img src="https://img01.yzcdn.cn/wsc/edu/calendar/today.png" alt="">
      </div>
    </div>

    <div class="calendar-days row">
      <div v-for="(item, index) in calendarHeader" :key="index" class="col col-center">
        {{ item }}
      </div>
    </div>

    <div class="calendar-body">
      <div v-for="(days, index) in rows" :key="index" class="row">
        <div v-for="(day, index) in days" :key="index" class="col calendar-body-cell">
          <div :class="getDayClass(day)" @click="onDateClick(day)">
            <slot name="full" :day="day">
              {{ isCurrentDay(day)?'今' : format(day, "D") }}
            </slot>
            <slot :day="day" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  format,
  parse,
  addDays,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  isSameDay,
} from 'date-fns';

export default {
  name: 'calendar',

  data() {
    return {
      calendarHeader: ['日', '一', '二', '三', '四', '五', '六'],
      currentMonth: new Date(),
      selectedDate: new Date(),
    };
  },

  computed: {
    current() {
      return this.format(this.currentMonth, 'YYYY 年 MM月');
    },
    monthStart() {
      return startOfMonth(this.currentMonth);
    },
    monthEnd() {
      return endOfMonth(this.currentMonth);
    },
    startDate() {
      return startOfWeek(this.monthStart);
    },
    endDate() {
      return endOfWeek(this.monthEnd);
    },
    rows() {
      const rows = [];
      let day = this.startDate;

      while (day <= this.endDate) {
        const days = [];
        for (let i = 0; i < 7; i++) {
          days.push(parse(day));
          day = addDays(day, 1);
        }
        rows.push(days);
      }
      return rows;
    },
  },

  methods: {
    onDateClick(date) {
      this.selectedDate = date;
      this.$emit('change', date);
      if (!this.isCurrentMonth(date)) {
        this.currentMonth = date;
        this.$emit('monthchange', date);
      }
    },
    // 返回当天
    goCurrentDay() {
      this.currentMonth = new Date();
      this.selectedDate = new Date();
      this.$emit('monthchange', this.currentMonth);
      this.$emit('change', this.selectedDate);
    },
    format(date, dateFormat) {
      return format(date, dateFormat);
    },
    // 上一月
    prevMonth() {
      this.currentMonth = subMonths(this.currentMonth, 1);
      this.$emit('monthchange', this.currentMonth);
    },
    // 下一月
    nextMonth() {
      this.currentMonth = addMonths(this.currentMonth, 1);
      this.$emit('monthchange', this.currentMonth);
    },
    isCurrentDay(date) {
      return isSameDay(date, new Date());
    },
    isCurrentMonth(date) {
      return isSameMonth(date, this.currentMonth);
    },
    isSelectDay(date) {
      return isSameDay(date, this.selectedDate);
    },
    getDayClass(date) {
      let className = 'round';

      if (this.isCurrentDay(date)) {
        className += ' today';
      }
      if (this.isSelectDay(date)) {
        className += ' selected';
      }
      if (!this.isCurrentMonth(date)) {
        className += ' disabled';
      }

      return className;
    },
  },
};
</script>

<style lang="scss">

.calendar {
  padding: 15px;
  font-size: 14px;
  line-height: 20px;
  color: #333;

  &-header {
    position: relative;
    width: 100%;
    height: 22px;
    margin-bottom: 15px;
    line-height: 22px;
    text-align: center;

    .prev,
    .next {
      width: 30px;

      .van-icon {
        font-weight: bold;
      }
    }

    .today {
      position: absolute;
      top: 0;
      right: 15px;

      img {
        width: 20px;
        height: 22px;
      }
    }
  }

  &-days {
    margin-bottom: 20px;
  }

  &-body {
    color: #574f60;

    .row {
      margin-bottom: 15px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    &-cell {
      width: 38px;
      line-height: 38px;
      text-align: center;

      .round {
        position: relative;
        width: 38px;
        height: 38px;
        border-radius: 50%;
      }

      .today {
        background-color: #f9fafb;
      }

      .selected {
        color: #fff;
        background-color: #f44;
      }

      .disabled {
        color: #999;
      }
    }
  }
}

.row {
  display: flex;
  width: 100%;
  padding: 0;
  flex-direction: row;
  flex-wrap: nowrap;
}

.col {
  flex-grow: 1;
  flex-basis: 0;
  max-width: 100%;
}

.col-start {
  justify-content: flex-start;
  text-align: left;
}

.col-center {
  justify-content: center;
  text-align: center;
}

.col-end {
  justify-content: flex-end;
  text-align: right;
}

.row-center {
  justify-content: center;
}

.flex-middle {
  display: flex;
  width: 160px;
  margin: 0 auto;
  text-align: center;
  justify-content: space-between;

  .van-icon {
    vertical-align: middle;
  }
}

</style>
