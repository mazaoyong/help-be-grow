<template>
  <div class="container">
    <search-filter
      :dropdown-options="dropdownOptions"
      :default-drop-down-value="defaultDropDownValue"
      placeholder="请输入老师姓名或手机号"
      @searchResultChange="searchChange"
    />
    <switch-bar
      v-if="!isEduSingleStore && !isWscApp"
      :campus-name="campusName"
      :campus-total="campusTotal"
    />
    <!-- 日历组件 开始 -->
    <calendar
      class="calendar-extend"
      :active="active"
      show-switch
      auto-switch
      :mode="calendarMode"
      @modeChange="onCalendarModeChange"
      @clickDate="onClickDate"
      @today="onActiveToday"
      @jump="onJump"
    />
    <!-- 日历组件 结束 -->

    <!-- 课程列表容器 开始 -->
    <div class="lesson-list-container">
      <!-- 课程列表 开始 -->
      <van-list
        v-if="lessonList.length > 0"
        v-model="isLessonListLoading"
        class="lesson-list"
        :finished="isFinished"
        :error.sync="isError"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <info-card
          v-for="(lesson, index) in lessonList"
          :key="index"
          class="info-card__wrapper"
          :title="lesson.className || lesson.eduCourseName"
          :body-list="[
            {
              icon: 'course',
              iconColor: '#00b389',
              value: lesson.categoryName,
              hidden: !lesson.categoryName,
            },
            {
              icon: 'time',
              iconColor: '#00b389',
              value: lesson.timeRange,
              hidden: !lesson.timeRange,
            },
          ]"
          :footer-list="[
            { name: '课程', value: lesson.eduCourseName },
            isEduSingleStore
              ? { name: '上课地点', value: lesson.address, hidden: !lesson.address }
              : { name: '上课校区', value: lesson.shopName, hidden: !lesson.shopName },
            { name: '教室', value: lesson.classroomName, hidden: !lesson.classroomName },
            {
              name: '上课人数',
              value: `实到 ${lesson.currentStudentNum} / 应到 ${lesson.totalStudentNum}`,
            },
            {
              name: '老师',
              value: lesson.teacherNames && lesson.teacherNames.join('、'),
              hidden: !(lesson.teacherNames && lesson.teacherNames.length),
            },
            {
              name: '助教',
              value: lesson.assistantNames && lesson.assistantNames.join('、'),
              hidden: !(lesson.assistantNames && lesson.assistantNames.length),
            },
          ]"
          :show-map-btn="!!lesson.address"
          :title-tag-text="lesson.isTrial ? '试听' : ''"
          @navigate-to-map="onNavigateToMap(lesson)"
          @click.native="onNavigateToSignIn(lesson.lessonNo, lesson.kdtId)"
        />
      </van-list>
      <!-- 课程列表 结束 -->

      <!-- 课程列表空状态 开始 -->
      <div v-else-if="isNotLoading && lessonList.length === 0" class="no-lesson-list">
        <span class="tip">暂无课程</span>
      </div>
      <!-- 课程列表空状态 结束 -->
    </div>
    <!-- 课程列表容器 结束 -->

    <!-- 底部tab 开始 -->
    <tab v-if="!isWscApp" active="lesson" />
    <!-- 底部tab 结束 -->
  </div>
</template>

<script>
// import calendar from 'components/calendar/index.vue';
import tab from 'components/tab/index.vue';
import { addMonths, format, startOfWeek, endOfWeek, addWeeks } from 'date-fns';
import { InfoCard, calendar } from '@youzan/vis-ui';
import { Toast, List } from 'vant';
import { lesson } from 'pages-api';
import ZNB from '@youzan/znb';
import switchBar from '../../components/switch-bar';
import searchFilter from './components/search-filter';

import { isEduSingleStore } from '@youzan/utils-shop';
import UA from '@youzan/utils/browser/ua_browser';
import { logVisLessonList } from './log';

const global = window._global;
const { kdtId, roleId } = window._global;
const pageSize = 10;
export const TEACHER_TYPE = 0;
export const ASSISTANT_TYPE = 1;
const WEEK_MODE = 'week';
const MONTH_MODE = 'month';
ZNB.init({ kdtId });

