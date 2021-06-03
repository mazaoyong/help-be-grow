<template>
  <div class="block-question">
    <transition-group :name="`list-${transitionDirection}`" tag="div" class="block-question__list">
      <component
        :is="questionComponentType"
        v-for="question in questionList"
        :key="question.id"
        :disabled="isReviewMode"
        :is-reviewing="isReviewing"
        :type="question.type"
        :no="question.no"
        :score="question.score"
        :question-content="question.content"
        :options="question.options"
        :blank-count="question.blankCount"
        :correct="question.correct"
        :correct-answer="question.correctAnswer"
        :user-answer="question.userAnswer"
        :user-score="question.userScore"
        :review-content="question.reviewContent"
        :teacher-comment="question.teacherComment"
        :reference="question.reference"
        @answer-change="onAnswerChange"
      />
    </transition-group>

    <transition name="slideup">
      <div v-if="!isSwitching">
        <van-button
          v-if="showConfirmLast"
          class="btn-submit"
          color="#00b389"
          block
          round
          :disabled="isSwitching"
          @click="confirmLastAnswer"
        >
          确认答案
        </van-button>

        <van-button
          v-if="hasNext"
          class="btn-submit"
          color="#00b389"
          block
          round
          :disabled="isSwitching"
          @click="onSwitch('next')"
        >
          下一题
        </van-button>

        <div class="block-question__switcher">
          <div
            v-if="hasPrev"
            class="block-question__switcher__button"
            @click="onSwitch('prev')"
          >
            上一题
          </div>
        </div>

        <van-button
          v-if="isReviewMode"
          class="btn-review"
          color="#00b389"
          block
          round
          plain
          @click="toResult"
        >
          关闭答案解析
        </van-button>
      </div>
    </transition>
  </div>
</template>

<script>
import { Button as VanButton } from 'vant';
import { AnswerMode, QuestionType } from 'supv/examination/types';
import { AnswerQuestion, PreviewQuestion, ReviewQuestion } from '../components/question/index.ts';

export default {
  name: 'block-question',

  components: {
    VanButton,
    AnswerQuestion,
    PreviewQuestion,
    ReviewQuestion,
  },

  rootState: ['mode', 'examId', 'userExamId'],
  rootGetters: ['inAnswer'],
  state: ['currentQuestion', 'questionList', 'hasPrev', 'hasNext', 'userAnswer', 'isReviewing'],
  mutations: ['updateUserAnswer', 'updateShowAnswerPopup'],
  actions: ['saveAnswer', 'fetchPrevQuestion', 'fetchNextQuestion'],

  data() {
    return {
      isSwitching: false,
      transitionDirection: 'left',
    };
  },

  computed: {
    questionComponentType() {
      switch (this.mode) {
        case AnswerMode.ANSWER:
          return 'AnswerQuestion';
        case AnswerMode.PREVIEW:
          return 'PreviewQuestion';
        case AnswerMode.REVIEW:
          return 'ReviewQuestion';
        default:
          return 'AnswerQuestion';
      }
    },

    showConfirmLast() {
      const { type } = this.currentQuestion;
      return !this.isReviewMode && !this.hasNext && (
        type === QuestionType.SUBJECTIVE ||
        type === QuestionType.FILL_BLANK ||
        type === QuestionType.MULTIPLE
      );
    },

    isReviewMode() {
      return this.mode === AnswerMode.REVIEW;
    },

    userAnswered() {
      return this.userAnswer && this.userAnswer.length;
    },
  },

  watch: {
    currentQuestion(q, oldQ) {
      if (q.no < oldQ.no) {
        this.transitionDirection = 'right';
      } else {
        this.transitionDirection = 'left';
      }
    },
  },

  methods: {
    async onSwitch(direction) {
      if (this.isSwitching) return;
      this.isSwitching = true;

      if (this.inAnswer && this.userAnswered) {
        await this.saveAnswer();
      }

      this.switchQuestion(direction);
    },

    switchQuestion(direction) {
      this.isSwitching = true;

      let fetch;
      if (direction === 'next') {
        fetch = this.fetchNextQuestion;
      } else {
        fetch = this.fetchPrevQuestion;
      }
      fetch()
        .finally(() => {
          setTimeout(() => {
            this.isSwitching = false;
            window.scrollTo({
              top: 0,
              behavior: 'smooth',
            });
          }, 500);
        });
    },

    async onAnswerChange(answer) {
      this.updateUserAnswer(answer);

      // 如果是单选or判断题，选择答案后自动切换至下一个题目or拉起答题列表
      const { type } = this.currentQuestion;
      if (this.inAnswer &&
        (type === QuestionType.SINGLE || type === QuestionType.JUDGE)
      ) {
        if (this.hasNext) {
          this.isSwitching = true;
          await this.saveAnswer();
          this.switchQuestion('next');
        } else {
          this.confirmLastAnswer();
        }
      }
    },

    async confirmLastAnswer() {
      if (this.inAnswer) {
        await this.saveAnswer();
      }

      this.$emit('last-question');
    },

    toResult() {
      this.$router.replace({
        name: 'result',
        query: {
          examId: this.examId,
          userExamId: this.userExamId,
          kdt_id: _global.kdt_id,
        },
      });
    },
  },
};
</script>

<style lang="scss">
@import '~supv/examination/style/index';

.block-question {
  padding: 28px 16px;
  overflow-x: hidden;

  .btn-submit {
    margin-top: 24px;
    font-size: 16px;
    font-weight: 500;
  }

  .btn-review {
    margin-top: 16px;
    font-size: 16px;
  }

  &__switcher {
    display: flex;
    margin-top: 17px;

    &__button {
      flex: 1 1 auto;
      height: 18px;
      text-align: center;
      border-left: 1px solid $light-gray-1;

      @include text(14px, $deeper-gray, 18px);

      &:first-child {
        border: none;
      }
    }
  }
}

.exam-video-cover {
  position: relative;
  display: inline-block;
  width: 100%;

  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    background: transparent;
    content: '';
  }
}

.list-left-enter-active,
.list-left-leave-active {
  transition: all .3s ease-in-out;
}

.list-left-enter-active {
  transition-delay: .3s;
}

.list-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.list-left-enter {
  opacity: 0;
  transform: translateX(30px);
}

.list-right-enter-active,
.list-right-leave-active {
  transition: all .3s ease-in-out;
}

.list-right-enter-active {
  transition-delay: .3s;
}

.list-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-right-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.slideup-enter-active {
  transition: all .3s ease-in-out;
}

.slideup-enter {
  opacity: 0;
  transform: translateY(30px);
}
</style>
