<template>
  <div class="result-card">
    <div class="result-card__header">
      <div class="result-card__title">
        答题卡
      </div>
      <van-button
        v-theme.main="'border-color,color'"
        plain
        round
        size="mini"
        @click="toReview"
      >
        查看解析
      </van-button>
    </div>

    <answer-stats
      :answers="answerList"
      :folded="listFolded"
      show-tip
    />

    <div
      v-if="listFolded"
      class="result-card__btn-expand"
      @click="listFolded = false"
    >
      共{{ answerList.length }}道题
      <van-icon name="arrow-down" color="#969799" size="12px" />
    </div>
  </div>
</template>

<script>
import { Button as VanButton, Icon as VanIcon } from 'vant';
import AnswerStats from '../components/AnswerStats';

export default {
  name: 'result-card',

  components: {
    VanButton,
    VanIcon,
    AnswerStats,
  },

  rootState: ['examId'],
  getters: ['answerList'],

  data() {
    return {
      showTip: false,
      listFolded: false,
    };
  },

  mounted() {
    window.onclick = () => { this.showTip = false; };

    this.observeAnswerList();
  },

  methods: {
    toReview() {
      this.$router.replace({
        name: 'answer',
        params: {
          mode: 'review',
        },
        query: {
          examId: this.examId,
          kdt_id: _global.kdt_id,
        },
      });
    },

    observeAnswerList() {
      // 观察题目列表节点高度，如果超过60，则收起超出的内容
      const MAX_HEIGHT = 60;
      const targetNode = document.querySelector('.answer-stats__answers');
      const config = { childList: true, subtree: true };
      const callback = (mutations) => {
        const rect = targetNode.getBoundingClientRect();
        if (rect.height > MAX_HEIGHT) {
          this.listFolded = true;
        } else {
          this.listFolded = false;
        }
        console.log('answer list changed:', this.listFolded, rect);
      };
      const observer = new MutationObserver(callback);
      observer.observe(targetNode, config);
    },
  },
};
</script>

<style lang="scss">
@import '~supv/examination/style/index';

.result-card {
  margin: 12px 12px 0;
  overflow: hidden;
  background: $white;
  border-radius: 4px;

  &__header {
    @include text(14px, $black, 20px, 500);

    display: flex;
    padding: 12px 12px 0;
    box-sizing: border-box;
    justify-content: space-between;

    .van-button {
      padding: 0 10px;
    }
  }

  &__btn-expand {
    @include text(14px, $deeper-gray, 20px);

    margin: 16px 0 12px;
    text-align: center;

    .van-icon {
      margin-left: 8px;
    }
  }

  .answer-stats {
    &__answer {
      @include text(14px, $white, 32px);

      width: 32px;
      height: 32px;
      margin: 16px 0 0 16px;
    }
  }
}
</style>
