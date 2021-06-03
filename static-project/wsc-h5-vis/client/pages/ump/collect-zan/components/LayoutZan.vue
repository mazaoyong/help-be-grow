<template>
  <div class="layout-zan" :style="{ minHeight }">
    <!-- 规则按钮 -->
    <div class="layout-zan__rules">
      <slot name="rules" />
    </div>

    <!-- 进度展示 -->
    <div class="layout-zan__progress">
      <slot name="progress" />
    </div>

    <main class="layout-zan__main">
      <!-- 奖励信息 -->
      <div class="layout-zan__reward">
        <slot v-if="inited" name="reward" />
      </div>

      <!-- 主交互区 -->
      <div class="layout-zan__actions">
        <slot v-if="inited" name="actions" />
      </div>
    </main>

    <!-- 活动记录 -->
    <div class="layout-zan__records">
      <slot name="records" />

      <img
        class="layout-zan__bg-1"
        src="~assets/images/ump/collect-zan/bg-leaf.png"
        width="69px"
      >
    </div>

    <!-- 弹窗、弹层 -->
    <slot />
  </div>
</template>

<script>
export default {
  name: 'layout-zan',

  props: {
    inited: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      minHeight: '',
    };
  },

  mounted() {
    this.minHeight = `${window.innerHeight}px`;
  },
};
</script>

<style lang="scss">
body {
  background:
    url(~assets/images/ump/collect-zan/bg-text.png) center 16px / 316px 73px no-repeat,
    url(~assets/images/ump/collect-zan/bg-main.jpg) center -88px / 100% auto no-repeat,
    linear-gradient(-21deg, #ffb643 0%, #ffb643 100%);
}

.layout-zan {
  padding-bottom: 50px;
  overflow: hidden;
  box-sizing: border-box;

  &__rules {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 1;
  }

  &__progress {
    margin: 90px 16px 0;
  }

  &__main {
    position: relative;
    width: 359px;
    height: 350px;
    margin: 24px auto 0;
    background: url(~assets/images/ump/collect-zan/bg-reward.png);
    background-repeat: no-repeat;
    background-size: 100% auto;
  }

  &__reward {
    height: 160px;
  }

  &__actions {
    height: 165px;
  }

  &__records {
    position: relative;
    margin: 0 30px;
  }

  &__bg-1 {
    position: absolute;
    top: 24px;
    left: -30px;
  }

  .van-count-down {
    font-variant-numeric: tabular-nums;
  }
}

.van-toast--success .van-toast__text {
  white-space: nowrap;
}
</style>
