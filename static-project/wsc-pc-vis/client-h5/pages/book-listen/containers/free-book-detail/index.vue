<template>
  <div class="free-book-listen-container">
    <div class="free-book-listen-container__stu wrap">
      <van-cell title="学员" is-link>
        <template v-if="studentId">
          <span :style="{ marginRight: '5px' }">{{ selectedStu.name }}</span>
          <span>{{ selectedStu.mobile }}</span>
        </template>
      </van-cell>
    </div>

    <div class="wrap">
      <van-cell-group>
        <van-cell
          :class="eduCourseId ? 'active' : ''"
          title="试听课程"
          is-link
          @click="onSelectCourse"
        >{{ courseName || '请选择试听课程(必填)' }}</van-cell>
        <van-cell
          :class="scheduleDate ? 'active' : ''"
          title="试听时间"
          is-link
          @click="onSelectSchedule"
        >
          <span v-if="scheduleDate">{{ scheduleDate }}</span>
          <span v-else>请选择上课日程(必填)</span>
        </van-cell>
      </van-cell-group>
    </div>

    <div class="schedule" v-if="courseName">
      <p>
        参照课程表，安排试听时间
        <a href="javascript:;" @click="viewSchedule">查看课程表</a>
      </p>
    </div>

    <div class="wrap comment">
      <span class="text-num">{{ comment.length }}/200</span>
      <van-field
        v-model="comment"
        type="textarea"
        placeholder="请输入备注"
        rows="4"
        maxlength="200"
      />
    </div>

    <div class="fixed-button">
      <van-notice-bar
        class="notice-no-classes"
        v-if="showNoClasses"
        text="该课程当天无排课，可考虑更改上课时间，也可继续保存"
      />
      <div class="fixed-inner">
        <van-button
          class="green-button"
          :class="{active: isCanSave}"
          round
          :loading="isSaving"
          @click="onSave"
        >保存</van-button>
      </div>
    </div>

    <!-- 选择课程弹框 -->
    <van-popup
      v-model="isShowPop"
      class="free-book-listen-container__course p-safeArea"
      position="bottom"
    >
      <select-pop-content
        :title="selectPopTitle"
        :selected-course-id="eduCourseId"
        @selected="onSelectedCourse"
        @cancelCourse="onCancelCourse"
      />
    </van-popup>

    <!-- 选择时间弹框 -->
    <van-popup v-model="isShowCalendar" position="bottom">
      <select-date-day-time @cancel="isShowCalendar = false" @confirm="onConfirmDate" />
    </van-popup>

    <!-- 查看日程弹框 -->
    <van-popup v-model="isShowSchedule" position="bottom">
      <div class="view-schedule">
        <calendar
          class="view-schedule-calendar"
          mode="week"
          :active="availableDates"
          :selected="calendarSelectedDate"
          :min-date="currentDate"
          @clickDate="onClickDate"
          @jump="onDateJump"
        />
        <div class="view-schedule-list">
          <div v-show="isScheduleEmpty && !isScheduleLoading" class="empty-tip">
            <div class="inner">
              <img
                class="img"
                src="https://b.yzcdn.cn/public_files/2018/11/19/bfc666f3eb05081b88d7353f43e18123.png"
              />
              <p>暂无课程</p>
            </div>
          </div>
          <div v-show="!isScheduleEmpty" class="course-list">
            <course-item v-for="(n, i) in scheduleList" :key="i" v-bind="n" />
          </div>
        </div>
        <van-button class="green-button active" @click="isShowSchedule = false">知道了</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Cell, CellGroup, Field, Button, Popup, Toast, NoticeBar } from 'vant';
import { Calendar } from '@youzan/vis-ui';
import formatDate from '@youzan/utils/date/formatDate';
import Args from 'zan-utils/url/args';
import SelectPopContent from '../../components/SelectPopContent';
import SelectDateDayTime from '../../components/SelectDateDayTime';
import CourseItem from './course-item';

const dayMs = 24 * 60 * 60 * 1000;

