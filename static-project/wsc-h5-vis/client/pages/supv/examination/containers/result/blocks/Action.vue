<template>
  <div class="block-action">
    <div v-if="resultActionStatus === ACTION_STATUS.WILL_REEXAM" class="block-action__tip">
      <van-count-down
        :time="reexamLeftSeconds"
        format="距开始考试还剩HH时mm分ss秒"
        @finish="onFinish"
      />
    </div>

    <div class="block-action__button-group">
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

    <module name="startExam" ref="blockStartExam" />
  </div>
</template>

<script>
import { CountDown as VanCountDown, Dialog } from 'vant';
import { navigateEnv } from '@/common/utils/env';
import { ACTION_STATUS } from '../constants';

const DEFAULT_BUTTON_STATUS = {
  text: '查看更多课程',
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

  rootState: ['examId'],
  state: [
    'reexamLeftSeconds',
    'status',
    'userExamStatus',
    'canReexam',
    'canJoinExam',
    'reexamStudentId',
  ],
  getters: ['resultActionStatus'],

  data() {
    return {
      ACTION_STATUS,
    };
  },

  computed: {
    buttonStatus() {
      return Object.assign({}, DEFAULT_BUTTON_STATUS, {
        [ACTION_STATUS.CANNOT_REEXAM]: {
          text: '查看更多课程',
          handler: () => {
            this.toHomePage();
          },
        },
        [ACTION_STATUS.CAN_REEXAM]: {
          text: '查看更多课程',
          showViceBtn: true,
          viceText: '再次考试',
          handler: () => {
            this.toHomePage();
          },
          viceHandler: () => {
            this.startReexam();
          },
        },
        [ACTION_STATUS.WILL_REEXAM]: {
          text: '查看更多课程',
          viceDisabled: true,
          showViceBtn: true,
          viceText: '再次考试',
          handler: () => {
            this.toHomePage();
          },
        },
      }[this.resultActionStatus]);
    },
  },

  methods: {
    showEndedDialog() {
      Dialog({
        title: '提示',
        message: '抱歉，考试已结束，无法参加考试',
        showCancelButton: false,
        confirmButtonColor: '00b389',
      });
    },
    startReexam() {
      // 如果能够加入考试则直接进入考试
      if (this.canJoinExam) {
        Dialog({
          title: '提示',
          message: '再次考试将按照最新分数计算成绩，是否重考？',
          showCancelButton: true,
          cancelButtonText: '我再想想',
          confirmButtonColor: '#00b389',
          confirmButtonText: '立即重考',
        })
          .then(() => {
            this.$refs.blockStartExam.reexam(this.reexamStudentId);
          });
      } else {
        this.$refs.blockStartExam.showCourseList(this.examId);
      }
    },
    toHomePage() {
      navigateEnv();
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
