<template>
  <div class="ui-date-time-tabs-picker">
    <div class="van-hairline--top-bottom van-picker__toolbar">
      <div
        role="button"
        tabindex="0"
        class="van-picker__cancel"
        @click="onCancel"
      >
        取消
      </div>
      <div class="van-ellipsis van-picker__title">请选择日期时间</div>
      <div
        role="button"
        tabindex="0"
        class="van-picker__confirm"
        @click="onConfirm"
      >
        确认
      </div>
    </div>
    <van-tabs color="#00b389">
      <van-tab title="日期">
        <van-datetime-picker
          type="date"
          v-model="selectedDate"
          :max-date="now"
          :show-toolbar="false"
          :formatter="formatter"
        />
      </van-tab>
      <van-tab title="时间">
        <van-datetime-picker
          type="time"
          v-model="selectedTime"
          :show-toolbar="false"
          :formatter="formatter"
        />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { Tabs, Tab, DatetimePicker } from 'vant';
import formatDate from '@youzan/utils/date/formatDate';
export default {
  name: 'ui-datetime-tabs-picker',
  components: {
    'van-tabs': Tabs,
    'van-tab': Tab,
    'van-datetime-picker': DatetimePicker,
  },
  props: {
    value: {
      type: Date,
      default() {
        return new Date();
      },
    },
  },
  data() {
    return {
      currentDate: new Date(),
      selectedDate: new Date(),
      selectedTime: formatDate(Date.now(), 'HH:mm'),
      now: new Date(),
    };
  },
  watch: {
    selectedDate() {
      this.updateCurrentDate();
    },
    selectedTime() {
      this.updateCurrentDate();
    },
  },
  methods: {
    updateCurrentDate() {
      const date = formatDate(this.selectedDate, 'YYYY/MM/DD');
      const time = this.selectedTime;
      this.currentDate = new Date(`${date} ${time}`);
      this.$emit('input', this.currentDate);
    },
    onConfirm() {
      this.$emit('confirm', this.currentDate);
    },
    onCancel() {
      this.$emit('cancel');
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
  },
};
</script>

<style lang="postcss">
.ui-date-time-tabs-picker {
  .van-picker__confirm,
  .van-picker__cancel {
    color: #00b389;
  }

  .van-tabs__nav {
    z-index: 1;
    transform: translateZ(0);
  }
}
</style>
