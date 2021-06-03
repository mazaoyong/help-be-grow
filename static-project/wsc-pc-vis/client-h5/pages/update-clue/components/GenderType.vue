<template>
  <section>
    <div :class="`${prefix}-panel panel gender-type ${required ? 'van-cell--required' : ''}`">
      <label class="se__field-label van-cell__title">{{ label }}</label>
      <van-radio-group v-model="stateValue" @change="handleValueChange">
        <van-radio name="1" icon-size="18px">
          男
        </van-radio>
        <van-radio name="2" icon-size="18px">
          女
        </van-radio>
      </van-radio-group>
    </div>
    <div v-if="errorConf.isError" :class="`${prefix}-panel panel error`">
      <label class="se__field-label van-cell__title van-field__error-message" />
      {{ errorConf.errorMsg }}
    </div>
  </section>
</template>
<script>
import { Radio, RadioGroup } from 'vant';

export default {
  name: 'gender-type',

  components: {
    'van-radio': Radio,
    'van-radio-group': RadioGroup,
  },

  props: {
    prefix: {
      type: String,
      default: 'se__field',
    },
    value: {
      type: [Number, String],
      default: 0,
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
      stateValue: this.$props.value.toString(),
    };
  },

  methods: {
    handleValueChange(value) {
      this.$emit('change', this.name, value);
    },
  },
};
</script>
<style lang="postcss">
.se__field-panel.gender-type {
  .van-radio-group {
    display: flex;

    .van-radio {
      margin-right: 32px;

      &__input {
        font-size: 18px;
      }
    }
  }
}
</style>
