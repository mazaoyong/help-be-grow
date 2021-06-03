<template>
  <div class="moments-pe-text-c">
    <van-field
      :value="localText"
      :placeholder="placeholder"
      :border="false"
      type="textarea"
      :autosize="{ minHeight: 150, maxHeight: 150 }"
      @input="onInput"
    />

    <div
      :class="{
        'moments-pe-text-c__count': true,
        'moments-pe-text-c__count--error': localText.length > maxTextLength
      }"
    >
      {{ localText.length }}/{{ maxTextLength }}
    </div>
  </div>
</template>

<script>
import { Field } from 'vant';
import { MAX_CONTENT as MAX_TEXT_LENGTH } from '../constants';

export default {
  name: 'post-text',

  components: {
    [Field.name]: Field,
  },

  props: {
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '想对同学们说的...',
    },
  },

  data() {
    return {
      localText: this.value,
      maxTextLength: MAX_TEXT_LENGTH,
    };
  },

  watch: {
    value(newValue) {
      this.localText = newValue;
    },
  },

  methods: {
    onInput(value) {
      this.$emit('input', value);
    },
  },
};
</script>

<style lang="scss">
  .moments-pe-text-c {

    textarea {
      font-size: 16px;

      &::-webkit-input-placeholder {
       color: #969799;
       font-size: 16px;
      }
    }

    > .van-field {
      padding-left: 0;
      padding-right: 0;
    }

    &__count {
      text-align: right;
      color: #969799;
      font-size: 13px;
      line-height: 17px;
      margin-top: 8px;
      margin-bottom: 8px;

      &--error {
        color: #ee0a24;
      }
    }
  }
</style>
