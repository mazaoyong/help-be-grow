<template>
  <div class="answer-popup">
    <Popup
      v-model="showAnswerPopup"
      @input="onPopupInput"
    >
      <template slot="header">
        <div class="answer-popup__stats">
          <span>答题卡：{{ completedCount }}</span>/{{ sumCount }}
        </div>
        <div class="answer-popup__progress">
          <span :style="{ width: `${completedCount * 100 / sumCount}%` }" />
        </div>
      </template>

      <template slot="content">
        <div
          v-for="(q, index) in answerList"
          :key="q.questionId"
          class="answer-popup__q-item"
          :class="{
            'answer-popup__q-item--completed': q.answered,
          }"
          @click="toQuestion(q.questionId)"
        >
          {{ index + 1 }}
        </div>
      </template>

      <footer slot="footer">
        <van-button
          class="answer-popup__btn-submit"
          color="#00b389"
          :plain="completedCount !== sumCount"
          round
          block
          @click="onSubmit"
        >
          提交答卷
        </van-button>
      </footer>
    </Popup>
  </div>
</template>

<script>
import { Button as VanButton, Dialog, Toast } from 'vant';
import Popup from '../components/Popup';

export default {
  name: 'answer-popup',

  components: {
    VanButton,
    Popup,
  },

  rootState: ['examId', 'userExamId'],
  rootGetters: ['inPreview'],
  state: ['showAnswerPopup'],
  getters: ['sumCount', 'answerList', 'completedCount'],
  mutations: ['updateShowAnswerPopup'],

  methods: {
    toQuestion(questionId) {
      this.$emit('to', questionId);
      this.updateShowAnswerPopup(false);
    },

    onSubmit() {
      if (this.inPreview) {
        return Toast('预览模式不支持提交考试');
      }

      let message = '提交后无法修改答案，确认提交吗？';
      if (this.completedCount !== this.sumCount) {
        message = '有些题目还没有作答，确认提交吗？';
      }
      Dialog.confirm({
        title: '提示',
        message,
        confirmButtonText: '确认提交',
        confirmButtonColor: '#00b389',
        cancelButtonText: '我再想想',
      })
        .then(async (res) => {
          await this.$emit('submit');
          this.updateShowAnswerPopup(false);
        })
        .catch(() => {});
    },

    showPopup() {
      this.updateShowAnswerPopup(true);
    },

    onPopupInput(value) {
      this.updateShowAnswerPopup(value);
    },
  },
};
</script>

<style lang="scss">
@import '~supv/examination/style/index';

.answer-popup {

  footer {
    position: sticky;
    bottom: 0;
    padding: 8px 24px;
    background: $white;
    flex: 0 0 auto;
  }

  &__stats {
    @include text(14px, $gray, 20px);

    flex: 0 0 auto;

    span {
      color: $black;
    }
  }

  &__progress {
    position: relative;
    width: 112px;
    height: 8px;
    overflow: hidden;
    background-color: $light-gray;
    border-radius: 4px;

    span {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      background-color: $edu-green;
      border-radius: 4px;
    }
  }

  &__q-item {
    @include text(18px, $deeper-gray, 48px, 700);

    display: inline-block;
    width: 48px;
    height: 48px;
    margin-top: 24px;
    margin-left: 16px;
    text-align: center;
    border: 1px solid $light-gray-2;
    border-radius: 50%;
    box-sizing: border-box;

    &--completed {
      color: $white;
      background-color: $edu-green;
      border-width: none;
    }
  }

  &__btn-submit {
    font-size: 16px;
  }
}
</style>