export default {
  name: 'free-book-listen',

  components: {
    'van-cell-group': CellGroup,
    'van-cell': Cell,
    'van-field': Field,
    'van-button': Button,
    'van-popup': Popup,
    'van-notice-bar': NoticeBar,
    Calendar,
    SelectPopContent,
    CourseItem,
    SelectDateDayTime,
  },

  data() {
    return {
      studentInfo: '',
      courseName: '',
      schedule: '',
      address: '',
      comment: '',
      selectPopTitle: '课程',
      isShowPop: false,
      isShowCalendar: false,
      isShowSchedule: false,
      eduCourseId: 0,
      selectedStu: {},
      selectedSchedule: {},
      scheduleDate: '',
      scheduleList: [],
      calendarSelectedDate: new Date(),
      availableDates: [],
      studentLessonNo: Args.get('studentLessonNo') || '',
      studentId: Args.get('studentId') || 0,
      paramStudentId: Args.get('paramStudentId') || 0,
      clueId: Args.get('clueId') || 0,
      fetched: false,
      bookListenInfo: {},
      currentDate: new Date(),
      showNoClasses: false,
      isScheduleLoading: false,
      isSaving: false,
    };
  },

  computed: {
    isCanSave() {
      return this.studentId && this.eduCourseId && this.scheduleDate;
    },
    isScheduleEmpty() {
      return this.scheduleList.length === 0;
    },
  },

  created() {
    this.selectedCourse = this.$store.getters['selectedCourse'] || {};
    this.selectedStu = this.$store.getters['selectedStu'] || {};
    this.studentId = this.selectedStu.id || this.studentId;
    this.courseName = this.selectedCourse.name;
    this.eduCourseId = this.selectedCourse.id;
    if (this.studentLessonNo) {
      this.fetchAppointment();
    } else if (this.studentId && !this.selectedStu.id) {
      this.fetchStudents();
    } else {
    }
  },

  methods: {
    fetchAppointment() {
      this.$store
        .dispatch('fetchAppointment', { studentLessonNo: this.studentLessonNo })
        .then(res => {
          this.selectedStu = {
            name: res.studentName,
            id: this.studentId,
          };
          this.$store.dispatch('updateSelectedStu', this.selectedStu);
        })
        .finally(() => {
          this.fetched = true;
        });
    },

    fetchStudents() {
      const filter = {
        studentNo: this.studentId,
      };

      this.$store.dispatch('fetchStudents', { filter }).then((res = {}) => {
        const content = res.content;
        this.selectedStu = content[0].student;
        this.$store.dispatch('updateSelectedStu', this.selectedStu);
      });
    },

    onSelectStudent() {
      if (!this.isDisabled) {
        this.$router.push({ path: 'student-list' });
      }
    },

    onSelectCourse() {
      this.isShowPop = true;
    },

    viewSchedule() {
      this.isShowSchedule = true;
    },

    onSelectedCourse(item) {
      this.courseName = item.name;
      this.eduCourseId = item.id;
      this.$store.dispatch('updateSelectedCourse', item);
      this.isShowPop = false;

      // 重新选择课程后，需要刷新下课程表
      this.showNoClasses = false;
      this.loadDateLessons(this.calendarSelectedDate).then(data => {
        if (this.scheduleDate && data) {
          this.showNoClasses = data.length === 0;
        }
      });
      this.loadAvailableDates(new Date(formatDate(this.calendarSelectedDate, 'YYYY/MM/DD 0:00')));
    },

    onCancelCourse() {
      this.isShowPop = false;
    },

    onSelectSchedule() {
      if (this.selectedStu.id && this.eduCourseId) {
        this.isShowCalendar = true;
      } else {
        Toast('请先选择学员或课程');
      }
    },

    onConfirmDate(value) {
      this.scheduleDate = formatDate(value, 'YYYY-MM-DD HH:mm');
      this.isShowCalendar = false;

      this.showNoClasses = false;
      const theDate = new Date(formatDate(value, 'YYYY/MM/DD 0:00'));
      this.loadDateLessons(theDate).then(data => {
        if (data) this.showNoClasses = data.length === 0;
      });
      this.loadAvailableDates(theDate);
    },

    onSave() {
      if (this.isCanSave) {
        const params = {
          comment: this.comment,
          studentId: this.paramStudentId,
          eduCourseId: this.eduCourseId,
          appointmentDate: this.scheduleDate + ':00',
        };

        this.isSaving = true;
        this.$store
          .dispatch('createClueAppointment', params)
          .then(res => {
            this.$router.go(-1);
          })
          .catch(e => {
            this.isSaving = false;
            Toast(e.msg || e);
          });
      }
    },
    onClickDate(e) {
      this.loadDateLessons(e.date);
    },
    loadDateLessons(_date) {
      const formattedDate = formatDate(_date, 'YYYY/MM/DD');
      const date = new Date(formattedDate + ' 0:00');

      if (formatDate(this.calendarSelectedDate, 'YYYY/MM/DD') !== formattedDate) {
        this.calendarSelectedDate = date;
      }
      this.scheduleList = [];
      if (!this.eduCourseId) return;

      const startTime = date.getTime();
      const endTime = startTime + dayMs - 1;

      const params = {
        startTime,
        endTime,
        eduCourseId: this.eduCourseId,
        courseType: 0,
        studentAsset: {
          studentId: this.studentId,
        },
      };

      this.isScheduleLoading = true;
      return this.$store
        .dispatch('fetchLessonList', { query: params })
        .then(data => {
          this.scheduleList = data || [];
          this.isScheduleLoading = false;
          return data;
        })
        .catch(e => {
          Toast(e.msg || e);
          this.isScheduleLoading = false;
        });
    },
    loadAvailableDates(date) {
      const day = date.getDay() > 0 ? date.getDay() : 7;
      const weekStartDate = new Date(date.getTime() - (day - 1) * dayMs);
      const weekEndDate = new Date(date.getTime() + (7 - day) * dayMs);

      const startTime = weekStartDate.getTime();
      const endTime = weekEndDate.getTime() + dayMs - 1;

      const params = {
        startTime,
        endTime,
        eduCourseId: this.eduCourseId,
        courseType: 0,
        studentAsset: {
          studentId: this.studentId,
        },
      };

      this.availableDates = [];
      this.$store.dispatch('fetchDaysList', { query: params }).then(data => {
        this.availableDates = data || [];
      });
    },
    onDateJump(e) {
      if (e.type === 'today') {
        const nowDate = new Date(formatDate(Date.now(), 'YYYY/MM/DD 0:00'));
        this.loadDateLessons(nowDate);
        this.loadAvailableDates(nowDate);
      } else if (e.type === 'next_week' || e.type === 'pre_week') {
        const date = new Date(e.currentYear, e.currentMonth - 1, e.currentDate);
        this.loadAvailableDates(date);
      }
    },
  },
};
</script>

