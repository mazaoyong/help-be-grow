<template>
  <div class="block-calendar">
    <vis-calendar
      class="calendar-extend"
      :active="daysList"
      show-switch
      mode="week"
      @clickDate="onClickDate"
      @today="onActiveToady"
      @jump="onJump"
      @modeChange="onModeChange"
    />
  </div>
</template>

<script>
import { calendar } from '@youzan/vis-ui';
import {
  format,
} from 'date-fns';
import { createNamespacedHelpers } from 'vuex';
import {
  SET_CURRENT_YEAR,
  SET_CURRENT_MONTH,
  SET_QUERY_DATE,
  SET_LIST_PAGE_NUMBER,
} from '../../../../store/modules/schedule-list/mutation-types';

const {
  mapState,
  mapActions,
  mapMutations,
} = createNamespacedHelpers('scheduleList');

export default {
  name: 'block-calendar',

  components: {
    'vis-calendar': calendar,
  },

  computed: {
    ...mapState({
      daysList: state => state.calendar.daysList,
      fetched: state => state.calendar.fetched,
      currentYear: state => state.calendar.currentYear,
      currentMonth: state => state.calendar.currentMonth,
    }),
  },

  methods: {
    ...mapMutations({
      setPageNumber: SET_LIST_PAGE_NUMBER,
      setQueryDate: SET_QUERY_DATE,
      setCurrentYear: SET_CURRENT_YEAR,
      setCurrentMonth: SET_CURRENT_MONTH,
    }),
    ...mapActions([
      'fetchDaysList',
      'fetchScheduleList',
    ]),

    onClickDate(selectedDate) {
      this.setPageNumber(1);
      this.setQueryDate(format(selectedDate.date, 'YYYY/MM/DD'));
      this.fetchScheduleList({
        type: 'jump',
      });
    },

    onActiveToady(selectedDate) {
      if (this.fetched) {
        this.setPageNumber(1);
        this.setQueryDate(format(selectedDate.date, 'YYYY/MM/DD'));
        this.fetchScheduleList({
          type: 'jump',
        });
      }
    },

    onJump(info) {
      const date = new Date(info.currentYear, info.currentMonth - 1, info.currentDate);
      this.setCurrentYear(new Date(date).getFullYear());
      this.setCurrentMonth(new Date(date).getMonth() + 1);
      this.fetchDaysList();
    },

    onModeChange(_, date) {
      this.setCurrentYear(new Date(date).getFullYear());
      this.setCurrentMonth(new Date(date).getMonth() + 1);
      this.fetchDaysList();
    },
  },
};
</script>

<style lang="postcss">
.block-calendar {
  z-index: 1;

  .calendar-extend {
    padding: 20px 0 10px;
    box-shadow: 0 1px 7px 0 rgba(50, 50, 51, .1);
  }
}
</style>
