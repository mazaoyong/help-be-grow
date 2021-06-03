<template>
  <div class="punch-list-content">
    <task-content
      :task="parsedTaskContent"
      :task-content="taskContent"
      :over-view="collapse"
      :expand="expand"
      @change-expand="expand = !expand"
    />
    <content-buttons
      v-if="hasTask"
      :button-setting="buttonSetting"
      :expand="expand"
      :over-view="collapse"
      :clock-in-times="clockInTimes"
      @click-button="handlePunchTask"
    />
  </div>
</template>
<script>
/**
 * ⚠️content内容的首次初始化在/blocks/header中
 * 在拿到打卡日历信息之后会请求当天的打卡任务和打卡记录
 */
import { mapState, mapGetters } from 'vuex';
import { get } from 'lodash';
import * as SafeLink from '@youzan/safe-link';
import buildUrl from '@youzan/utils/url/buildUrl';

import TaskContent from '../components/task-content';
import ContentButtons from '../components/content-buttons';

export default {
  name: 'punch-list-content',
  components: {
    'task-content': TaskContent,
    'content-buttons': ContentButtons,
  },

  data() {
    return {
      expand: false,
    };
  },

  computed: {
    ...mapState({
      buttonSetting: 'buttonSetting',
      taskContent: state => state.taskContent,
      parsedTaskContent: state => state.task.taskContent,
      hasTask: state => get(state, 'task.hasTask', false),
      // 是否超出显示范围
      collapse: state => get(state, 'task.taskContent.collapse', false),
      // 连续打卡时间
      clockInTimes: state => get(state, 'task.config.clockInTimes', 0),
    }),
    ...mapGetters(['getPunchTaskParams', 'getModifyDiaryParams']),
  },

  methods: {
    handlePunchTask() {
      const kdtId = _global.kdt_id;
      const { alias, canPunch, punchType, taskId } = this.getPunchTaskParams;
      const { currentDate, startDate } = this.getModifyDiaryParams;
      if (canPunch) {
        SafeLink.redirect({
          url: buildUrl(
            `/wscvis/supv/punch/edit?kdt_id=${kdtId}&alias=${alias}&taskId=${taskId}&punchType=${punchType}&pt=add&start_date=${startDate}&current_date=${currentDate}`,
            'h5',
            kdtId,
          ),
          kdtId: kdtId,
        });
      }
    },
  },
};
</script>
<style lang="scss">
.punch-list-content {
  position: relative;
  min-height: 529px;
  padding-top: 70px;
  background-color: #fff;
}
</style>
