<template>
  <card-cell
    title="预约上课"
    tip="选择课程及时间"
    border
    :is-editable="isEditable"
    @click="onClickCell"
  >
    <div v-if="value">
      {{ value }}
    </div>
    <div v-if="date">
      {{ date }}
    </div>
  </card-cell>
</template>

<script>
import { format } from 'date-fns';
import { redirectToAppointment, parseAppointment } from '../../utils';

import { Toast } from 'vant';
import { CardCell } from '@/pages/trade/buy/components/card';

export default {
  name: 'appointment-cell',

  components: {
    CardCell,
  },

  props: {
    chosenAppointment: {
      type: Object,
      default: () => ({}),
    },

    chosenStudent: {
      type: Object,
      default: () => ({}),
    },

    alias: {
      type: String,
      default: '',
    },

    skuId: {
      type: Number,
      default: 0,
    },

    applyCourseType: {
      type: Number,
      default: undefined,
    },

    isEditable: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    value() {
      const { lesson, lessonName } = this.chosenAppointment;

      if (lesson === '-1') {
        return '暂不选择';
      }

      return lessonName;
    },

    date() {
      const time = this.chosenAppointment.time || [];
      let date = '';

      if (typeof time[0] === 'number') {
        date = format(time[0], 'YYYY年MM月DD日');
        date += ` ${format(time[0], 'HH:mm')}`;
        date += `-${format(time[1], 'HH:mm')}`;
      }

      return date;
    },
  },

  mounted() {
    const appointment = parseAppointment();
    this.$emit('change', appointment);
  },

  methods: {
    onClickCell() {
      if (!this.chosenStudent.id) {
        Toast('请先选择学员');
        return;
      }

      redirectToAppointment({
        studentAlias: this.chosenStudent.alias,
        alias: this.alias,
        skuId: this.skuId,
        applyCourseType: this.applyCourseType,
      });
    },
  },
};
</script>
