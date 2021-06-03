<template>
  <div v-if="!isBdapp" v-show="options.loaded">
    <div class="fullguide-follow" v-if="options.qrcode">
      <!-- pc top -->
      <template v-if="!showCopyright">
        <p>通过微信【扫一扫】功能</p>
        <p>扫描二维码关注我们</p>
        <img :src="options.qrcode" alt="公众号二维码">
      </template>
      <!-- follow top -->
      <template v-else>
        <h3 v-if="showFollowMsg" class="fullguide-follow__inner-title">
          你需要关注后才能购买
        </h3>
        <div class="fullguide-follow__wxid">
          <img :src="options.qrcode" alt="公众号二维码">
        </div>
        <!-- bottom text -->
        <copyright :weixin="options.mpWeixin" />
      </template>
    </div>
    <no-follow v-else />
  </div>
</template>

<script>
import { ZNB } from '@youzan/wxsdk';
import NoFollow from './NoFollow';
import Copyright from './Copyright';
import { NEED_COPYRIGHT, BUY_AFTER_FOLLOW } from '../config';

export default {
  name: 'follow',

  components: {
    [Copyright.name]: Copyright,
    [NoFollow.name]: NoFollow,
  },

  props: ['options'],

  data() {
    const { viewType } = this.options;
    return {
      viewType,
      view: `component-${viewType}`,
      isBdapp: false,
    };
  },

  computed: {
    showCopyright() {
      return NEED_COPYRIGHT.indexOf(this.viewType) > -1;
    },
    showFollowMsg() {
      return BUY_AFTER_FOLLOW.indexOf(this.viewType) > -1;
    },
  },

  created() {
    ZNB.getEnv().then(env => {
      if (env.platform === 'swan') {
        this.isBdapp = true;
      }
    }).catch(() => {});
  },
};
</script>
