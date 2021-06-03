<template>
  <div class="punch-list-header">
    <mini-calendar
      :start-date="calendar.startDate"
      :end-date="calendar.endDate"
      :task-state="calendar.taskState"
      :task-init="calendar.hasInit"
      :choose-date="chooseDate"
      :loading="loading"
      @click-time="invokeChangePunchTime"
    >
      <user-info :avatar="user.avatar" @click.native="onAvatarClick" />
    </mini-calendar>
  </div>
</template>
<script>
import { Toast } from 'vant';
import { mapActions, mapState } from 'vuex';
import * as SafeLink from '@youzan/safe-link';

import MiniCalendar from '../components/calendar';
import UserInfo from '../components/user-info';

export default {
  name: 'punch-list-header',
  components: {
    'mini-calendar': MiniCalendar,
    'user-info': UserInfo,
  },

  data() {
    return {
      loading: false,
    };
  },

  computed: mapState({
    alias: state => state.alias,
    calendar: state => state.calendar,
    user: state => state.user,
    chooseDate: state => state.calendar.chooseDate,
    allowStudentView: state => state.allowStudentView,
    taskConfig: state => state.task.config,
  }),

  async mounted() {
    // 初始化数据
    const alias = this.alias;
    const chooseDate = this.chooseDate;
    // 获取打卡时间范围区间
    await this.getCalendarList({ alias, taskDate: chooseDate });
    // 检查购买状态
    await this.checkBoughtStatus();
    try {
      // 根据时间获取任务详情
      await this.getTaskDetail({ taskDate: chooseDate });
      if (!this.allowStudentView) {
        // 校验当前任务是否完成，完成才请求日历信息
        if (!await this.checkPunchState()) {
          return;
        }
      }
      // 获取打卡日历详情
      await this.getDiaryList(this.taskConfig);
    } catch (err) {
      console.error(err);
      Toast((err && err.message) || '网络错误');
    };
  },

  methods: {
    ...mapActions([
      'getCalendarList',
      // 打卡日历内容的更新都在这里
      'handleClickTime',
      'getTaskDetail',
      'getDiaryList',
      'checkBoughtStatus',
      'checkBoughtStatus',
      'checkPunchState',
      'setChooseDate',
    ]),

    invokeChangePunchTime(...args) {
      if (this.loading === false) {
        this.loading = true;
        window.scrollTo(0, 0);
        this.handleClickTime(...args).finally(() => (this.loading = false));
      }
    },

    onAvatarClick() {
      const kdtId = _global.kdt_id;
      SafeLink.redirect({
        url: `/wscvis/supv/punch/rank?kdtId=${kdtId}&alias=${this.alias}`,
        kdtId: kdtId,
      });
    },
  },
};
</script>
<style lang="scss">
.punch-list-header {
  position: fixed;
  top: 0;
  z-index: 1007;
  width: 100%;
}
</style>
