<template>
  <section class="custom-field">
    <van-field
      v-model="value"
      readonly
      :label="label"
      :placeholder="getPlaceholder"
      right-icon="arrow"
      :error-message="errorMessage"
      @click="toggleSelector"
    />
  </section>
</template>
<script>
import { Field } from 'vant';

export default {
  name: 'custom-field',

  components: {
    'van-field': Field,
  },

  props: {
    prefix: {
      type: String,
      default: 'dynamic-form__field',
    },
    value: {
      type: [Number, String],
      default: undefined,
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
    noRequiredText: {
      type: Boolean,
      default: false,
    },
    errorMessage: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      showSelector: false,
    };
  },

  computed: {
    getPlaceholder() {
      const defaultPlaceholder = this.placeholder || '请选择';
      return (this.required && !this.noRequiredText) ? `${defaultPlaceholder}（必填）` : defaultPlaceholder;
    },
  },

  methods: {
    toggleSelector() {
      this.$emit('click');
    },
  },
};
</script>
<style lang="postcss">
.custom-field {

  .input {
    flex: 1;
    position: relative;
  }

  .placeholder {
    color: #ccc;
  }

  .popup {
    flex-direction: column;
    border-radius: 12px 12px 0 0;
  }
}
</style>