export default {
  name: 'lesson-list',
  components: {
    calendar: calendar,
    tab: tab,
    'info-card': InfoCard,
    'van-list': List,
    'switch-bar': switchBar,
    'search-filter': searchFilter
  },
  data() {
    return {
      dropdownOptions: [
        {
          text: '老师',
          value: TEACHER_TYPE,
          requestDataFunc: lesson.GetTeachersByKeyword,
          paramsExtra: { source: 0 }
        },
        {
          text: '助教',
          value: ASSISTANT_TYPE,
          requestDataFunc: lesson.GetAssistantsByKeyword,
          paramsExtra: { source: 0 }
        }
      ],
      defaultDropDownValue: TEACHER_TYPE,
      isEduSingleStore,
      calendarMode: WEEK_MODE,
      isGetDateList: false,
      isNotLoading: false,
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth() + 1,
      currentDay: new Date().getDate(),
      active: [], // 日历有课程的列表
      lessonList: [],
      pageNumber: 1,
      queryDate: '', // 当前选中的需要查询课程的日期
      isTeacher: roleId === 21 || roleId === 27, // 登录的角色是否是老师，roleId为21的时候，角色为老师 27 为助教
      isFinished: false, // 滚动加载是否已经无数据
      isError: false, // 滚动加载失败
      isLessonListLoading: false,
      campusName: global.shopInfo && global.shopInfo.shopName,
      campusTotal: global.campusInfo && global.campusInfo.total,
      isWscApp: UA.isWsc(),
      teacherIds: [],
      assistantIds: [],
      teacherType: TEACHER_TYPE
    };
  },
  mounted() {
    // 埋点：访问课表页
    logVisLessonList();

    this.getDateList();
  },
  methods: {
    onCalendarModeChange(val) {
      this.calendarMode = val;
      this.getDateList();
    },
    searchChange(val) {
      const { type, selectedValue } = val;
      this.teacherType = type;
      if (type === TEACHER_TYPE) {
        this.teacherIds = selectedValue.map(item => item.id);
        this.assistantIds = [];
      } else {
        this.teacherIds = [];
        this.assistantIds = selectedValue.map(item => item.id);
      }
      this.getDateList();
      this.getLessonList('jump');
    },
    // 获取日历对应的课程时间
    getDateList() {
      const { startTime, endTime } = this.formatTime();
      lesson
        .GetDateList({
          isTeacher: this.isTeacher,
          startTime,
          endTime,
          teacherIds: this.teacherIds,
          assistantIds: this.assistantIds
        })
        .then(res => {
          this.active = res || [];
          this.isGetDateList = true;
        })
        .catch(err => {
          this.isGetDateList = true;
          Toast(err);
        });
    },
    // 获取课程列表
    getLessonList(type = '') {
      lesson
        .GetLessons({
          isTeacher: this.isTeacher,
          pageNumber: this.pageNumber,
          pageSize,
          teacherIds: this.teacherIds,
          queryDate: this.queryDate,
          assistantIds: this.assistantIds
        })
        .then(res => {
          if (res && res.content) {
            if (type === 'jump') {
              this.lessonList = res.content || [];
            } else {
              this.lessonList = this.lessonList.concat(res.content);
            }
            this.isFinished = this.pageNumber >= res.totalPages;
          }
          this.isNotLoading = true;
          this.isLessonListLoading = false;
        })
        .catch(err => {
          this.isError = true;
          this.isNotLoading = true;
          this.isLessonListLoading = false;
          Toast(err);
        });
    },
    onLoad() {
      if (this.isNotLoading) {
        this.isNotLoading = false;
        this.pageNumber++;
        this.getLessonList();
      }
    },
    onNavigateToSignIn(lessonNo, targetKdtId) {
      window.location.href = `/v4/vis/h5/edu/sign-in?lessonNo=${lessonNo}&kdtId=${targetKdtId}`;
    },
    // 跳转到地图页
    onNavigateToMap(lesson) {
      if (!lesson.addressId) {
        Toast('该课程未设置上课地点');
        return;
      }
      ZNB.navigate({
        url: `/v4/vis/h5/edu/map?storeIds=[${lesson.addressId}]`,
        weappUrl: `/pages/map/index?addressId=${lesson.addressId}&kdtId=${kdtId}`
      });
    },
    onClickDate(selectedDate) {
      this.pageNumber = 1;
      this.queryDate = format(selectedDate.date, 'YYYY-MM-DD');
      this.getLessonList('jump');
    },
    onActiveToday(selectedDate) {
      if (this.isGetDateList) {
        this.pageNumber = 1;
        this.queryDate = format(selectedDate.date, 'YYYY-MM-DD');
        this.getLessonList('jump');
      }
    },
    onJump(info) {
      const year = this.currentYear;
      const month = this.currentMonth - 1; // 传给new Date()的时候月份需要减1
      const day = this.currentDay;
      let JUMP;
      if (this.calendarMode === WEEK_MODE) {
        JUMP = {
          pre_week: addWeeks(new Date(year, month, day), -1),
          next_week: addWeeks(new Date(year, month, day), 1),
          today: new Date()
        };
      } else if (this.calendarMode === MONTH_MODE) {
        JUMP = {
          pre: addMonths(new Date(year, month), -1),
          next: addMonths(new Date(year, month), 1),
          today: new Date()
        };
      }
      const date = JUMP[info.type];
      this.currentYear = new Date(date).getFullYear();
      this.currentMonth = new Date(date).getMonth() + 1;
      this.currentDay = new Date(date).getDate();
      this.getDateList();
    },
    formatTime() {
      const year = this.currentYear;
      const month = this.currentMonth - 1; // 传给new Date()的时候月份需要减1
      const day = this.currentDay;
      let firstDayOfMonth, lastDayOfMonth, firstDayOfCalendar, lastDayOfCalendar;
      if (this.calendarMode === 'month') {
        firstDayOfMonth = new Date(year, month, 1); // 当前月份的第一天
        lastDayOfMonth = new Date(year, month + 1, 0); // 获取当前月份的最后一天
        firstDayOfCalendar = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 }); // 显示在日历中的第一天
        lastDayOfCalendar = endOfWeek(lastDayOfMonth, { weekStartsOn: 1 }); // 显示在日历中的最后一天
      } else if (this.calendarMode === 'week') {
        let date = new Date(year, month, day);
        firstDayOfCalendar = startOfWeek(date, { weekStartsOn: 1 }); // 显示在日历中的第一天
        lastDayOfCalendar = endOfWeek(date, { weekStartsOn: 1 }); // 显示在日历中的最后一天
      }

      const startTime = format(firstDayOfCalendar, 'YYYY-MM-DD');
      const endTime = format(lastDayOfCalendar, 'YYYY-MM-DD');

      return {
        startTime: `${startTime} 00:00:00`,
        endTime: `${endTime} 23:59:59`
      };
    }
  }
};
</script>

<style lang="scss">
.container {
  width: 100%;
  min-height: 100%;
  font-size: 15px;
  background-color: #f7f8fa;
  .calendar-extend {
    padding: 20px 0 10px;
    z-index: 10;
  }
  .lesson-list-container {
    padding: 0 0 70px;
    .lesson-list {
      padding: 0 10px;
    }
    .no-lesson-list {
      position: absolute;
      top: 365px;
      left: 50%;
      transform: translate(-50%, 0);
      width: 80px;
      height: 124px;
      background-image: url('https://b.yzcdn.cn/public_files/2019/03/12/9d9c065ca679da115f7b547c99dbf3d1.png');
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 80px 80px;
      .tip {
        display: inline-block;
        position: absolute;
        left: 7px;
        bottom: 0;
        font-size: 14px;
        color: #999;
        line-height: 1;
      }
    }
  }

  .info-card__wrapper .info-card__title-tag {
    border-radius: 20px;
    color: #00b389;
    background-color: rgba(0, 179, 137, 0.1);
    line-height: 14px;
    padding: 4px 8px;
  }
}
</style>
