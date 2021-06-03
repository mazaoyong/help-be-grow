<template>
  <div class="answer">
    <!-- 填空题 -->
    <template v-if="isFillBlank">
      <Blank
        v-for="(blank, index) in blanks"
        :key="index"
        v-bind="blank"
        :correct="getBlankCorrect(index)"
        :incorrect="getBlankIncorrect(index)"
        :disabled="disabled"
        @input="onBlankInput($event, index)"
      />
    </template>

    <!-- 简答题 -->
    <van-field
      v-else-if="isSubjective"
      v-model="text"
      class="answer__subjective-field"
      :class="{
        'answer__subjective-field--autosize': inReviewMode
      }"
      :autosize="inReviewMode"
      type="textarea"
      placeholder="请输入答案"
      :show-word-limit="!inReviewMode"
      maxlength="10000"
      :disabled="disabled"
      @input="$emit('input', $event)"
    />

    <!-- 单选/多选/判断 -->
    <template v-else>
      <Option
        v-for="option in options"
        :key="option.id"
        :type="type"
        :in-review-mode="inReviewMode"
        :option-id="option.id"
        :option-no="option.no"
        :option-content="option.content"
        :correct="inReviewMode && getOptionCorrect(option)"
        :incorrect="inReviewMode && getOptionInCorrect(option)"
        :checked="getOptionChecked(option)"
        :disabled="disabled"
        @input="onOptionChecked($event, option)"
      />
    </template>
  </div>
</template>

<script>
import { Field as VanField } from 'vant';
import { QuestionType } from 'supv/examination/types';
import { answerProps as props } from '../props';
import Blank from './Blank';
import Option from './Option';

export default {
  name: 'answer',

  components: {
    VanField,
    Blank,
    Option,
  },

  props,

  data() {
    return {
      text: '',
      images: [],
      blankContent: [],
      checkedOptionIds: [],
    };
  },

  computed: {
    isFillBlank() {
      return this.type === QuestionType.FILL_BLANK;
    },
    isSubjective() {
      return this.type === QuestionType.SUBJECTIVE;
    },
    isMultiple() {
      return this.type === QuestionType.MULTIPLE;
    },
    isJudge() {
      return this.type === QuestionType.JUDGE;
    },
    isSingle() {
      return this.type === QuestionType.SINGLE;
    },

    blanks() {
      let blanks = [];
      for (let i = 0; i < this.blankCount; i++) {
        let value = '';
        if (this.inReviewMode) {
          value = this.userAnswer[i] && this.userAnswer[i].blank;
        } else {
          value = this.userAnswer[i] || this.blankContent[i];
        }

        blanks.push({
          correct: false,
          incorrect: false,
          label: `填空${i + 1}:`,
          value,
          placeholder: `请输入第${i + 1}空答案`,
        });
      }
      return blanks;
    },
  },

  watch: {
    userAnswer: {
      immediate: true,
      deep: true,
      handler(answer) {
        if (Array.isArray(answer)) {
          if (this.isSingle || this.isMultiple) {
            this.checkedOptionIds = answer.slice();
          }

          if (this.isSubjective) {
            this.text = answer[0] || '';
          }
        }

        if (this.isJudge) {
          this.checkedOptionIds[0] = answer;
        }
      },
    },
  },

  methods: {
    getOptionCorrect(option) {
      return this.isJudge
        ? this.correctAnswer === option.correct
        : this.correctAnswer.includes(option.id);
    },

    getOptionInCorrect(option) {
      return this.isJudge
        ? this.userAnswer !== undefined &&
          this.correctAnswer !== this.userAnswer && option.correct !== this.correctAnswer
        : this.userAnswer.includes(option.id) && !this.correctAnswer.includes(option.id);
    },

    getOptionChecked(option) {
      return this.isJudge
        ? !this.inReviewMode && this.checkedOptionIds[0] === option.correct
        : this.checkedOptionIds.includes(option.id);
    },

    getBlankCorrect(index) {
      if (!this.inReviewMode) return false;

      if (this.userAnswer[index]) {
        return this.userAnswer[index].correct;
      }
      return false;
    },

    getBlankIncorrect(index) {
      if (!this.inReviewMode) return false;

      if (this.userAnswer[index]) {
        return !this.userAnswer[index].correct;
      }
      return true;
    },

    onOptionChecked(checked, option) {
      if (this.isJudge) {
        this.checkedOptionIds = [option.correct];
        return this.$emit('input', option.correct);
      }

      if (checked) {
        if (!this.isMultiple) {
          this.checkedOptionIds = [];
        }

        this.checkedOptionIds.push(option.id);
      } else {
        // 取消勾选
        const index = this.checkedOptionIds.indexOf(option.id);
        this.checkedOptionIds.splice(index, 1);
      }
      this.$emit('input', this.checkedOptionIds);
    },

    onBlankInput(content, index) {
      this.blankContent[index] = content;
      this.blankContent = this.blanks.map((_, index) => {
        return this.blankContent[index] || this.blanks[index].value || '';
      });
      this.$emit('input', this.blankContent);
    },
  },
};
</script>

<style lang="scss">
@import '~supv/examination/style/index';

.answer {
  .answer__subjective-field {
    height: 420px;
    padding: 0;
    margin-top: 26px;
    background: transparent;

    &--autosize {
      height: auto;

      .van-field__body {
        box-sizing: initial !important;
      }
    }

    .van-field {
      &__body {
        height: calc(100% - 25px);
        padding: 12px 16px;
        background: $white;
        border: 1px solid $light-gray;
        border-radius: 4px;
        box-sizing: border-box;

        textarea {
          height: 100%;
          font-size: 16px;
          color: $black;

          &::-webkit-input-placeholder {
            color: $gray;
          }
        }
      }

      &__word-limit {
        margin-top: 8px;
        color: $gray;
      }

      &__word-num {
        color: $black;
      }
    }
  }
}
</style>
