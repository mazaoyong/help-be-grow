<template>
  <div class="punch-calendar">
    <calendar
      :selected-date="selectedDate"
      :date-class-list="dateClassList"
      :start-date="startDate"
      :end-date="endDate"
      :start-month="startDate"
      :end-month="endDate"
      @exceed-start-month="onMonthExceed"
      @exceed-end-month="onMonthExceed"
      @exceed-start-date="onMonthExceed"
      @exceed-end-date="onMonthExceed"
      @select="onSelected"
    />
  </div>
</template>

<script>
import { Toast } from 'vant';
import Calendar from '../calendar';

export default {
  name: 'punch-calendar',

  components: {
    Calendar,
  },

  props: {
    time: { // endAt, startAt
      type: Object,
      default() {
        return {};
      },
    },
    dateStatusList: { // taskDate, customerTaskStatus case 1 not 2 com 3 bu
      type: Array,
      default() {
        return [];
      },
    },
  },

  data() {
    return {
      selectedDate: new Date(),
    };
  },

  computed: {
    startDate() {
      return new Date(this.time.startAt.replace(/-/g, '/'));
    },

    endDate() {
      return new Date(this.time.endAt.replace(/-/g, '/'));
    },

    dateClassList() {
      return this.dateStatusList.map(dateObj => ({
        date: dateObj.taskDate,
        className: [
          'date--active',
          'date--active date--not-completed',
          'date--active date--completed',
          'date--active date--delay',
        ][dateObj.customerTaskStatus],
      }));
    },
  },

  watch: {
    time({ endAt }) {
      let endAtTime = new Date(this.time.endAt.replace(/-/g, '/'));
      if (Date.now() > endAtTime) { // 打卡已结束
        this.selectedDate = endAtTime;
      }
    },
  },

  methods: {
    onSelected(date) {
      if (date > Date.now()) {
        Toast('此日期打卡任务还未开始');
        return;
      }
      this.$emit('select', date);
    },
    onMonthExceed() {
      Toast('该日期已不在打卡周期范围内');
    },
  },
};
</script>

<style lang="scss">
.punch-calendar {

  .date--active {
    color: #333;
  }

  .date--not-completed {
    color: #fff;
    background: #999;

    &.date--selected {
      border-color: #666;
    }
  }

  .date--delay {
    color: #fff;
    background: #ffbb17;

    &.date--selected {
      border-color: #f5a623;
    }
  }

  .date--completed {
    color: #fff;
    background: #00b389;

    &.date--selected {
      border-color: #00a17b;
    }
  }
}
</style>
