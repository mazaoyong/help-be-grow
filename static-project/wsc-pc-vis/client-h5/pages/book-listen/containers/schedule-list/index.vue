<template>
  <div class="schedule-list">
    <block-filter />
    <block-calendar />
    <block-list />
    <block-add-schedule />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import BlockFilter from './blocks/block-filter';
import BlockCalendar from './blocks/block-calendar';
import BlockList from './blocks/block-list';
import BlockAddSchedule from './blocks/block-add-schedule';
import {
  SET_STUDENT_ID,
} from '../../store/modules/schedule-list/mutation-types';

const {
  mapActions,
  mapMutations,
} = createNamespacedHelpers('scheduleList');

export default {
  name: 'schedule-list',

  components: {
    BlockFilter,
    BlockCalendar,
    BlockList,
    BlockAddSchedule,
  },

  created() {
    this.setStudentId(this.$route.query.studentId);
    this.fetchDaysList();
  },

  // 其实可以放在 created 里当作初始化的逻辑
  // 但是放在 beforeRouteLeave 更符合？逻辑
  beforeRouteLeave(to, from, next) {
    this.resetFilter();
    next();
  },

  methods: {
    ...mapMutations({
      setStudentId: SET_STUDENT_ID,
    }),
    ...mapActions([
      'fetchDaysList',
      'fetchScheduleList',
      'resetFilter',
    ]),
  },
};
</script>

<style lang="postcss">
.schedule-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  .block-filter,
  .block-calendar {
    flex: 0 0 auto;
  }

  .block-list {
    flex: 1 1 0;
  }
}
</style>
