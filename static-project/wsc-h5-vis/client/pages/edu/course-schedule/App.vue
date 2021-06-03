<template>
  <vis-page-container>
    <login-tip v-if="isShowLoginTip" />
    <div class="course-schedule">
      <div
        class="course-schedule__stu"
        @click="onShowSelectStu"
      >
        <span>{{ selectedStu.name }}</span>
        <vis-icon :name="iconName" size="14px" color="#969799" />
      </div>
      <calendar
        :active="calendarData"
        :selected="currentDate"
        @today="onDateChange"
        @clickDate="onDateChange"
        @jump="onCalendarJump"
      />

      <no-course
        v-if="isNoList"
        class="course-schedule__no-course"
        desc="暂无上课日程"
      />

      <div
        v-else
        class="course-schedule__list"
      >
        <info-card
          v-for="appointment in appointedList"
          :key="appointment.id"
          :title="appointment.lessonName || appointment.eduCourse && appointment.eduCourse.name || ''"
          :title-tag-text="appointment.courseType === 0 ? '体验课' : ''"
          :footer-list="getFooterList(appointment)"
          :show-map-btn="getShowMapBtn(appointment)"
          @navigate-to-map="onNavigateToMap(appointment)"
        />

        <template v-if="directedList.length">
          <h2>以下课程无需预约，可直接到店上课</h2>
          <info-card
            v-for="appointment in directedList"
            :key="appointment.id"
            :title="appointment.lessonName || appointment.eduCourse && appointment.eduCourse.name || ''"
            :title-tag-text="appointment.courseType === 0 ? '体验课' : ''"
            :footer-list="getFooterList(appointment)"
            :show-map-btn="getShowMapBtn(appointment)"
            @navigate-to-map="onNavigateToMap(appointment)"
          />
        </template>

        <template v-if="unappointedList.length">
          <h2>以下课程尚未约定上课时间</h2>
          <info-card
            v-for="appointment in unappointedList"
            :key="appointment.id"
            :title="appointment.lessonName || appointment.eduCourse && appointment.eduCourse.name || ''"
            :title-tag-text="appointment.courseType === 0 ? '体验课' : ''"
            :footer-list="getFooterList(appointment)"
            :show-map-btn="getShowMapBtn(appointment)"
            @navigate-to-map="onNavigateToMap(appointment)"
          />
        </template>
      </div>
    </div>

    <!-- 选择学员列表 -->
    <van-popup
      v-model="showStuPop"
      class="course-schedule__stu-pop"
      overlay-class="course-schedule__stu-pop-overlay"
      :close-on-click-overlay="false"
    >
      <div>
        <div
          v-for="(item, index) in studentList"
          :key="index"
          :class="['course-schedule__stu-pop-sort', selectedStu.id === item.id ? 'checked tag-text' : '']"
          @click="onSelectStu(item)"
        >
          <span>{{ item.name }}</span>
          <vis-icon :name="selectedStu.id === item.id ? 'check-selected' : ''" size="14px" :color="themeColor" />
        </div>
      </div>
    </van-popup>
  </vis-page-container>
</template>

<script>
import { startOfMonth, endOfMonth, startOfDay, endOfDay, format, isSameDay, isSameMonth, isSameYear } from 'date-fns';
import { Toast, Popup } from 'vant';
import { InfoCard, Calendar, Icon } from '@youzan/vis-ui';
import NoCourse from '../components/no-course';
import VisPageContainer from '../components/page-container';
import AppointmentApi from './api';
import Args from 'zan-utils/url/args';
import { isEduSingleStore } from '@youzan/utils-shop';
import { themeColor } from 'common/constants';
import LoginTip from '@/components/login-tip';
import * as SafeLink from '@youzan/safe-link';

const globalTheme = window._global.globalTheme;

const isSameDate = (d1, d2) => {
  return isSameDay(d1, d2) && isSameMonth(d1, d2) && isSameYear(d1, d2);
};

