<template>
  <div
    class="review"
    :class="[
      correct && !isSubjective ? 'review--correct' : 'review--incorrect'
    ]"
  >
    <header>
      <div>
        <div v-if="isSubjective" class="review__correct-answer">
          <span v-if="isReviewing">老师正在批阅中</span>
          <span v-else class="review__user-score">[得{{ userScore }}分]</span>
        </div>
        <div v-else class="review__correct-answer">
          <span class="review__user-score">[得{{ userScore }}分]</span>正确答案：{{ correctAnswerText }}
        </div>
      </div>
      <div v-if="showUserAnswer" class="review__user-answer">
        <vis-icon
          v-if="correct"
          name="check-circle"
          color="#00b389"
          size="16"
        />
        <van-icon
          v-else
          name="clear"
          color="#ff445a"
          size="16"
        />
        <span v-if="userAnswerText">你的答案：{{ userAnswerText }}</span>
        <span v-else>未作答</span>
      </div>
    </header>

    <main v-if="reference || reviewContent || teacherComment">
      <van-divider />

      <div v-if="reference && isSubjective" class="review__block">
        <div class="title">
          参考答案
        </div>
        <div
          class="review__rich-text custom-richtext"
          v-html="reference"
        />
      </div>

      <div v-if="reviewContent" class="review__block">
        <div class="title">
          答案解析
        </div>
        <div
          class="review__rich-text custom-richtext"
          v-html="reviewContent"
        />
      </div>

      <div v-if="teacherComment" class="review__block">
        <div class="title">
          老师评语
        </div>
        <div
          class="review__rich-text custom-richtext"
          v-html="teacherComment"
        />
      </div>
    </main>
  </div>
</template>

<script>
import { Icon as VanIcon, Divider as VanDivider } from 'vant';
import { Icon as VisIcon } from '@youzan/vis-ui';
import { QuestionType } from 'supv/examination/types';
import { reviewProps as props } from '../props';

export default {
  name: 'review',

  components: {
    VanIcon,
    VanDivider,
    VisIcon,
  },

  props,

  computed: {
    isSubjective() {
      return this.type === QuestionType.SUBJECTIVE;
    },

    showUserAnswer() {
      return this.type === QuestionType.SINGLE ||
        this.type === QuestionType.MULTIPLE ||
        this.type === QuestionType.JUDGE;
    },

    correctAnswerText() {
      if (this.type === QuestionType.FILL_BLANK) {
        return this.correctAnswer.map((answer, i) => `\n填空${i + 1}:${answer}`).join('');
      }
      if (this.type === QuestionType.JUDGE) {
        return this.correctAnswer ? '对' : '错';
      }
      return this.correctAnswer.join('');
    },
    sortChooseOptionNos() {
      const optionsTemp = this.chooseOptionNos.slice();
      return optionsTemp.sort((s1, s2) => {
        const x1 = s1.toUpperCase();
        const x2 = s2.toUpperCase();
        if (x1 < x2) {
          return -1;
        }
        if (x1 > x2) {
          return 1;
        }
        return 0;
      });
    },
    userAnswerText() {
      if (this.showUserAnswer && this.userAnswer !== undefined) {
        if (this.type === QuestionType.JUDGE) {
          return this.userAnswer ? '对' : '错';
        } else {
          return this.sortChooseOptionNos.join('');
        }
      }
      return '';
    },
  },
};
</script>

<style lang="scss">
@import '~supv/examination/style/index';

.review {
  @include block;

  margin-top: 24px;

  &--incorrect {
    .review {
      &__user-score {
        color: $red;
      }

      &__user-answer {
        background-color: rgba($red, .1);

        span {
          color: $red;
        }
      }
    }
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__user-score {
    color: $edu-green;
  }

  &__correct-answer {
    @include text(14px, $black, 20px);

    flex: 0 0 auto;
    white-space: pre-line;
  }

  &__user-answer {
    padding: 6px 12px 6px 8px;
    background-color: rgba($edu-green, .1);
    border-radius: 16px;
    flex: 0 0 auto;

    .van-icon, .vis-icon {
      vertical-align: middle;
    }

    span {
      @include text(14px, $edu-green, 20px, 500);

      margin-left: 8px;
      vertical-align: middle;
    }
  }

  main {
    margin-top: 16px;

    .title {
      @include text(16px, $deep-gray, 22px, 500);
    }
  }

  &__block {
    margin-top: 16px;
  }

  &__rich-text {
    @include richtext;
    @include text(14px, $deep-gray, 24px);

    padding: 0;
    margin-top: 7px;
    font-size: 14px;
    line-height: 24px;

    &--folded {
      max-height: 232px;
      overflow: hidden;
    }

    img {
      width: 100%;
    }

    video {
      width: 100%;
    }
  }
}
</style>
