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
      :type="type"
      :options="options"
      :blank-count="blankCount"
      :user-answer="userAnswer"
      @input="$emit('answer-change', $event)"
    />
  </div>
</template>

<script>
import Question from '../components/Question.vue';
import Answer from '../components/Answer.vue';
import { indexProps as props } from '../props';

export default {
  name: 'question-container',

  components: {
    Question,
    Answer,
  },

  props,
};
</script>