export default {
  name: 'appointment',

  components: {
    InfoCard,
    NoCourse,
    VisPageContainer,
    Calendar,
    // StudentFilter,
    'van-popup': Popup,
    'vis-icon': Icon,
    'login-tip': LoginTip,
  },

  data() {
    let currentDate = new Date();
    const date = Args.get('date');
    if (date) {
      const newDate = new Date(+date);
      if (!isNaN(newDate)) {
        currentDate = newDate;
      }
    }

    return {
      currentDate,
      currentMonth: startOfMonth(currentDate),
      calendarData: [],

      appointedList: [],
      unappointedList: [],
      directedList: [],

      studentList: [
        {
          id: null,
          name: '全部学员',
        },
      ],
      selectedStu: {
        name: '全部学员',
        id: Args.get('studentId') || null,
      },
      iconName: 'arrow-down',
      showStuPop: false,
      themeColor: '',
      isShowLoginTip: !_global.buyer_id, // 如果没有buyerId，则没有用手机号登录
    };
  },

  computed: {
    isNoList() {
      return !this.appointedList.length &&
        !this.unappointedList.length &&
        !this.directedList.length;
    },
  },

  mounted() {
    this.themeColor = themeColor[globalTheme];
  },

  created() {
    this.getStudent();
    // 获取当月日历数据
    this.fetchCalendarData();
    // 获取当天课程预约列表
    this.fetchAppointmentList();
  },

  methods: {
    format,

    getStudent() {
      AppointmentApi.getStudentWidthCurrentUser()
        .then(res => {
          this.studentList = this.studentList.concat(res || []);
          this.studentList.forEach(item => {
            if (item.id === +this.selectedStu.id) {
              this.selectedStu = item;
            }
          });
        });
    },

    onSelectStu(item) {
      this.selectedStu = item;
      this.showStuPop = false;
      this.iconName = 'arrow-down';
      // 获取当月日历数据
      this.fetchCalendarData();
      // 获取当天课程预约列表
      this.fetchAppointmentList();
    },

    onShowSelectStu() {
      this.showStuPop = !this.showStuPop;
      this.iconName = this.showStuPop ? 'arrow-up' : 'arrow-down';
    },

    fetchCalendarData() {
      AppointmentApi
        .getCalendarData({
          startTime: format(startOfMonth(this.currentMonth), 'YYYY-MM-DD HH:mm:ss'),
          endTime: format(endOfMonth(this.currentMonth), 'YYYY-MM-DD HH:mm:ss'),
          studentId: this.selectedStu.id,
        })
        .then(res => {
          this.calendarData = res.validRecordList.map(item => item.date);
        })
        .catch(err => {
          console.error(err);
          Toast(err);
        })
        .finally(() => {
        });
    },

    fetchAppointmentList() {
      return AppointmentApi
        .getLessonsByDate({
          startTime: format(startOfDay(this.currentDate), 'YYYY-MM-DD HH:mm:ss'),
          endTime: format(endOfDay(this.currentDate), 'YYYY-MM-DD HH:mm:ss'),
          studentId: this.selectedStu.id,
        })
        .then(res => {
          res
            .forEach(list => {
              switch (list.type) {
                case 1:
                  this.directedList = list.lessonList;
                  break;
                case 2:
                  this.unappointedList = list.lessonList;
                  break;
                case 3:
                  this.appointedList = list.lessonList;
                  break;
                default:
                  break;
              }
            });
        })
        .catch(err => {
          console.error(err);
          Toast(err);
        })
        .finally(() => {
        });
    },

    getFooterList(appointment) {
      const campus = appointment.campus && appointment.campus.name;
      const address = appointment.courseAttendDTO && appointment.courseAttendDTO.address;

      const footerList = [
        {
          name: '上课校区',
          value: campus || '-',
          hidden: !campus || isEduSingleStore,
        },
        {
          name: '上课地点',
          value: address || '-',
          hidden: !address || !isEduSingleStore,
        },
        { name: '时间', value: appointment.startTime <= 0 ? '-' : `${format(appointment.startTime, 'YYYY-MM-DD HH:mm')}-${format(appointment.endTime, 'HH:mm')}` },
        { name: '学员', value: appointment.studentName || '-' },
      ];

      if (appointment.classroomName) {
        footerList.splice(1, 0, { name: '教室', value: appointment.classroomName });
      }

      return footerList;
    },

    navigateToMap({
      storeId,
      address = {},
      name = '',
    }) {
      if (!storeId && !address) return;

      const url = Args.add(
        '/wscvis/edu/map',
        {
          kdt_id: window._global.kdt_id,
          storeIds: storeId ? `[${storeId}]` : '',
          ...address,
          name,
        },
      );
      SafeLink.redirect({
        url,
        kdtId: window._global.kdt_id,
      });
    },

    getShowMapBtn(appointment) {
      return isEduSingleStore
        ? !!(appointment.courseAttendDTO && appointment.courseAttendDTO.address)
        : !!(appointment.campus && appointment.campus.addressWrapDTO);
    },

    onNavigateToMap(appointment) {
      if (appointment.campus && appointment.campus.name) {
        this.navigateToMap({
          address: appointment.campus && appointment.campus.addressWrapDTO,
          name: appointment.campus && appointment.campus.name,
        });
      } else {
        this.navigateToMap({
          storeId: appointment.courseAttendDTO.addressId,
        });
      }
    },

    onDateChange({ date }) {
      if (isSameDate(this.currentDate, date)) return;

      this.currentDate = date;
      this.fetchAppointmentList();
    },

    onCalendarJump({ currentYear, currentMonth }) {
      this.currentMonth.setYear(currentYear);
      this.currentMonth.setMonth(currentMonth - 1);
      this.fetchCalendarData();
    },
  },
};
</script>

<style lang="scss">
.course-schedule {

  .calendar {
    padding: 16px 0 8px;
  }

  &__list {
    margin-top: 16px;
    padding: 0 10px;

    h2 {
      margin-top: 15px;
      line-height: 17px;
      font-size: 12px;
      color: #969799;
    }
  }

  &__no-course {
    margin-top: 40px;
  }

  &__stu {
    width: 100%;
    line-height: 22px;
    padding: 9px 0;
    text-align: center;
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: #fff;
    color: #969799;
    font-size: 14px;

    .van-icon {
      margin-left: 5px;
      vertical-align: middle;
    }
  }

  &__stu-pop {
    top: 36px;
    left: 0;
    width: 101%;
    height: auto;
    padding: 10px 0;
    transition: none;
    transform: none;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 200%;
      height: 200%;
      transform: scale(.5);
      transform-origin: 0 0;
      pointer-events: none;
      box-sizing: border-box;
      border-top: 1px solid #d8d8d8;
      }

    &-sort {
      display: flex;
      justify-content: space-between;
      padding: 10px 15px;
      line-height: 20px;
      font-size: 14px;
      color: #323233;

      &.checked {
        color: #00b389;
      }
    }
    &-overlay {
      top: 36px;
    }
  }

  // 原有布局采用-webkit-box, 将显示行数限制在两行
  // 这里通过将display覆盖去除行数限制
  .info-card__title {
    display: block;
    // 避免英文，数字等不断开的视觉bug
    word-break: break-all;
  }

}
</style>
