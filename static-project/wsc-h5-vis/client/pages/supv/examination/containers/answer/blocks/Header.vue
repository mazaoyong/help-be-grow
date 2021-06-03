<template>
  <header class="block-header" :class="{ 'block-header--fixed': showCountDown }">
    <div v-if="showCountDown" class="block-header__fixed-content">
      <van-icon name="clock-o" color="#323233" size="16" />
      <span>
        倒计时
      </span>
      <van-count-down
        v-if="started"
        :auto-start="started"
        :time="remainMS"
        @finish="onFinish"
      />
    </div>
  </header>
</template>

<script>
import { Icon as VanIcon, CountDown as VanCountDown, Dialog, Toast } from 'vant';
import { AnswerMode } from '../../../types';

export default {
  name: 'block-header',

  components: {
    VanIcon,
    VanCountDown,
  },

  rootState: ['mode', 'examId', 'userExamId'],
  state: ['remainMS', 'started'],
  actions: ['submit'],

  computed: {
    showCountDown() {
      return this.mode === AnswerMode.ANSWER && this.remainMS > -1;
    },
  },

  methods: {
    onFinish() {
      if (this.$store.getters.inPreview) {
        return;
      }

      this.submit(true)
        .then(() => {
          Dialog.confirm({
            title: '提示',
            message: '考试时间已到，已为你自动提交考卷',
            confirmButtonText: '我知道了',
            confirmButtonColor: '#00b389',
            showCancelButton: false,
          })
            .then(() => {
              this.$router.replace({
                name: 'result',
                query: {
                  examId: this.examId,
                  userExamId: this.userExamId,
                  kdt_id: _global.kdt_id,
                },
              });
            });
        })
        .catch(errMsg => Toast(errMsg));
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~supv/examination/style/index';

.block-header {
  &--fixed {
    padding-top: 48px;
  }

  &__fixed-content {
    @include text(14px, $black, 18px, 500);

    position: fixed;
    top: 0;
    z-index: 1;
    display: flex;
    width: 100%;
    height: 48px;
    line-height: 48px;
    text-align: center;
    background: $bg-gray;
    box-shadow: 0 6px 9px rgba(#000, .03);
    justify-content: center;
    align-items: center;

    span {
      margin: 0 4px 0 10px;
    }
  }
}
</style>
