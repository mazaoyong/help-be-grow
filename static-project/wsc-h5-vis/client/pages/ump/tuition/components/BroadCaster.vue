<!--   跑马灯组件，使用 Vant Swipe 简单实现  -->
<template>
  <van-swipe
    class="container"
    :touchable="false"
    vertical
    :autoplay="3000"
    :show-indicators="false"
  >
    <van-swipe-item v-for="(content, idx) of contents" :key="idx">
      <div class="content">
        <van-img
          :src="content.avatar"
          round
          fit="contain"
          width="16"
          height="16"
          class="avatar"
        />
        <span class="text">{{ content.text }}</span>
      </div>
    </van-swipe-item>
  </van-swipe>
</template>

<script lang="ts">
/**
 * @todo 该组件使用通用接口，考虑抽取为通用能力。
 */
import Vue from 'vue';
import {
  Image as VanImg,
  Swipe as VanSwipe,
  SwipeItem as VanSwipeItem,
} from 'vant';

export default Vue.extend({
  name: 'dan-mu',
  components: {
    VanImg,
    VanSwipe,
    VanSwipeItem,
  },
  props: {
    contents: {
      type: Array,
      default: () => [],
    },
  },
});
</script>

<style lang="scss" scoped>

.container {
  height: 28px;
  width: 287px;
  .content {
    margin-top: 2px;
    display: inline-flex;
    max-width: 100%;
    background: rgba($color: #000000, $alpha: 0.4);
    height: 24px;
    box-sizing: border-box;
    color: #ffffff;
    border-radius: 12px;
    align-items: center;
    font-size: 13px;
    padding: 0 4px;
    .avatar {
      flex: none;
    }
    .text {
      margin-left: 4px;
      overflow: hidden;
      white-space: nowrap;
      word-break: break-all;
      text-overflow: ellipsis;
    }
  }
}
</style>