<style lang="postcss">
.free-book-listen-container {
  min-height: 100vh;
  padding: 10px;
  background-color: #f2f2f2;

  &__stu {
    .van-cell {
      &__value {
        color: #969799 !important;
      }

      &__right-icon {
        visibility: hidden;
      }
    }
  }

  .wrap {
    margin-bottom: 10px;
    border-radius: 6px;
    background-color: #fff;

    .van-cell {
      background-color: transparent;
      font-size: 14px;
      color: #646566;

      &__value {
        text-align: left;
        flex: 3;
        color: #ccc;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &.active {
        .van-cell__value {
          color: #323233;
        }
      }

      &.disabled {
        background-color: #f8f8f8;

        .van-cell__value {
          color: #969799;
        }
      }

      &__right-icon {
        align-self: center;
      }
    }

    .van-cell:not(:last-child)::after {
      right: 15px;
    }

    .van-cell-group {
      background-color: transparent;
    }

    &.comment {
      position: relative;
      padding-bottom: 15px;

      .text-num {
        position: absolute;
        bottom: 10px;
        right: 15px;
        font-size: 12px;
        color: #c8c9cc;

        &::-webkit-input-placeholder {
          color: #c8c9cc;
        }
      }
    }
  }

  .schedule {
    margin-bottom: 10px;
    font-size: 12px;
    color: #969799;

    a {
      color: #00b389;
    }
  }

  .fixed-button {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 10px;
    font-size: 16px;

    .notice-no-classes {
      font-size: 13px;
      height: 32px;
      margin-bottom: 10px;
    }

    .fixed-inner {
      padding: 0 10px;
    }
  }

  .green-button {
    width: 100%;
    color: #969699;
    background-color: #dcdee0;

    &.active {
      color: #fff;
      background-color: #00b389;
    }
  }

  .view-schedule {
    &-calendar {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      padding-top: 15px;
    }

    &-list {
      box-sizing: border-box;
      height: 276px;
      padding: 15px 10px;
      overflow-y: scroll;

      .empty-tip {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #999;
        text-align: center;

        .img {
          width: 80px;
          margin-bottom: 5px;
        }
      }
    }
  }
}
</style>
