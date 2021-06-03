<template>
  <div class="result">
    <block-result />

    <module v-if="showAnswerCard" name="answerCard" />

    <block-action />

    <module name="recommend" type="course" />

    <vis-follow-mp
      v-model="showMpPopup"
      title="关注公众号，获取更多考试信息"
      :qrcode-url="qrcode"
    />
  </div>
</template>

<script>
import { FollowMp as VisFollowMp } from '@youzan/vis-ui';
import { AnswerMode } from 'supv/examination/types';
import BlockResult from './blocks/Result';
import BlockAction from './blocks/Action';

export default {
  name: 'result',

  components: {
    VisFollowMp,
    BlockResult,
    BlockAction,
  },

  rootMutations: [
    'updateExamId',
    'updateUserExamId',
    'updateMode',
  ],
  state: ['showAnswerCard', 'qrcode'],
  mutations: [
    'updateShowMpQrcode',
  ],
  actions: [
    'fetchExamResult',
    'fetchMpFollowStatus',
    'fetchQrcodeUrl',
  ],

  data() {
    return {
      showMpPopup: false,
    };
  },

  async created() {
    const { examId, userExamId } = this.$route.query;
    this.updateExamId(examId);
    this.updateUserExamId(userExamId);
    this.updateMode(AnswerMode.REVIEW);

    // 获取考试详情
    this.fetchExamResult();

    // 获取用户公众号关注状态，引导关注公众号
    const mpId = window._global.mp_account.id || 0;
    if (mpId) {
      const hasFollow = await this.fetchMpFollowStatus();
      if (!hasFollow) {
        await this.fetchQrcodeUrl(mpId);
        this.showMpPopup = true;
      }
    }
  },

  methods: {
    onMpPopupClose() {
      this.updateShowMpQrcode(false);
    },
  },
};
</script>

<style lang="scss">
.result {
  .vis-standard-popup__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-bottom: 0;
  }
}
</style>
