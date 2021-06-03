<template>
  <div
    class="fullguide"
    v-show="visible"
    @click="visible = false"
  >
    <i
      v-if="!isNeedQrcode"
      class="fullguide__arrow"
    />
    <div
      :class="[
        'fullguide__inner',
        {
          'fullguide__inner--for-share': viewType === 'share'
        }
      ]"
    >
      <keep-alive>
        <component
          :is="viewType"
          :options="options"
        />
      </keep-alive>
    </div>
  </div>
</template>

<script>
import UA from 'zan-utils/browser/ua_browser';
import api from './api';
import { NEED_QRCODE } from './config';
import Browser from './components/Browser';
import Fav from './components/Fav';
import Follow from './components/Follow';
import Share from './components/Share';

import './style/index.scss';

export default {
  name: 'fullguide',

  components: {
    [Browser.name]: Browser,
    [Fav.name]: Fav,
    [Follow.name]: Follow,
    [Share.name]: Share,
    goodsFollow: Follow,
    pc: Follow,
  },

  props: ['viewType', 'mpData', 'mpId', 'mpWeixin'],

  data() {
    return {
      visible: false,
      qrcode: '',
      loaded: false,
    };
  },

  computed: {
    isNeedQrcode() {
      return NEED_QRCODE.indexOf(this.viewType) > -1;
    },
    /* eslint-disable */
    options() {
      const { mpData, mpWeixin, viewType, qrcode, loaded } = this;
      if (this.isNeedQrcode) {
        return {
          mpData,
          mpWeixin,
          viewType,
          qrcode,
          loaded,
        };
      } else if (this.viewType === 'share') {
        return {
          message: UA.isIOS() ? '在Safari中打开～' : '在浏览器中打开～',
        };
      }
    },
    /* eslint-enable */
  },

  watch: {
    viewType(val) {
      if (this.isNeedQrcode && !this.qrcode) {
        this.getQrCode();
      }
    },
  },

  created() {
    if (this.isNeedQrcode) {
      this.getQrCode();
    }
  },

  methods: {
    getQrCode() {
      api
        .getShopQrCode({
          mp_id: this.mpId,
        })
        .then(res => {
          this.loaded = true;
          this.qrcode = res.qrcodeUrl;
        })
        .catch(() => {
          this.loaded = true;
        });
    },
  },
};
</script>

<style lang="scss">
</style>
