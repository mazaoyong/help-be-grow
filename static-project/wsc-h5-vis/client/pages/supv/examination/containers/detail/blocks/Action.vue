<template>
  <div class="block-action">
    <!-- 倒计时 -->
    <div v-if="showCountDown" class="block-action__tip">
      <van-count-down
        :time="leftSeconds || reexamLeftSeconds"
        format="距开始考试还剩HH时mm分ss秒"
        @finish="onFinish"
      />
    </div>

    <div class="block-action__button-group">
      <!-- 副按钮 -->
      <div
        v-if="buttonStatus.showViceBtn"
        class="block-action__button-vice"
        :class="{
          'block-action__button-vice--disabled': buttonStatus.viceDisabled,
        }"
        @click="buttonStatus.viceHandler"
      >
        {{ buttonStatus.viceText }}
      </div>

      <!-- 主按钮 -->
      <div
        v-theme.main="'background'"
        class="block-action__button-main"
        :class="{
          'block-action__button-main--disabled': buttonStatus.disabled,
        }"
        @click="buttonStatus.handler"
      >
        {{ buttonStatus.text }}
      </div>
    </div>

    <module ref="blockStartExam" name="startExam" />
  </div>
</template>

<script>
import { CountDown as VanCountDown, Dialog } from 'vant';
import { checkAndLogin } from '@/common/utils/login';
import { ActionStatus } from '../types';

const DEFAULT_BUTTON_STATUS = {
  text: '开始考试',
  disabled: false,
  showViceBtn: false,
  viceText: '再次考试',
  viceDisabled: false,
  handler() {},
  viceHandler() {},
};

