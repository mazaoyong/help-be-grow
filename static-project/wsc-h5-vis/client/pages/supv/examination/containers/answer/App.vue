<template>
  <div class="answer">
    <!-- 头部倒计时 -->
    <block-header />

    <!-- 答题区域 -->
    <block-question @last-question="onLastQuestion" />

    <!-- 答题卡 -->
    <!-- <template v-if="inited">
      <block-review-popup v-if="isReviewMode" />
      <block-answer-popup v-else-if="userExamId || isPreviewMode" />
    </template> -->
    <module
      v-if="inited && (isReviewMode || userExamId || isPreviewMode)"
      ref="answerCard"
      name="answerCard"
      :component="isReviewMode ? 'review' : 'answer'"
      @to="fetchQuestionById($event)"
      @submit="onSubmit"
    />
  </div>
</template>

<script>
import { AnswerMode } from 'supv/examination/types';
import BlockHeader from './blocks/Header.vue';
import BlockQuestion from './blocks/Question.vue';

export default {
  name: 'answer',

  components: {
    BlockHeader,
    BlockQuestion,
  },

  rootState: [
    'examId',
    'mode',
    'userExamId',
  ],
  rootMutations: [
    'updateMode',
    'updateExamId',
  ],
  actions: ['fetchLatestQuestion', 'submit', 'fetchQuestionById'],

  data() {
    return {
      inited: false,
    };
  },

  computed: {
    isReviewMode() {
      return this.mode === AnswerMode.REVIEW;
    },
    isPreviewMode() {
      return this.mode === AnswerMode.PREVIEW;
    },
  },

  created() {
    // 更新 examId
    const { examId } = this.$route.query;
    if (examId) {
      this.updateExamId(examId);
    }

    // 设置 mode
    const { mode = AnswerMode.PREVIEW } = this.$route.params;
    this.updateMode(mode);

    // 获取用户考题
    this.fetchLatestQuestion();

    this.inited = true;
  },

  methods: {
    async onSubmit() {
      await this.submit();
      this.$nextTick(() => {
        this.$router.replace({
          name: 'result',
          query: {
            examId: this.examId,
            userExamId: this.userExamId,
            kdt_id: _global.kdt_id,
          },
        });
      });
    },

    onLastQuestion() {
      this.$refs.answerCard.showPopup();
    },
  },
};
</script>

<style lang="scss">
.answer {}
</style>
