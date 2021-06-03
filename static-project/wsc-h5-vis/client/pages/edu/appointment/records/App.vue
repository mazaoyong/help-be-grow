<template>
  <vis-page-container v-if="isInited">
    <template v-if="selectedDate === 'all' && !recordList.length">
      <no-course
        class="no-records"
        desc="暂无预约记录"
      />
      <div
        class="no-records__button"
        @click="onNavigateToList"
      >
        立即约课
      </div>
    </template>

    <div
      v-else
      class="appointment-records"
    >
      <div
        class="picker-trigger"
        @click="onPickerTriggerClick"
      >
        {{ selectedDateString }}
        <vis-icon
          class="picker-trigger__icon"
          name="video"
          size="8"
        />
      </div>

      <van-list
        v-if="recordList.length"
        v-model="isListLoading"
        :finished="isListFinished"
        class="record-list"
        finished-text="没有更多了"
        @load="onListLoad"
      >
        <info-card
          v-for="record in recordList"
          :key="record.id"
          :title="record.eduCourseName"
          :body-list="[{
            icon: 'course',
            value: record.lessonContent,
            hidden: !record.lessonContent
          }, {
            icon: 'time',
            value: `${format(record.startTime, 'YYYY-MM-DD HH:mm')}-${format(record.endTime, 'HH:mm')}`,
          }]"
          :show-status="record.status === 5"
          status-text="已取消"
          @click.native="onNavigateToDetail(record.studentLessonNo, record.kdtId)"
        />
      </van-list>

      <template v-else>
        <no-course
          class="no-records"
          desc="当月没有预约记录"
        />
      </template>

      <van-popup
        v-model="showPicker"
        position="bottom"
      >
        <van-picker
          :columns="pickerColumns"
          show-toolbar
          @confirm="onPickerConfirm"
          @cancel="onPickerCancel"
          @change="onPickerChange"
        />
      </van-popup>
      <!-- <picker /> -->
    </div>
  </vis-page-container>
</template>

<script>
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { List, Picker, Popup, Toast } from 'vant';
import { InfoCard, Icon } from '@youzan/vis-ui';
import * as SafeLink from '@youzan/safe-link';
import VisPageContainer from '../../components/page-container';
import NoCourse from '../../components/no-course';
import AppointmentApi from '../api';

const pickerMonths = [
  '01月',
  '02月',
  '03月',
  '04月',
  '05月',
  '06月',
  '07月',
  '08月',
  '09月',
  '10月',
  '11月',
  '12月',
];

