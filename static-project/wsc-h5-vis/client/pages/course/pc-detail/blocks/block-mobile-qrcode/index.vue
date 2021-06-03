<template>
  <div class="mobile-qrcode-block">
    <div class="mobile-qrcode-block__text">
      <div class="mobile-qrcode-block__text--title">
        手机端观看直播
      </div>
      <div class="mobile-qrcode-block__text--desc">
        请使用已登录的微信<br>帐号扫一扫观看
      </div>
    </div>

    <img-wrap
      class="mobile-qrcode-block__qrcode"
      :src="qrcodeUrl"
      width="80px"
      height="80px"
    />
  </div>
</template>

<script>
import { ImgWrap } from '@youzan/vis-ui';
import { getQrcode } from '../../apis';

export default {
  name: 'mobile-qrcode-block',

  components: {
    ImgWrap,
  },

  data() {
    return {
      qrcodeUrl: '',
    };
  },

  created() {
    getQrcode({
      url: window.location.href || '',
      errorCorrectionLevel: 1,
      deleteWhite: true,
    }).then(res => {
      if (res) {
        this.qrcodeUrl = res;
      }
    }).catch(errMsg => {
      console.log(errMsg);
    });
  },
};
</script>

<style lang="scss">
.mobile-qrcode-block {
  display: flex;
  padding: 24px;
  background: #fff;

  &__text {
    flex: 1 1 auto;

    &--title {
      font-size: 20px;
      font-weight: 700;
      line-height: 28px;
      color: #323233;
    }

    &--desc {
      margin-top: 8px;
      font-size: 14px;
      line-height: 20px;
      color: #323233;
    }
  }

  &__qrcode {
    flex: 0 0 80px;
  }
}
</style>
