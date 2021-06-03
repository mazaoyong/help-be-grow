<template>
  <van-datetime-picker
    type="datetime"
    v-bind="$props"
    @cancel="$emit('close')"
    @confirm="onConfirm"
  />
</template>

<script>
import { DatetimePicker } from 'vant';

export default {
  name: 'datetime-picker',

  components: {
    [DatetimePicker.name]: DatetimePicker,
  },

  // 需要透传的属性在这里加
  // eslint-disable-next-line vue/require-prop-types
  props: ['minDate', 'maxDate', 'value', 'formatter'],

  methods: {
    onConfirm(value) {
      this.$emit('resolve', value);
    },
  },
};
</script>