export default {
  name: 'appointment-records',

  components: {
    'van-list': List,
    'van-picker': Picker,
    'van-popup': Popup,
    'vis-icon': Icon,
    InfoCard,
    VisPageContainer,
    NoCourse,
  },

  data() {
    return {
      isInited: false,

      showPicker: false,
      pickerYears: [],
      pickerColumnMonths: [],
      pickerCoumnYears: [],
      selectedYear: 0,
      selectedMonth: 0,
      selectedYearIndex: 0,
      selectedMonthIndex: 0,
      selectedDate: 'all',
      selectedDateString: '全部',

      total: 0,
      pageSize: 10,
      pageNumber: 1,
      isListLoading: false,
      isListFinished: false,
      recordList: [],
    };
  },

  computed: {
    pickerColumns() {
      return [
        { values: this.pickerCoumnYears, defaultIndex: this.selectedYearIndex },
        {
          values: this.selectedYearIndex ? pickerMonths : this.pickerColumnMonths,
          defaultIndex: this.selectedMonthIndex,
        },
      ];
    },
  },

  created() {
    // 生成 picker 数据
    const pickerYears = [];
    const startYear = 2019;
    const endYear = new Date().getFullYear() + 5;
    this.pickerCoumnYears.push('全部');
    for (let i = startYear; i <= endYear; i++) {
      this.pickerCoumnYears.push(`${i}年`);
      pickerYears.push(i);
    }
    this.pickerYears = pickerYears;

    // 获取当月预约记录
    this.fetchRecordList();
  },

  methods: {
    format,

    fetchRecordList(isRefresh = false) {
      if (isRefresh) {
        this.pageNumber = 1;
        this.recordList = [];
        this.isListFinished = false;
      }

      const params = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
      };
      if (this.selectedDate !== 'all') {
        params.startTime = format(this.selectedDate[0], 'YYYY-MM-DD HH:mm:ss');
        params.endTime = format(this.selectedDate[1], 'YYYY-MM-DD HH:mm:ss');
      }

      AppointmentApi
        .getRecordList(params)
        .then(res => {
          if (!res) return;

          this.recordList = [
            ...this.recordList,
            ...res.content,
          ];
          this.total = res.total;
          if (this.recordList.length >= this.total) {
            this.isListFinished = true;
          } else {
            this.isListFinished = false;
          }
        })
        .catch(err => {
          console.error(err);
          Toast(err);
          this.isListFinished = true;
        })
        .finally(() => {
          this.isInited = true;
          this.isListLoading = false;
        });
    },
    navigateToDetail(studentLessonNo, kdtId) {
      const reUrl = `/wscvis/edu/appointment/detail?kdt_id=${kdtId}&studentLessonNo=${studentLessonNo}`;
      SafeLink.redirect({
        url: reUrl,
        kdtId,
      });
    },
    navigateToList(studentLessonNo) {
      const reUrl = `/wscvis/edu/appointment/list?kdt_id=${window._global.kdt_id}`;
      SafeLink.redirect({
        url: reUrl,
        kdtId: window._global.kdt_id,
      });
    },

    onListLoad() {
      this.pageNumber++;
      this.fetchRecordList();
    },
    onPickerConfirm(values, indexes) {
      this.showPicker = false;
      const oldDateStr = this.selectedDateString;
      this.selectedYearIndex = indexes[0];
      this.selectedMonthIndex = indexes[1];

      if (indexes[0]) {
        this.selectedYear = this.pickerYears[indexes[0] - 1];
        this.selectedMonth = indexes[1];
        const monthDate = new Date(this.selectedYear, this.selectedMonth, 1);
        this.selectedDate = [
          startOfMonth(monthDate),
          endOfMonth(monthDate),
        ];
        this.selectedDateString = format(monthDate, 'YYYY[年]MM[月]');
      } else {
        this.selectedYear = '';
        this.selectedMonth = '';
        this.selectedDate = 'all';
        this.selectedDateString = '全部';
      }

      if (this.selectedDateString !== oldDateStr) {
        this.fetchRecordList(true);
      }
    },
    onPickerCancel() {
      this.showPicker = false;
    },
    onPickerTriggerClick() {
      this.showPicker = true;
    },
    onNavigateToDetail(studentLessonNo, kdtId) {
      this.navigateToDetail(studentLessonNo, kdtId);
    },
    onNavigateToList() {
      this.navigateToList();
    },
    onPickerChange(picker, values) {
      if (values[0] !== '全部') {
        picker.setColumnValues(1, pickerMonths);
      } else {
        picker.setColumnValues(1, []);
      }
    },
  },
};
</script>

<style lang="scss">
.no-records {
  margin-top: 130px;

  &__button {
    margin: 20px auto 0;
    box-sizing: border-box;
    padding: 0 22px;
    width: 100px;
    line-height: 28px;
    white-space: nowrap;
    font-size: 14px;
    color: #00b389;
    border: 1px solid #00b389;
    border-radius: 22px;
  }
}

.appointment-records {
  padding: 0 10px;

  .picker-trigger {
    display: inline-block;
    margin: 15px 0 0;
    padding: 0 10px 0 16px;
    line-height: 30px;
    font-size: 13px;
    color: #7d7e80;
    background: #fff;
    border-radius: 22px;

    &__icon {
      vertical-align: 1px;
    }
  }

  .record-list {
    margin-top: 8px;
  }

  // 课节名称最多显示一行，超出用...截断
  .table-list-item__value {
    display: -webkit-inline-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
