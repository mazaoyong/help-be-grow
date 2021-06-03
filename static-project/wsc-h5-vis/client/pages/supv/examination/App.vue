<template>
  <div class="exam" :style="{ width: `${pageWidth}px` }">
    <router-view />
  </div>
</template>

<script>
import UA from 'zan-utils/browser/ua_browser';

const PREVIEW_WIDTH = 540;
export default {
  name: 'exam',

  computed: {
    pageWidth() {
      return UA.isMobile() ? window.innerWidth : PREVIEW_WIDTH;
    },
  },
};
</script>

<style lang="scss">
.exam {
  margin: 0 auto;

  .van-button--disabled {
    color: #969799 !important;
    background: #dcdee0 !important;
    border-color: #dcdee0 !important;
  }
}
</style>
