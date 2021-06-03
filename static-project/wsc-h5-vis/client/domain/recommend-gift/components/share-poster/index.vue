<template>
  <vis-popup-close
    class="recommend-gift-poster"
    :show-pop="value"
    v-on="proxyListeners"
    @close-pop="onClosePop"
  >
    <div class="recommend-gift-poster__container">
      <img class="recommend-gift-poster__poster" :src="poster" alt="">
      <p class="recommend-gift-poster__tip">
        长按保存海报，发送给好友
      </p>
    </div>
  </vis-popup-close>
</template>

<script>
// 请注意文件名、最外层元素class和name属性要保持一致
import { PopupClose } from '@youzan/vis-ui';
export default {
  name: 'recommend-gift-poster',

  components: {
    'vis-popup-close': PopupClose,
  },

  props: {
    poster: {
      type: String,
      default: '',
    },
    value: {
      type: Boolean,
      required: true,
    },
    proxyListeners: {
      type: Object,
      default: () => ({}),
    },
  },

  methods: {
    onClosePop() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
