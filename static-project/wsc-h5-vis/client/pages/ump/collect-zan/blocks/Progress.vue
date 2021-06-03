<template>
  <div class="block-progress">
    <div class="block-progress__tip">
      {{ progressTipText }}
    </div>

    <div class="block-progress__bar">
      <div
        class="block-progress__bar__inner"
        :style="{ width: progressPercent * 100 + '%' }"
      />

      <div v-if="showIcon" class="block-progress__bar__gift" />

      <div v-if="showTag" class="block-progress__bar__tip">
        即将获得
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'block-progress',

  computed: {
    ...mapGetters([
      'zanStatus',
      'progressTipText',
      'progressPercent',
    ]),

    showTag() {
      return this.progressPercent >= 0.5 && this.progressPercent < 1 && this.zanStatus === 2;
    },

    showIcon() {
      return this.zanStatus === 2 || this.zanStatus === 3;
    },
  },
};
</script>

<style lang="scss">
.block-progress {
  min-height: 84px;
  overflow: hidden;
  background: #ff964e;
  border: 1px solid #ffb458;
  border-radius: 8px;

  &__tip {
    height: 18px;
    margin-top: 16px;
    font-size: 14px;
    line-height: 18px;
    color: #fff;
    text-align: center;
  }

  &__bar {
    position: relative;
    height: 8px;
    padding: 1px;
    margin: 24px 20px 18px;
    background: #f9802d;
    border-radius: 4px;
    box-shadow: inset 0 2px 2px 0 rgba(235, 66, 0, .6);
    box-sizing: border-box;

    &::before {
      position: absolute;
      top: -2px;
      right: 0;
      width: 12px;
      height: 12px;
      background: #f9802d;
      border-radius: 50%;
      content: '';
      box-shadow: inset 0 2px 2px 0 rgba(235, 66, 0, .6);
    }

    &__inner {
      position: relative;
      height: 100%;
      min-width: 10px;
      background: #ff2b2b;
      border-radius: 8px;

      &::before {
        position: absolute;
        top: -2px;
        right: 0;
        width: 10px;
        height: 10px;
        background: #ff2b2b;
        border-radius: 50%;
        content: '';
      }
    }

    &__gift {
      position: absolute;
      top: -10px;
      right: 0;
      width: 28px;
      height: 28px;
      background: #ff2b2b;
      background: url(https://img01.yzcdn.cn/public_files/41703c3867b9ceca58a5002549f1f0f5.png) no-repeat, #ff2b2b;
      background-position: 40%;
      background-size: 120% 120%;
      border-radius: 50%;
      animation: shake .4s ease infinite;
    }

    &__tip {
      position: absolute;
      top: -20px;
      right: 40px;
      height: 14px;
      padding: 0 4px;
      font-size: 10px;
      line-height: 14px;
      color: #fff;
      background: #ff2b2b;
      border-radius: 8px;

      &::after {
        position: absolute;
        bottom: -3px;
        left: 50%;
        border-top: 3px solid #ff2b2b;
        border-right: 3px solid transparent;
        border-left: 3px solid transparent;
        content: '';
        transform: translateX(-50%);
      }
    }
  }
}

.is-android {
  .block-progress__bar__tip {
    padding-top: 2px;
  }
}

@keyframes shake {
  25% {
    transform: rotate(10deg);
  }

  75% {
    transform: rotate(-10deg);
  }

  100% {
    transform: rotate(0);
  }
}
</style>
