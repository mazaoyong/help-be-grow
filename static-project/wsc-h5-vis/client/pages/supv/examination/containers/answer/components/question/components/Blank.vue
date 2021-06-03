<!-- 填空题 -->
<template>
  <div
    class="answer-blank"
    :class="{
      'answer-blank--correct': correct,
      'answer-blank--incorrect': incorrect,
    }"
  >
    <van-field
      v-bind="$props"
      type="textarea"
      rows="1"
      label-width="55px"
      :disabled="disabled"
      autosize
      @input="$emit('input', $event)"
    />
  </div>
</template>

<script>
import { Field as VanField } from 'vant';
import { blankProps as props } from '../props';

export default {
  name: 'answer-blank',

  components: {
    VanField,
  },

  props,
};
</script>

<style lang="scss">
@import '~supv/examination/style/index';

.answer-blank {
  &--correct {
    .van-cell__value {
      padding: 23px 16px;
      border-color: $edu-green !important;
      border-width: 2px !important;
    }
  }

  &--incorrect {
    .van-cell__value {
      padding: 23px 16px;
      border-color: $red !important;
      border-width: 2px !important;
    }
  }

  .van-cell {
    padding: 0;
    margin-top: 16px;
    background-color: transparent;

    &__title {
      line-height: 74px;
    }

    &__value {
      padding: 24px 16px;
      background: $white;
      border: 1px solid $light-gray;
      border-radius: 4px;

      textarea {
        font-size: 16px;
      }

      textarea::-webkit-input-placeholder {
        color: $gray;
      }
    }
  }
}
</style>
