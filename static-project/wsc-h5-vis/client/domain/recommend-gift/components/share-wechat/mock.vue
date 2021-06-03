<template>
  <vis-popup-close
    class="recommend-gift-poster"
    :show-pop="value"
    v-on="proxyListeners"
    @close-pop="onClosePop"
  >
    <div class="recommend-gift-poster__container">
      <share-poster :draw-info="drawInfo" />
      <p class="recommend-gift-poster__tip">
        长按保存海报，发送给好友
      </p>
    </div>
  </vis-popup-close>
</template>

<script>
import { PopupClose } from '@youzan/vis-ui';
import SharePoster from '@/pages/ump/referral-invite/__posters__/share-wechat/index.vue';
export default {
  name: 'recommend-gift-poster',

  components: {
    'vis-popup-close': PopupClose,
    SharePoster,
  },

  props: {
    drawInfo: {
      type: Object,
      default: () => ({}),
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
</style>
