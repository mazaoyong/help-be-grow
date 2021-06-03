<template>
  <div class="filter-date-select">
    <div class="filter-date-select__range">
      <span
        class="filter-date-select__range-label"
        @click="onShowDatePop('startAt')"
      >{{ startAtDesc }}</span>
      <span class="filter-date-select__range-divide" />
      <span class="filter-date-select__range-label" @click="onShowDatePop('endAt')">{{ endAtDesc }}</span>
    </div>
    <div class="filter-date-select__entry">
      <filter-option-item
        v-for="item in dateEntry"
        :key="item.id"
        :id="item.id"
        :name="item.name"
        :checked-list="checkedDateBtn"
        @checkedItem="checkedItem"
      />
    </div>

    <van-popup v-model="isShowDatePop" position="bottom" get-container="body">
      <ui-datetime-picker
        v-if="v2"
        v-model="currentDate"
        @confirm="onConfirm"
        @cancel="onCancel"
      />
      <van-datetime-picker
        v-else
        v-model="currentDate"
        type="datetime"
        title="请选择日期时间"
        :formatter="formatter"
        @confirm="onConfirm"
        @cancel="onCancel"
      />
    </van-popup>
  </div>
</template>

<script>
import { DatetimePicker, Popup, Toast } from 'vant';
import formatDate from 'zan-utils/date/formatDate';
import {
  startOfToday,
  endOfToday,
  startOfYesterday,
  endOfYesterday,
  subDays,
  getTime,
} from 'date-fns';
import FilterOptionItem from './FilterOptionItem';
import DateTimeTabsPicker from 'components/datetime-picker';

export default {
  name: 'filter-date-select',

  components: {
    'van-datetime-picker': DatetimePicker,
    'van-popup': Popup,
    FilterOptionItem,
    'ui-datetime-picker': DateTimeTabsPicker,
  },

  props: {
    startAt: {
      type: Number,
      default: 0,
    },

    endAt: {
      type: Number,
      default: 0,
    },

    checkedBtn: {
      type: Number,
      default: 0,
    },

    v2: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      isShowDatePop: false,
      startAtDesc: this.startAt ? formatDate(this.startAt, 'YYYY-MM-DD HH:mm') : '开始时间',
      endAtDesc: this.endAt ? formatDate(this.endAt, 'YYYY-MM-DD HH:mm') : '结束时间',
      startTime: 0,
      endTime: 0,
      dateEntry: [
        {
          name: '今天',
          id: 1,
        },
        {
          name: '昨天',
          id: 2,
        },
        {
          name: '近7天',
          id: 3,
        },
        {
          name: '近30天',
          id: 4,
        },
      ],
      currentDate: new Date(),
      dateType: '',
      checkedDateId: 0,
      checkedDateBtn: this.checkedBtn,
    };
  },

  watch: {
    isShowDatePop(isShowDatePop) {
      this.$emit('dateTimePickerVisibleChange', isShowDatePop);
    },
  },

  methods: {
    onShowDatePop(type) {
      this.isShowDatePop = true;
      this.dateType = type;
      this.checkedDateBtn = 0;
    },

    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      } else if (type === 'day') {
        return `${value}日`;
      } else if (type === 'hour') {
        return `${value}时`;
      } else if (type === 'minute') {
        return `${value}分`;
      }
      return value;
    },

    onConfirm(value) {
      this.dateType === 'startAt'
        ? (this.startAtDesc = formatDate(value, 'YYYY-MM-DD HH:mm'))
        : (this.endAtDesc = formatDate(value, 'YYYY-MM-DD HH:mm'));
      this.dateType === 'startAt'
        ? (this.startTime = getTime(new Date(value)))
        : (this.endTime = getTime(new Date(value)));
      this.isShowDatePop = false;
      this.dateType = '';
      this.submitDate();
    },

    onCancel() {
      this.isShowDatePop = false;
      this.dateType = '';
    },

    checkedItem(id) {
      this.checkedDateBtn = this.checkedDateBtn === id ? 0 : id;
      const currentDate = new Date();
      if (this.checkedDateBtn === 1) {
        this.startTime = getTime(startOfToday());
        this.endTime = getTime(endOfToday());
      } else if (this.checkedDateBtn === 2) {
        this.startTime = getTime(startOfYesterday());
        this.endTime = getTime(endOfYesterday());
      } else if (this.checkedDateBtn === 3) {
        this.startTime = getTime(subDays(currentDate, 6));
        this.endTime = getTime(endOfToday());
      } else if (this.checkedDateBtn === 4) {
        this.startTime = getTime(subDays(currentDate, 29));
        this.endTime = getTime(endOfToday());
      } else {
        this.startTime = 0;
        this.endTime = 0;
      }
      this.startAtDesc = formatDate(this.startTime, 'YYYY-MM-DD HH:mm');
      this.endAtDesc = formatDate(this.endTime, 'YYYY-MM-DD HH:mm');
      this.submitDate();
    },

    submitDate() {
      this.startTime = this.startTime || this.startAt;
      this.endTime = this.endTime || this.endAt;
      if (this.startTime && this.endTime && this.startTime > this.endTime) {
        Toast('结束时间必须大于开始时间');
      }
      this.$emit('checkedDate', this.startTime, this.endTime, this.checkedDateBtn);
    },

    reset() {
      this.startAtDesc = '开始时间';
      this.endAtDesc = '结束时间';
      this.checkedDateBtn = 0;
    },

    setTime(startTime, endTime) {
      if (this.startTime !== startTime || this.endTime !== endTime) {
        this.checkedDateBtn = 0;
      }
      if (startTime) {
        this.startAtDesc = formatDate(startTime, 'YYYY-MM-DD HH:mm');
        this.startTime = startTime;
      } else {
        this.startAtDesc = '开始时间';
        this.startTime = 0;
      }
      if (endTime) {
        this.endAtDesc = formatDate(endTime, 'YYYY-MM-DD HH:mm');
        this.endTime = endTime;
      } else {
        this.endAtDesc = '结束时间';
        this.endTime = 0;
      }
    },

    hideDatePop() {
      this.isShowDatePop = false;
    },
  },
};
</script>

<style lang="postcss">
.filter-date-select {
  &__range {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 32px;
    line-height: 32px;
    margin-bottom: 10px;
    max-width: 332px;

    &-label {
      width: 100%;
      text-align: center;
      border-radius: 2px;
      font-size: 13px;
      color: #969799;
      background-color: #f7f8fa;
    }

    &-divide {
      width: 15px;
      height: 1px;
      margin: 0 5px;
      background-color: #323233;
    }
  }
}
</style>
