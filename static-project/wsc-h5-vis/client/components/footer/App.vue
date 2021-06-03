<template>
  <div v-if="isShowFooter">
    <div id="js-footer-textarea" class="js-lazy" style="display:none;">
      <div class="footer">
        <div class="copyright">
          <div v-if="footerData.nav.length" class="ft-links">
            <a
              v-for="(item, index) in nav"
              :key="index"
              :href="item.link ? item.link : 'javascript:;'"
              :class="item.className"
            >
              {{ item.title }}
            </a>
          </div>
          <div
            v-if="!hideCopyright"
            class="ft-copyright"
            :style="copyrightStyle"
          >
            <a
              v-if="!hidePoweredBy"
              :class="powerByClass"
              :href="logoLink"
            >
              {{ text }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ZNB } from '@youzan/wxsdk';
import footerLoader from './footerLoader';

export default {
  name: 'shop-footer',

  props: {
    footerData: Object,
  },

  data() {
    return {
      isShowFooter: false,
      ...this.footerData,
    };
  },

  computed: {
    powerByClass() {
      return {
        'yz-logo': !!this.logoUrl,
      };
    },
    copyrightStyle() {
      let style = {};

      if (this.logoUrl) {
        style = {
          'background-image': `url(${this.logoUrl})`,
        };
      }
      return style;
    },
  },

  mounted() {
    ZNB.getEnv().then(env => {
      if (env.platform !== 'weapp' && env.platform !== 'swan') {
        this.isShowFooter = true;
        footerLoader();
      }
    }).catch(() => {});
  },
};
</script>

<style>
</style>
