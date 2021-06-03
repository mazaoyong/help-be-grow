<template>
  <section>
    <van-field
      v-model="stateValue"
      v-bind="this.$attrs"
      :class="`${prefix}-panel panel text-type`"
      :type="type"
      :label="label"
      :required="required"
      :error-message="errorConf.isError ? errorConf.errorMsg : ''"
      :placeholder="getPlaceholder"
      @input="handleValueChange"
    />
  </section>
</template>
<script>
import { Field } from 'vant';

import getPlaceholderFromProps from '../utils/get-placeholder-from-props';

export default {
  name: 'text-type',

  components: {
    [Field.name]: Field,
  },

  props: {
    prefix: {
      type: String,
      default: 'se__field',
    },
    value: {
      type: [Number, String],
      default: undefined,
    },
    name: {
      type: [Number, String],
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    errorConf: {
      type: Object,
      default: () => ({
        isError: false,
        errorMsg: '',
      }),
    },
  },

  data() {
    return {
      stateValue: (this.value || '').toString(),
    };
  },

  computed: {
    getPlaceholder() {
      const defaultPlaceholder = this.placeholder || '请输入';
      return getPlaceholderFromProps(this.$attrs, defaultPlaceholder);
    },
  },

  watch: {
    'value': function(newVal) {
      this.stateValue = newVal;
    },
  },

  methods: {
    handleValueChange(value) {
      this.$emit('change', this.name, value);
    },
  },
};
</script>
<style lang="postcss">
.se__field-panel.text-type {}
</style>
