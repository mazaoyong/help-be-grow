<template>
  <div class="question-container">
    <!-- 题目 -->
    <question
      :type="type"
      :no="no"
      :question-content="questionContent"
      :score="score"
    />

    <!-- 答题区 -->
    <answer
      in-review-mode
      :type="type"
      :options="options"
      :blank-count="blankCount"
      :correct-answer="correctAnswer"
      :user-answer="userAnswer"
      disabled
    />

    <!-- 答案解析 -->
    <review
      :type="type"
      :correct="correct"
      :correct-answer="correctOptionNos"
      :user-answer="userAnswer"
      :choose-option-nos="chooseOptionNos"
      :user-score="userScore"
      :review-content="reviewContent"
      :teacher-comment="teacherComment"
      :is-reviewing="isReviewing"
      :reference="reference"
    />
  </div>
</template>

<script>
import { findIndex } from 'lodash';
import { QuestionType } from 'supv/examination/types';
import Question from '../components/Question.vue';
import Answer from '../components/Answer.vue';
import Review from '../components/Review.vue';
import { indexProps as props } from '../props';

export default {
  name: 'question-container',

  components: {
    Question,
    Answer,
    Review,
  },

  props,

  computed: {
    correctOptionNos() {
      if (this.type === QuestionType.SINGLE ||
        this.type === QuestionType.MULTIPLE
      ) {
        return this.correctAnswer.map(answerId => {
          return String.fromCharCode(65 + findIndex(this.options, ['id', answerId]));
        });
      }
      return this.correctAnswer;
    },

    chooseOptionNos() {
      if (this.type === QuestionType.SINGLE ||
        this.type === QuestionType.MULTIPLE
      ) {
        return this.userAnswer.map(answerId => {
          return String.fromCharCode(65 + findIndex(this.options, ['id', answerId]));
        });
      }
      return [];
    },
  },
};
</script>
