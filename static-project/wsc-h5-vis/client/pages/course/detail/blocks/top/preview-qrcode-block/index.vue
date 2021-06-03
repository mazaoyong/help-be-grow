<template>
  <div v-if="show && qrcode" class="preview-qrcode-block-container">
    <div class="preview-qrcode-block">
      <div class="title">
        <i class="icon" />
        <span>手机扫码购买</span>
      </div>
      <p class="desc">
        微信“扫一扫”立即购买
      </p>
      <img class="qrcode" :src="qrcode" />
    </div>
    <p class="scan" @click="login" v-show="!isLogin">点击扫码登录店铺查看更多</p>
  </div>
</template>

<script>
import buildUrl from '@youzan/utils/url/buildUrl';
import openLoginDialog from '../../../../../../components/dialog-login/index';
import { getQrcode } from './api';

const _global = window._global;

export default {
  rootState: ['env', 'kdtId', 'goodsData'],

  data() {
    const user = _global.user || {};
    return {
      qrcode: '',
      isLogin: !!(user && user.has_login),
    };
  },

  computed: {
    show() {
      if (!this.env.isMobile) {
        return true;
      }
      return false;
    },
  },

  created() {
    if (this.show) {
      const url = buildUrl(`/wscvis/course/detail/${this.goodsData.alias}?kdt_id=${this.kdtId}`, 'h5', this.kdtId);
      getQrcode(url).then((res) => {
        this.qrcode = res;
      });
      if (!this.isLogin && !window.localStorage.getItem('courseScanLoginDialogOpened')) {
        window.localStorage.setItem('courseScanLoginDialogOpened', true);
        this.login();
      }
    }
  },

  methods: {
    login() {
      openLoginDialog();
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';
.preview-qrcode-block-container {
  position: fixed;
  top: 0;
  margin-top: 200px;
  margin-left: 572px;
  .preview-qrcode-block {
    background-color: $white;
    border: 1px solid $light-border-color;
    border-radius: 5px;
    box-sizing: border-box;
    padding: 8px;
    width: 180px;
    .title {
      padding: 0 8px;
      font-size: 16px;
      line-height: 36px;
      color: #6dc016;
      border-bottom: 1px dashed $gray-icon-color;

      .icon {
        display: inline-block;
        width: 30px;
        height: 24px;
        margin-right: 8px;
        vertical-align: sub;
        background: url(https://b.yzcdn.cn/v2/image/wap/weixin_logo.png) no-repeat;
      }
    }

    .desc {
      font-size: 14px;
      line-height: 30px;
      text-align: center;
    }

    .qrcode {
      width: 164px;
    }
  }
  .scan {
    text-align: center;
    font-size: 14px;
    color: #2487e1;
    margin-top: 15px;
    cursor: pointer;
  }
}
</style>