export default {
  name: 'block-action',

  components: {
    VanCountDown,
  },

  rootState: ['examId', 'userExamId'],
  state: [
    'leftSeconds',
    'reexamLeftSeconds',
    'status',
    'userExamStatus',
    'canJoinExam',
    'studentIds',
    'infoCollectorSettings',
    'hasLimit',
  ],
  getters: [
    'actionStatus',
  ],

  computed: {
    buttonStatus() {
      return Object.assign({}, DEFAULT_BUTTON_STATUS, {
        [ActionStatus.NOT_STARTED]: {
          disabled: true,
          text: '考试未发布',
          handler: () => {},
        },
        [ActionStatus.NOT_STARTED_COMMITED]: {
          disabled: true,
          text: '开始考试',
          handler: () => {
            this.continueExam();
          },
        },
        [ActionStatus.ENDED]: {
          disabled: true,
          text: '考试已结束',
          handler: () => {
            // this.showEndedDialog();
          },
        },
        [ActionStatus.ENDING]: {
          disabled: true,
          text: '考试已结束',
          handler: () => {
            this.continueExam();
          },
        },
        [ActionStatus.NOT_JOINED]: {
          text: '开始考试',
          handler: () => {
            this.startExam();
          },
        },
        [ActionStatus.NOT_COMMITED]: {
          text: '继续考试',
          handler: () => {
            this.continueExam();
          },
        },
        [ActionStatus.COMMITED]: {
          text: '查看成绩',
          handler: () => {
            this.toReview();
          },
        },
        [ActionStatus.CAN_REEXAM]: {
          showViceBtn: true,
          viceText: '再次考试',
          text: '查看成绩',
          handler: () => {
            this.toReview();
          },
          viceHandler: () => {
            this.reexam();
          },
        },
        [ActionStatus.WILL_REEXAM]: {
          showViceBtn: true,
          viceText: '再次考试',
          viceDisabled: true,
          text: '查看成绩',
          handler: () => {
            this.toReview();
          },
        },
      }[this.actionStatus]);
    },

    showCountDown() {
      // 根据按钮状态来判断是否展示倒计时
      return ((this.actionStatus === ActionStatus.NOT_STARTED ||
        this.actionStatus === ActionStatus.NOT_STARTED_COMMITED) && this.leftSeconds) ||
        (this.actionStatus === ActionStatus.WILL_REEXAM && this.reexamLeftSeconds);
    },
  },

  methods: {
    checkShopLifecycle(cb, event) {
      const isShopInvalid = ['close', 'pause', 'protect']
        .indexOf(window._global.lifecycleStatus) > -1;
      if (isShopInvalid) {
        Dialog({
          title: '提示',
          message: '店铺已到期，无法参加考试，请联系商家',
          showCancelButton: false,
          confirmButtonColor: '#00b389',
        });
        return false;
      }
      return true;
    },

    showEndedDialog() {
      Dialog({
        title: '提示',
        message: '抱歉，考试已结束，无法参加考试',
        showCancelButton: false,
        confirmButtonColor: '#00b389',
      });
    },
    reexam() {
      if (!this.checkShopLifecycle()) return;

      Dialog({
        title: '提示',
        message: '再次考试将按照最新分数计算成绩，是否重考？',
        showCancelButton: true,
        cancelButtonText: '我再想想',
        confirmButtonColor: '#00b389',
        confirmButtonText: '立即重考',
      })
        .then(() => {
          this.startExam(true);
        });
    },
    startExam(isReexam = false) {
      if (!this.checkShopLifecycle()) return;

      checkAndLogin((sessionId, userId, doLogin) => {
        if (doLogin) {
          window.location.reload();
        } else {
          // 如果能够加入考试则直接进入考试
          if (this.canJoinExam) {
            if (isReexam) {
              this.$refs.blockStartExam.reexam(this.studentIds[0]);
            } else {
              this.$refs.blockStartExam.startExam(
                isReexam,
                this.examId,
                this.studentIds,
                this.infoCollectorSettings,
              );
            }
          } else {
            if (this.hasLimit) {
              this.$refs.blockStartExam.showCourseList(this.examId);
            }
          }
        }
      }, { forceLogin: false });
    },
    continueExam() {
      Dialog({
        title: '提示',
        message: '你已参加过考试，尚未提交，是否继续上次答题？',
        showCancelButton: false,
        confirmButtonColor: '#00b389',
        confirmButtonText: '继续答题',
      })
        .then(() => {
          this.toAnswer();
        });
    },
    toReview() {
      this.$router.push({
        name: 'result',
        query: {
          examId: this.examId,
          userExamId: this.userExamId,
          kdt_id: _global.kdt_id,
        },
      });
    },
    toAnswer() {
      this.$router.push({
        name: 'answer',
        params: {
          mode: 'answer',
        },
        query: {
          examId: this.$route.query.examId,
          kdt_id: _global.kdt_id,
        },
      });
    },
    onFinish() {
      window.location.reload();
    },
  },
};
</script>

<style lang="scss">
@import '~supv/examination/style/index';
@import '~supv/examination/style/iphone-weixin';

.block-action {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  padding: 8px 24px;
  padding-bottom: calc(8px + constant(safe-area-inset-bottom));
  padding-bottom: calc(8px + env(safe-area-inset-bottom));
  background: $white;
  box-sizing: border-box;

  &__tip {
    position: absolute;
    top: -32px;
    left: 0;
    width: 100%;
    height: 32px;
    text-align: center;
    background: $yellow;

    .van-count-down {
      @include text(13px, $orange, 32px);

      display: inline-block;
    }
  }

  &__button-group {
    @include text(16px, $white, 40px, 500);

    display: flex;
    overflow: hidden;
    text-align: center;
    border-radius: 20px;
  }

  &__button-main,
  &__button-vice {
    width: 100%;
    color: $white;
  }

  &__button-main--disabled {
    color: $deeper-gray;
    background: $light-gray-1 !important;
  }

  &__button-vice {
    background: $purple;
    border-radius: 20px 0 0 20px;
  }

  &__button-vice--disabled {
    color: $gray;
    background: $white !important;
    border: 1px solid $gray;
  }
}
</style>
