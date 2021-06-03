<template>
  <card-cell
    title="时间"
    tip="选择意向时间"
    :value="value"
    border
    :is-editable="isEditable"
    @click="onClickCell"
  />
</template>

<script>
import { startOfHour, startOfDay, endOfDay, format } from 'date-fns';

import { CardCell } from '@/pages/trade/buy/components/card';
import { openDatetimePicker } from '@/components/datetime-picker-popup';

const DATE_TYPE_NAME = {
  year: '年',
  month: '月',
  day: '日',
};
const now = new Date();

export default {
  name: 'time-cell',

  components: {
    CardCell,
  },

  props: {
    chosenTime: {
      type: Date,
      default: undefined,
    },

    startAt: {
      type: Number,
      default: new Date(now.getFullYear() - 10, 0, 1).getTime(),
    },

    endAt: {
      type: Number,
      default: new Date(now.getFullYear() + 10, 11, 31).getTime(),
    },

    isEditable: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    minDate() {
      const nowDate = now.getTime();
      if (nowDate < this.startAt || nowDate > this.endAt) {
        return new Date(this.startAt);
      }

      return startOfDay(now);
    },

    maxDate() {
      return endOfDay(new Date(this.endAt));
    },

    value() {
      if (!this.chosenTime) {
        return '';
      }
      return format(new Date(this.chosenTime), 'YYYY-MM-DD HH:mm');
    },
  },

  methods: {
    onClickCell() {
      openDatetimePicker({
        props: {
          value: this.chosenTime
            ? new Date(this.chosenTime)
            : startOfHour(new Date()),
          minDate: this.minDate,
          maxDate: this.maxDate,
          formatter: this.formatter,
        },
      }).then(time => {
        this.$emit('change', time);
      });
    },

    formatter(type, value) {
      const typeName = DATE_TYPE_NAME[type];
      return typeName ? value + typeName : value;
    },
  },
};
</script>
