<template>
  <div class="question">
    <div class="question__title">
      <span class="question__title__tag">
        {{ typeText }}
      </span>
      <div class="question__title__score">
        {{ no }}.[{{ score }}分]
      </div>
    </div>
    <div class="question__desc" v-html="descContent" />
  </div>
</template>

<script>
import { QuestionType } from 'supv/examination/types.ts';
import { mode, type, no, questionContent, score } from '../props.ts';

export default {
  name: 'question',

  props: {
    mode,
    type,
    no,
    questionContent,
    score,
  },

  data() {
    return {
      titleIndent: '',
    };
  },

  computed: {
    typeText() {
      return {
        [QuestionType.SINGLE]: '单选',
        [QuestionType.MULTIPLE]: '多选',
        [QuestionType.JUDGE]: '判断',
        [QuestionType.FILL_BLANK]: '填空',
        [QuestionType.SUBJECTIVE]: '问答',
      }[this.type];
    },

    descContent() {
      return `<span class="indent" style="width:${this.titleIndent}"></span>${this.questionContent}`;
    },
  },

  mounted() {
    setTimeout(() => {
      const titleElem = document.querySelector('.question__title');
      const rect = titleElem.getBoundingClientRect();
      if (rect.width) {
        this.titleIndent = `${rect.width + 8}px`;
      }
    }, 500);
  },
};
</script>

<style lang="scss">
$white: #fff;
$light-gray: #f2f3f5;
$black: #323233;
$edu-green: #00b389;
$red: #ff445a;

.text--edu-green {
  color: $edu-green;
}

.text--red {
  color: $red;
}

.question {
  position: relative;

  $title-lh: 28px;

  &__title {
    position: absolute;
    line-height: $title-lh;
    text-align: justify;
    word-break: break-all;

    &__tag {
      display: inline-block;
      padding: 3px 8px;
      font-size: 12px;
      line-height: 14px;
      color: $white;
      vertical-align: 2px;
      background-color: $edu-green;
      border-radius: 10px;
    }

    &__text,
    &__score {
      display: inline-block;
      height: $title-lh;
      font-size: 18px;
      line-height: $title-lh;
      color: $black;
      vertical-align: top;
    }

    &__text {
      display: inline;
      margin-left: 4px;
      font-weight: 500;
    }

    &__score {
      margin-left: 8px;
    }
  }

  &__desc {
    display: inline-block;
    font-size: 18px;
    font-weight: 500;
    line-height: 22px;
    color: $black;
    vertical-align: middle;

    .indent {
      display: inline-block;
      width: 108px;
      height: $title-lh;
      line-height: $title-lh;
      vertical-align: middle;

      + div {
        display: inline;
        margin-top: 0;
        line-height: $title-lh;
        vertical-align: middle;

        div {
          margin-top: 0;
        }
      }
    }

    img,
    iframe {
      display: block;
      width: 100%;
      border: 1px solid $light-gray;
      border-radius: 4px;
    }

    div {
      margin-top: 16px;
    }

    strong {
      font-weight: bold;
    }
  }
}
</style>
