<template>
  <div class="answer-stats">
    <div class="answer-stats__infos">
      <div v-if="answerStats.correct" class="answer-stats__info answer-stats__info--correct">
        正确({{ answerStats.correct }})
      </div>
      <div v-if="answerStats.incorrect" class="answer-stats__info answer-stats__info--incorrect">
        错误({{ answerStats.incorrect }})
      </div>
      <div
        v-if="answerStats.subjective"
        class="answer-stats__info answer-stats__info--subjective"
        @click.stop="triggerTip"
      >
        主观题({{ answerStats.subjective }})
        <van-icon
          v-if="showTip"
          name="question"
          color="#a9a9a9"
          size="12px"
        >
          <span
            v-if="showTipPop"
            class="tip-pop"
            :class="{ 'tip-pop--overflow': !answerStats.correct && !answerStats.incorrect }"
          >
            可通过查看解析了解主观题的得分情况。
          </span>
        </van-icon>
      </div>
      <div v-if="answerStats.empty" class="answer-stats__info answer-stats__info--empty">
        未填({{ answerStats.empty }})
      </div>
    </div>

    <div
      class="answer-stats__answers"
      :class="{
        'answer-stats__answers--folded': folded,
      }"
    >
      <div
        v-for="(answer, index) in answers"
        :key="index"
        class="answer-stats__answer"
        :class="{
          'answer-stats__answer--correct': answer.correct,
          'answer-stats__answer--incorrect': !answer.correct,
          'answer-stats__answer--subjective': answer.type === 1,
          'answer-stats__answer--empty': !answer.answered,
        }"
        @click="$emit('to-answer', answer)"
      >
        {{ index + 1 }}
      </div>
    </div>
  </div>
</template>

<script>
import { Icon as VanIcon } from 'vant';

export default {
  name: 'answer-stats',

  components: {
    VanIcon,
  },

  props: {
    answers: {
      type: Array,
      default: () => [],
    },
    folded: {
      type: Boolean,
      default: false,
    },
    showTip: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      showTipPop: false,
    };
  },

  computed: {
    answerStats(state) {
      return this.answers.reduce((obj, answer) => {
        if (!answer.answered) {
          obj.empty++;
        } else if (answer.type === 1) {
          obj.subjective++;
        } else if (answer.correct) {
          obj.correct++;
        } else {
          obj.incorrect++;
        }

        return obj;
      }, {
        correct: 0,
        incorrect: 0,
        subjective: 0,
        empty: 0,
      });
    },
  },

  mounted() {
    window.addEventListener('click', () => {
      this.showTipPop = false;
    });
  },

  methods: {
    triggerTip() {
      this.showTipPop = !this.showTipPop;
    },
  },
};
</script>

<style lang="scss">
@import '~supv/examination/style/index';

.answer-stats {
  &__infos {
    margin-top: 16px;
  }

  &__info {
    @include text(12px, $deep-gray, 17px);

    position: relative;
    display: inline-block;
    padding-left: 14px;
    margin-left: 16px;

    &::before {
      position: absolute;
      top: 4px;
      left: 0;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      content: '';
    }

    &--correct {
      &::before {
        background: $edu-green;
      }
    }

    &--incorrect {
      &::before {
        background: $red;
      }
    }

    &--subjective {
      &::before {
        background: $black;
      }

      .van-icon {
        position: relative;
        vertical-align: -2px;
      }

      .tip-pop {
        @include text(12px, $white, 36px);

        position: absolute;
        top: 22px;
        left: 50%;
        padding-left: 8px;
        white-space: nowrap;
        background: rgba($black, .7);
        border-radius: 2px;
        transform: translateX(-50%);

        &::before {
          position: absolute;
          top: -8px;
          left: 50%;
          border-top: 0;
          border-right: 8px solid transparent;
          border-bottom: 8px solid rgba($black, .7);
          border-left: 8px solid transparent;
          content: '';
          transform: translateX(-50%);
        }

        &--overflow {
          transform: translateX(-10%);

          &::before {
            left: 14px;
            transform: none;
          }
        }
      }
    }

    &--empty {
      &::before {
        background: $light-gray-1;
      }
    }
  }

  &__answers {
    padding-right: 12px;
    padding-bottom: 12px;
    box-sizing: border-box;
    justify-content: space-between;

    &--folded {
      max-height: 48px;
      overflow: hidden;
    }
  }

  &__answer {
    @include text(14px, $white, 48px);

    display: inline-block;
    width: 48px;
    height: 48px;
    margin: 24px 0 0 16px;
    text-align: center;
    border-radius: 50%;

    &--correct {
      background: $edu-green;
    }

    &--incorrect {
      background: $red;
    }

    &--subjective {
      background: $black;
    }

    &--empty {
      color: $deeper-gray;
      background: $light-gray-1;
    }
  }
}
</style>
