<template>
  <div class="block-actions">
    <div v-if="showCountDown" class="block-actions__countdown">
      <van-count-down millisecond :time="countDownTime" :format="countDownFormat" />
      <span>后结束</span>
    </div>

    <div
      v-if="mainAction.text"
      class="block-actions__main-btn"
      @click="$store.dispatch(mainAction.action)"
    >
      {{ mainAction.text }}
    </div>

    <div v-if="actionTipText" class="block-actions__action-tip">
      {{ actionTipText }}
    </div>

    <div
      v-if="viceAction.text"
      class="block-actions__vice-btn"
      @click="$store.dispatch(viceAction.action)"
    >
      {{ viceAction.text }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { CountDown as VanCountDown } from 'vant';

export default {
  name: 'block-actions',

  components: {
    VanCountDown,
  },

  data() {
    return {
      show: true,
    };
  },

  computed: {
    ...mapGetters([
      'countDownTime',
      'countDownFormat',
      'showCountDown',
      'actionTipText',
      'viceAction',
      'mainAction',
    ]),
  },
};
</script>

<style lang="scss">
.block-actions {
  position: relative;
  text-align: center;

  &__actions {
    height: 163px;
  }

  &__countdown {
    height: 20px;
    margin-top: 16px;
    font-size: 12px;
    line-height: 20px;
    color: #fff;

    .van-count-down {
      display: inline-block;
      font-weight: 500;
      color: #fff;
      vertical-align: middle;
    }

    span {
      display: inline-block;
      margin-left: 2px;
      vertical-align: middle;
    }
  }

  &__main-btn {
    width: 240px;
    height: 44px;
    margin: 16px auto 0;
    font-size: 18px;
    font-weight: 500;
    line-height: 44px;
    color: #ef1b00;
    text-align: center;
    background-image: linear-gradient(0deg, #ffbb4c 0%, #ffdc76 56%, #ffeac4 96%, #ffdb6d 100%);
    border-radius: 24px;
    box-shadow: 0 3px 3px 0 rgba(202, 7, 0, .22), inset 0 0 2px 0 rgba(255, 211, 164, .8);
    animation: breath .8s ease infinite;
  }

  &__vice-btn {
    display: inline-block;
    height: 20px;
    margin-top: 16px;
    font-size: 14px;
    line-height: 20px;
    color: #fff;
  }

  &__action-tip {
    height: 20px;
    margin: 50px 0 27px;
    font-size: 16px;
    line-height: 20px;
    color: #fff;
  }
}

.is-android {
  .block-actions__main-btn {
    padding-top: 3px;
  }
}

@keyframes breath {
  50% {
    transform: scale(.95);
  }

  100% {
    transform: scale(1);
  }
}
</style>
