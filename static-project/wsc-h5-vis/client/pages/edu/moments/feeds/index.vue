<template>
  <div
    class="moments-feeds"
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
        v-if="canPost"
        class="moments-feeds__add"
        :class="hasIntroduction ? 'moments-feeds__add--bottom' : ''"
      >
        <a
          :href="`/wscvis/edu/moments/post-edit?pageFrom=2&kdtId=${kdtId}&redirectUrl=${publishRedirectUrl}`"
        >
          <van-icon name="plus" color="#fff" />
        </a>
      </div>

      <feeds-cards />

      <!-- 转介绍推广 -->
      <introduce-promotion :share-url="introduceShareUrl" @hasIntroduction="hasIntroduction = true" />
    </div>
  </div>
</template>

<script>
import { Icon } from 'vant';
import { isHqStore } from '@youzan/utils-shop';
import Args from 'zan-utils/url/args';
import FeedsCards from './views/feeds-cards';
import FeedsHeader from './views/header';
import FeedsNotification from './views/notification';
import { logVisitMoment } from '../log';
import IntroducePromotion from '@/components/introduce-promotion';

export default {
  name: 'moments-feeds',

  components: {
    'feeds-header': FeedsHeader,
    'feeds-notifications': FeedsNotification,
    'feeds-cards': FeedsCards,
    'van-icon': Icon,
    IntroducePromotion,
  },

  data() {
    return {
      isHqStore,
      kdtId: _global.kdt_id,
      publishRedirectUrl: encodeURIComponent(window.location.href),
      htmlHeight: 667,
      // 转介绍分享链接
      introduceShareUrl: Args.add(location.href, { from: 'moments_feeds' }),
      hasIntroduction: false,
    };
  },

  computed: {
    canPost() {
      return this.$store.state.userInfo.canPost;
    },
  },

  watch: {
    '$store.state.userInfo.moduleName'(newValue) {
      document.title = newValue;
    },
  },

  mounted() {
    // 当由第一个路由进到第二个路由时，微信浏览器会出现底部导航
    // 且此时是第一次出现，页面先计算高度，微信再 push 底部导航，导致计算得出的高度会大于真实页面高度
    this.htmlHeight = window.document.documentElement.getBoundingClientRect().height;
    logVisitMoment();
    this.getCeresConfig();
  },

  methods: {
    getCeresConfig() {
      if (this.$store.state.userInfo.canPost === null) {
        this.$store.dispatch('userInfo/getCeresConfig');
      }
    },
  },
};
</script>

<style lang="scss">
html,
body {
  height: 100%;
}

.container {
  cursor: pointer;

  /* relative 解决了 mounted 时微信的 bug */
  position: relative;
  overflow: hidden;
}

html:not(.forbid-scroll) {
  .moments-feeds-container {
    -webkit-overflow-scrolling: touch;
  }
}

.moments-feeds-container {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow-y: auto;
}

.moments-feeds__add {
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

  &--bottom {
    bottom: 100px;
  }
}
</style>
