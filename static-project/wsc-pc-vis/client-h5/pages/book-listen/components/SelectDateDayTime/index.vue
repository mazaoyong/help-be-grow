<template>
  <div class="ui-date-day-time-select">
    <van-picker
      show-toolbar
      title="选择时间"
      :columns="columns"
      @change="onChange"
      @confirm="onConfirm"
      @cancel="onCancel"
    />
  </div>
</template>

<script>
import { Picker } from 'vant';
import columns, { dateList, getHours, getMinutes } from './columns';

export default {
  name: 'select-date-day-time',
  components: {
    'van-picker': Picker,
  },
  data() {
    return {
      columns,
      now: new Date(),
    };
  },
  methods: {
    onConfirm(values, indexs) {
      const hour = parseInt(values[1], 10);
      const minute = parseInt(values[2], 10);
      this.$emit('confirm', new Date(`${dateList[indexs[0]].replace(/-/g, '/')} ${hour}:${minute}`));
    },
    onCancel() {
      this.$emit('cancel');
    },
    refreshHours(picker, hour = 0) {
      picker.setColumnValues(1, getHours(hour));
    },
    refreshMinutes(picker, minute = 0) {
      picker.setColumnValues(2, getMinutes(minute));
    },
    onChange(picker, values, index) {
      const now = this.now;
      if (picker.getIndexes()[0] === 0) {
        // 针对今天的时间，需要做特殊处理
        const curHour = now.getHours();
        const curMinute = now.getMinutes();
        this.refreshHours(picker, curHour);
        if (parseInt(picker.getValues()[1], 10) === curHour) {
          this.refreshMinutes(picker, curMinute);
        } else {
          this.refreshMinutes(picker);
        }
      } else {
        this.refreshHours(picker);
        this.refreshMinutes(picker);
      }
    },
  },
};
</script>

<style lang="postcss">
.ui-date-day-time-select {
  .van-picker__columns {
    padding: 0 30px;
  }

  .van-picker-column {
    &:nth-child(1) {
      flex-grow: 2;
    }

    &:nth-child(2) {
      padding-left: 20%;
    }
  }
}
</style>
