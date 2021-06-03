<template>
  <div v-if="show" class="column-update-notice-block">
    <i class="icon" />
    <span>关注商家公众号，开启新课更新提醒服务</span>
    <span v-theme:color.main class="follow" @click="click">立即关注</span>
  </div>
</template>

<script>
import openQrcodePop from '@/pages/course/detail/components/qrcode-pop';
import { getWxFollowStatus } from './api';

export default {
  data() {
    return {
      show: false,
      qrUrl: '',
    };
  },

  rootState: ['goodsData', 'mpData', 'env'],

  created() {
    this.init();
  },

  methods: {
    init() {
      if (this.goodsData.isOwnAsset && !this.env.isWeapp) {
        getWxFollowStatus(this.goodsData.alias).then(res => {
          this.show = res.needNotice;
          this.qrUrl = res.qrUrl;
        });
      }
    },

    click() {
      openQrcodePop({
        props: {
          qrCode: this.qrUrl,
          tip: '长按识别二维码，关注公众号开启新课更新提醒',
          shopData: {
            logo: this.mpData.logo,
            name: this.mpData.shopName,
          },
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.column-update-notice-block {
  padding: 12px 16px;
  font-size: 14px;
  line-height: 24px;
  color: $main-text-color;
  background-color: $white;

  .icon {
    float: left;
    width: 24px;
    height: 24px;
    margin-right: 8px;
    background: url(/wsc-h5-vis/course/detail/qrcode-icon.png) no-repeat center / cover;
  }

  .follow {
    margin-left: 2px;
  }
}
</style>
