<template>
  <div class="review-popup">
    <Popup v-model="show">
      <template slot="header">
        <div v-if="isReviewing" class="review-popup__user-score">
          老师正在批阅中
        </div>
        <div v-else class="review-popup__user-score">
          我的分数：<span>{{ userScore / 100 }}分</span>
        </div>
      </template>

      <template slot="content">
        <answer-stats
          :answers="answerList"
          @to-answer="toAnswer"
        />
      </template>
    </Popup>
  </div>
</template>

<script>
import Popup from '../components/Popup';
import AnswerStats from '../components/AnswerStats';

export default {
  name: 'review-popup',

  components: {
    Popup,
    AnswerStats,
  },

  getters: ['completedCount', 'answerList', 'userScore', 'isReviewing'],
  actions: ['fetchQuestionById'],

  data() {
    return {
      show: false,
    };
  },

  methods: {
    toAnswer(answer) {
      this.$emit('to', answer.questionId);
      this.show = false;
    },
  },
};
</script>

<style lang="scss">
@import '~supv/examination/style/index';

.review-popup {
  &__user-score {
    @include text(14px, $black, 20px);

    span {
      @include text(14px, $edu-green, 20px, 500);
    }
  }
}
</style>
