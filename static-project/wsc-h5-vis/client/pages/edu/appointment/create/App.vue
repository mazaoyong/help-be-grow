<template>
  <vis-page-container>
    <div class="appointment">
      <search-container
        v-if="applycourseType === 1"
        @choose="onCourseIdChange"
        @cancel="onSearchCancel"
      />

      <van-dropdown-menu v-if="addressList.length > 1 || teacherList.length > 1">
        <van-dropdown-item
          v-if="teacherList.length > 1"
          v-model="selectedTeacher"
          :options="teacherList"
          @change="handleTeacherChange"
        />
        <van-dropdown-item
          v-if="addressList.length > 1"
          v-model="selectedAddress"
          :options="addressList"
          @change="handleAddressChange"
        />
      </van-dropdown-menu>

      <calendar
        ref="calendar"
        class="appointment-calendar"
        :active="calendarData"
        :selected="currentDate"
        mode="week"
        show-switch
        auto-locate
        @clickDate="onDateChange"
        @today="onDateChange"
        @jump="onCalendarJump"
        @modeChange="onModeChange"
        @showdate="onShowDate"
      />

      <van-list
        v-if="appointmentList.length && pageFrom === 'order'"
        v-model="isListLoading"
        :finished="isListFinished"
        class="appointment-list"
        finished-text=""
        @load="onListLoad"
      >
        <info-card
          v-for="appointment in appointmentList"
          :key="appointment.id"
          :title="appointment.title"
          :show-status="!!appointment.statusText"
          :status-text="appointment.statusText"
          :body-list="appointment.bodyList"
          :footer-list="appointment.moreInfo"
          :show-map-btn="isEduSingleStore ? !!appointment.addressId : !!(appointment.addressWrapDTO
            && appointment.addressWrapDTO.longitude)"
          show-more
          :show-mode="!!appointment.statusText ? 'show' : 'checkbox'"
          :checked="appointment.checked"
          @navigate-to-map="onNavigateToMap(appointment)"
          @change="onCheckedInfoCard(appointment, $event)"
        >
          <van-tag
            v-if="(appointment.stock <= 10
              || appointment.stock < (appointment.appointmentCountLimit * 0.3))
              && appointment.stock !== 0"
            slot="area-after-subtitle"
            class="appointment-list__info-tag"
            plain
          >
            仅剩{{ appointment.stock }}名额
          </van-tag>
        </info-card>
      </van-list>

      <van-list
        v-else-if="appointmentList.length && pageFrom !== 'order'"
        v-model="isListLoading"
        :finished="isListFinished"
        class="appointment-list"
        finished-text=""
        @load="onListLoad"
      >
        <info-card
          v-for="appointment in appointmentList"
          :key="appointment.lessonNo"
          :title="appointment.title"
          :show-action="!!appointment.actionType"
          :action-type="appointment.actionType"
          :action-name="appointment.actionName"
          :action-text="appointment.actionText"
          :show-status="!!appointment.statusText"
          :status-text="appointment.statusText"
          :body-list="appointment.bodyList"
          :footer-list="appointment.moreInfo"
          :show-map-btn="isEduSingleStore ? !!appointment.addressId : !!(appointment.addressWrapDTO
            && appointment.addressWrapDTO.longitude)"
          show-more
          @cancel-appointment="onAppointmentCancel(appointment)"
          @make-appointment="onAppointmentMake(appointment)"
          @navigate-to-map="onNavigateToMap(appointment)"
        />
      </van-list>
      <no-course
        v-else
        class="appointment__no-course"
        desc="暂无可预约的课程"
      />

      <appointment-footer
        v-if="pageFrom === 'order'"
        :appointment-list="appointmentList"
        @confirm="onFooterConfirmMixinsOrder"
        @close="onFooterCloseMixinsOrder"
      />
    </div>
  </vis-page-container>
</template>

