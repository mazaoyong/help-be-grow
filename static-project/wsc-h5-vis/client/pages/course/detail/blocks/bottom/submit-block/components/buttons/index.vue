<template>
  <div class="buttons" :class="{ 'buttons--android': isAndroid }">
    <van-goods-action-button
      v-for="(button, index) in buttons"
      :key="index"
      :url="button.url"
      :color="getColor(index)"
      :disabled="button.disabled || false"
      :style="{ color: getFontColor(index) }"
      @click="handleClick(button.action)"
    >
      <template v-if="isArray(button.text)">
        <span class="main">{{ button.text[0] }}</span>
        <span class="vice">{{ button.text[1] }}</span>
      </template>
      <span v-else>{{ button.text }}</span>
    </van-goods-action-button>
  </div>
</template>

<script>
import { GoodsActionButton } from 'vant';
import UA from '@youzan/utils/browser/ua_browser';

export default {
  components: {
    'van-goods-action-button': GoodsActionButton,
  },

  rootState: ['buttons'],

  data() {
    return {
      isAndroid: UA.isAndroid(),
    };
  },

  methods: {
    getColor(index) {
      if (index === this.buttons.length - 1) {
        return this.$theme.colors.main;
      }
      return this.$theme.colors.vice;
    },

    getFontColor(index) {
      if (index === this.buttons.length - 1) {
        return this.$theme.colors.mainText;
      }
      return this.$theme.colors.viceText;
    },

    handleClick(action) {
      action && action();
    },

    isArray(val) {
      return Array.isArray(val);
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.buttons {
  display: flex;
  width: 100%;

  &--android {
    .van-goods-action-button--last {
      margin-right: 12px;
    }
  }

  .main {
    display: block;
    font-size: 12px;
    font-weight: bold;
    line-height: 16px;
  }

  .vice {
    @include mini-font;

    display: block;
    font-weight: normal;
    line-height: 14px;
  }
}
</style>
