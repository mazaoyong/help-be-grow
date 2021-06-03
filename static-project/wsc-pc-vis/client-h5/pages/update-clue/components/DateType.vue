<template>
  <section>
    <van-field
      v-model="getFormattedTime"
      readonly
      :label="label"
      :placeholder="getPlaceholder"
      :class="`${prefix}-panel panel date-type`"
      :required="required"
      :error-message="errorConf.isError ? errorConf.errorMsg : ''"
      right-icon="arrow"
      @click="toggleSelector"
    />
    <van-popup
      v-model="showSelector"
      class="popup"
      position="bottom"
      @click-overlay="toggleSelector"
    >
      <van-datetime-picker
        :min-date="minDate"
        :max-date="maxDate"
        :value="getDate"
        :type="type"
        @confirm="handleValueChange"
        @cancel="toggleSelector"
      />
    </van-popup>
  </section>
</template>
<script>
import { Field, Popup, DatetimePicker } from 'vant';
import subYears from 'date-fns/sub_years';
import format from 'date-fns/format';

import getPlaceholderFromProps from '../utils/get-placeholder-from-props';

export default {
  name: 'date-type',

  components: {
    'van-field': Field,
    'van-popup': Popup,
    'van-datetime-picker': DatetimePicker,
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
      default: 'date',
    },
    errorConf: {
      type: Object,
      default: () => ({
        isError: false,
        errorMsg: '',
      }),
    },
    maxDate: {
      type: Date
    }
  },

  data() {
    return {
      minDate: subYears(new Date(), 100),
      showSelector: false,
    };
  },

  computed: {
    getPlaceholder() {
      const defaultPlaceholder = this.$props.placeholder || '请选择';
      return getPlaceholderFromProps(this.$attrs, defaultPlaceholder);
    },
    getDate() {
      return this.$props.value ? new Date(this.$props.value) : new Date();
    },
    getFormattedTime() {
      return this.$props.value ? format(this.$props.value, 'YYYY-MM-DD') : '';
    },
  },

  methods: {
    handleValueChange(value) {
      this.toggleSelector();
      this.$emit('change', this.name, format(value, 'YYYY-MM-DD'));
    },
    toggleSelector() {
      this.showSelector = !this.showSelector;
    },
  },
};
</script>
<style lang="postcss">
.se__field {
  &-panel.date-type {
    .se-icon.van-icon {
      position: absolute;
      right: 15px;
      font-size: 10px;
      transform: scale(0.8);
    }
  }

  .input {
    flex: 1;
    position: relative;
  }

  .placeholder {
    color: #ccc;
  }

  .popup {
    flex-direction: column;
    padding-bottom: 15px;
    border-radius: 12px 12px 0 0;
  }
}
</style>
