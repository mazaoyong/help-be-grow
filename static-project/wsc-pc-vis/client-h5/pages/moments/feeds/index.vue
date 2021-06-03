<template>
  <div
    class="moments-feeds fit-iphonex"
    :style="{
      height: htmlHeight + 'px'
    }"
  >
    <div class="moments-feeds-container">
      <!-- 包含用户头像和背景图 -->
      <feeds-header />
      <!-- 通知中心提示 -->
      <feeds-notifications />

      <div
        v-if="!isHqStore"
        class="moments-feeds__add"
      >
        <a
          :href="`/v4/vis/h5/edu/moments/post-edit?pageFrom=2&kdtId=${kdtId}&redirectUrl=${publishRedirectUrl}`"
        >
          <van-icon name="plus" color="#fff" />
        </a>
      </div>

      <feeds-cards />
    </div>
  </div>
</template>

<script>
import { Icon } from 'vant';
import { isHqStore } from '@youzan/utils-shop';

import FeedsCards from './views/feeds-cards';
import FeedsHeader from './views/header';
import FeedsNotification from './views/notification';

export default {
  name: 'moments-feeds',

  components: {
    'feeds-cards': FeedsCards,
    'feeds-header': FeedsHeader,
    'feeds-notifications': FeedsNotification,
    'van-icon': Icon,
  },

  data() {
    return {
      isHqStore,
      kdtId: _global.kdtId,
      publishRedirectUrl: encodeURIComponent(window.location.href),
      htmlHeight: 667,
    };
  },

  created() {
    this.htmlHeight = window.document.documentElement.getBoundingClientRect().height;
  },
};
</script>

<style lang="scss">
/* 解决输入法出现底部白色底凸起的问题 */
html {
  body:after {
    display: block;
    content: '';
    width: 100%;
    height: 0px !important;
    background-color: inherit;
  }
}

html:not(.forbid-scroll) {
  .moments-feeds-container {
    -webkit-overflow-scrolling: touch;
  }
}

.moments-feeds {
  cursor: pointer;
  position: relative;
  overflow: hidden;

  .moments-feeds-container {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    overflow-y: auto;
  }

  &__add {
    position: fixed;
    right: 20px;
    bottom: 20px;
    width: 54px;
    height: 54px;
    overflow: hidden;
    background-color: #00B389;
    border-radius: 50%;
    z-index: 998;

    .van-icon {
      display: block;
      font-size: 30px;
      font-weight: bold;
      line-height: 54px;
      text-align: center;
    }
  }
}
</style>