<script>
import { list, Tag, Toast, DropdownMenu, DropdownItem } from 'vant';
import get from 'lodash/get';
import Args from 'zan-utils/url/args';
import { InfoCard, Calendar } from '@youzan/vis-ui';
import NoCourse from '../../components/no-course';
import Footer from './components/Footer';
import SearchContainer from './components/SearchContainer';
import VisPageContainer from '../../components/page-container';
import { isEduSingleStore } from '@youzan/utils-shop';
import { isSameDate } from './utils';
import mixinsPage from './mixins/page-mixins';
import mixinsOrderPage from './mixins/order-page-mixins';
import AppointmentApi from '../api';
import * as SafeLink from '@youzan/safe-link';
import { setMonth } from 'date-fns';

const pageFrom = Args.get('pageFrom');
const applycourseType = +Args.get('applycourseType');
const mixinsName = pageFrom === 'order' ? mixinsOrderPage : mixinsPage;
const originEduCourseIds = Args.get('eduCourseIds') || '';

export default {
  name: 'appointment',

  components: {
    'van-list': list,
    InfoCard,
    NoCourse,
    VisPageContainer,
    Calendar,
    'appointment-footer': Footer,
    [Tag.name]: Tag,
    'search-container': SearchContainer,
    'van-dropdown-menu': DropdownMenu,
    'van-dropdown-item': DropdownItem,
  },

  mixins: [mixinsName],

  data() {
    return {
      // 列表页传递参数
      eduCourseIds: originEduCourseIds,

      pageFrom: pageFrom,
      applycourseType: applycourseType, // 该线下课是对应通用课时包还是指定课程 1：通用 0：指定

      currentMonth: new Date(),
      currentDate: new Date(),
      calendarData: [],

      totalPages: 0,
      pageSize: 10,
      pageNumber: 1,
      isListLoading: false,
      isListFinished: false,
      appointmentList: [],
      isEduSingleStore,

      calendarMode: 'week',

      studentInfo: {
        year: 4,
        month: 3,
      },

      // 通过老师和上课地点筛选日程
      selectedTeacher: '',
      selectedAddress: '',
      teacherList: [
        { text: '全部老师', value: '' },
      ],
      addressList: [
        { text: '全部上课地点', value: '' },
      ],
    };
  },

  created() {
    // 页面类型
    // pageFrom=order 来源下单页

    // 获取当月日历数据
    this.updateData();

    // 获取学员信息
    this.fetchStudentInfo();
    // 获取上课地点和老师列表
    this.fetchAddressList();
    this.fetchTeacherList();
  },

  methods: {
    updateData() {
      this.fetchCalendarData()
        .then(_ => {
          this.currentDate = this.calendarData.length
            ? new Date(this.calendarData[0])
            : new Date();
          this.$nextTick(() => {
            this.$refs.calendar.onChooseSelectedDay();
          });
          this.fetchAppointmentList(true);
        })
        .catch(errMsg => Toast(errMsg));
    },

    fetchAddressList() {
      AppointmentApi.getAddressList()
        .then(res => {
          if (res && res.length) {
            this.addressList = [
              { text: '全部上课地点', value: '' },
              ...res.map(address => {
                return {
                  text: address.name,
                  value: address.id,
                };
              }),
            ];
          }
        })
        .catch(err => {
          console.error(err);
        });
    },

    fetchTeacherList() {
      AppointmentApi.getTeacherList()
        .then(res => {
          if (get(res, 'content.length', 0)) {
            this.teacherList = [
              { text: '全部老师', value: '' },
              ...res.content.map(teacher => {
                return {
                  text: teacher.teacherName || teacher.staffName || '',
                  value: teacher.resourceNo,
                };
              }),
            ];
          }
        })
        .catch(err => {
          console.error(err);
        });
    },

    navigateToMap(appointment) {
      if (isEduSingleStore) {
        if (!appointment.addressId) return;
        const reUrl = `/wscvis/edu/map?kdt_id=${window._global.kdt_id}&storeIds=[${appointment.addressId}]`;
        SafeLink.redirect({
          url: reUrl,
          kdtId: window._global.kdt_id,
        });
      } else {
        if (appointment.addressWrapDTO && appointment.addressWrapDTO.longitude) {
          const addressWrapDTO = appointment.addressWrapDTO;
          const reUrl = `/wscvis/edu/map?kdt_id=${window._global.kdt_id}&longitude=${addressWrapDTO.longitude}
          &latitude=${addressWrapDTO.latitude}&province=${addressWrapDTO.province}&city=${addressWrapDTO.city}
          &district=${addressWrapDTO.district}&address=${addressWrapDTO.address}`;
          SafeLink.redirect({
            url: reUrl,
            kdtId: window._global.kdt_id,
          });
        }
      }
    },

    onListLoad() {
      this.pageNumber++;
      this.fetchAppointmentList();
    },

    onNavigateToMap(appointment) {
      this.navigateToMap(appointment);
    },

    onDateChange({ date }) {
      console.log('切换日期 ', date);

      if (isSameDate(this.currentDate, date)) return;

      this.currentDate = date;
      this.fetchAppointmentList(true);
    },

    fetchStudentInfo() {
      AppointmentApi
        .getStudentInfo({
          studentId: this.studentId,
        })
        .then(res => {
          this.studentInfo = res;
        })
        .catch(err => {
          console.error(err);
          Toast(err);
        })
        .finally(() => {

        });
    },

    onCalendarJump({ currentYear, currentMonth, currentDate }) {
      this.currentMonth.setYear(currentYear);
      this.currentMonth = setMonth(this.currentMonth, currentMonth - 1);
      this.currentMonth.setDate(currentDate);
      this.fetchCalendarData();
    },

    // 日期面板的切换
    onModeChange(mode, date) {
      console.log('calendar mode', mode, date);
      this.currentMonth.setYear(date.getFullYear());
      this.currentMonth = setMonth(this.currentMonth, date.getMonth());
      this.currentMonth.setDate(date.getDate());
      // this.currentMonth = date;
      this.calendarMode = mode;
      this.fetchCalendarData();
    },

    // 日历自动定位事件
    onShowDate(date) {
      console.log('自动定位有值的一天', date);
      if (isSameDate(this.currentDate, date)) return;

      this.currentDate = date;
      this.fetchAppointmentList(true);
    },

    getAgeSuitable(appointment) {
      let isAgeSuitable = true;
      let ageMessage = '';

      if (appointment.minApply !== 10000) {
        const studentMonth = this.studentInfo.monthAge;
        const studentYear = this.studentInfo.age;
        const studentName = this.studentInfo.name;
        const ageFragment = appointment.minApply === appointment.maxApply
          ? appointment.minApply
          : `${appointment.minApply}-${appointment.maxApply}`;
        if (appointment.applyType === 0 && studentMonth) {
          if (studentMonth < appointment.minApply || studentMonth > appointment.maxApply) {
            ageMessage = `课程适用于月龄${ageFragment}个月，不适合${studentName}（${studentMonth}个月）学习，继续预约本次课程吗？`;
            isAgeSuitable = false;
          }
        } else if (appointment.applyType === 1 && studentYear) {
          if (studentYear < appointment.minApply || studentYear > appointment.maxApply) {
            ageMessage = `课程适用于年龄${ageFragment}岁，不适合${studentName}（${studentYear}岁）学习，继续预约本次课程吗？`;
            isAgeSuitable = false;
          }
        }
      }

      return [isAgeSuitable, ageMessage];
    },

    handleTeacherChange(newTeacher) {
      this.selectedTeacher = newTeacher;
      this.fetchCalendarData();
      this.fetchAppointmentList(true);
    },

    handleAddressChange(newAddress) {
      this.selectedAddress = newAddress;
      this.fetchCalendarData();
      this.fetchAppointmentList(true);
    },

    onCourseIdChange(item) {
      this.eduCourseIds = item.id;
      this.updateData();
    },
    onSearchCancel() {
      this.eduCourseIds = originEduCourseIds;
      this.updateData();
    },
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';

.appointment {
  .calendar {
    padding: 14px 0 8px;
    background-color: #fff;
  }

  &-list {
    margin-top: 16px;
    padding: 0 10px;

    &__info-tag {
      margin-top: 8px;
      color: #00b389 !important;
    }
  }

  &__no-course {
    margin-top: 40px;
  }

  .table-list-item__value {
    @include multi-ellipsis(1);
  }

  .van-dropdown-item {
    z-index: 100 !important;
  }

  .dialog-status {
    .van-dialog__message {
      white-space: pre-wrap;
    }
  }

  .van-dropdown-menu {
    padding: 0 16px;

    :first-child {
      margin-right: 16px;
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
