<template>
  <div v-if="showShareWX || showQr || showImgQr || showCopy" class="directseller-sharemask">
    <div class="share-mask__ele-wrap js-ele-mask" @click="closeWXMask">
      <div v-if="showShareWX" class="share-mask__wechat">
        <div class="share-mask__wechat-title">
          立即推广给好友吧
        </div>
        <div class="share-mask__wechat-desc">
          点击屏幕右上角将本页面分享给好友
        </div>
        <div class="share-mask__wechat-icon">
          <img src="https://img01.yzcdn.cn/public_files/2017/08/30/0db0c59e46d67472ed92a4ced7c70903.png" alt="">
        </div>
      </div>

      <div v-if="showCopy" class="share-mask__copy-dialog">
        <div class="share-mask__copy-title">
          复制分享链接
        </div>
        <textarea
          v-model="copyText"
          class="share-mask__copy-text"
          type="text"
        />
        <div class="share-mask__dialog-cancel" @click="closeMask" />
      </div>

      <div v-if="showQr" class="share-mask__qrcode">
        <div id="container" class="share_mask__qrcode-img">
          <div class="share-mask__cancel-icon" @click="closeMask" />
          <img :src="qrUrl">
        </div>
      </div>

      <div v-if="showImgQr" class="share-mask__img-qrcode">
        <div class="share-mask__img-qrcode">
          <div
            v-if="!isGoods"
            id="container"
            class="share-mask__qrcode-nogoods-container"
          >
            <div class="share-mask__cancel-icon" @click="closeMask" />
            <img :src="simpleimgQrUrl">
          </div>

          <div
            v-else
            id="container"
            class="share-mask__qrcode-goods-container"
          >
            <div class="share-mask__cancel-icon" @click="closeMask" />
            <img :src="imgQrUrl">
          </div>
        </div>
      </div>

      <div v-if="!showShareWX && !showCopy && (showQr || showImgQr)" class="share-mask__press-save">
        <div class="share-mask__press-save-btn">
          <img src="https://img01.yzcdn.cn/public_files/2017/09/12/ecc53ff7ea42dc8209b9445ee218f342.png" alt="">长按图片保存至相册
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showShareWX: Boolean,
    showQr: Boolean,
    showImgQr: Boolean,
    isGoods: Boolean,
    qrUrl: String,
    simpleimgQrUrl: String,
    imgQrUrl: String,
    showCopy: Boolean,
    copyText: String,
  },

  // 若有qr 和 imgqr任意一个不为空，则不显示

  methods: {
    closeWXMask() {
      // 非微信分享时，背景点击可关闭
      if (!this.showShareWX) return;
      this.$emit('close-mask');
    },
    closeMask() {
      this.$emit('close-mask');
    },
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';

.share-mask {
  &__ele-wrap {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .8);
  }

  &__wechat {
    &-title {
      height: 29px;
      margin: auto;
      margin-top: 140px;
      font-size: 20px;
      line-height: 29px;
      color: #fff;
      text-align: center;
    }

    &-desc {
      margin-top: 4px;
      font-size: 14px;
      line-height: 20px;
      color: #fff;
      text-align: center;
    }

    &-icon {
      position: fixed;
      top: 12px;
      right: 33px;
      width: 66px;
      height: 117px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  &__qrcode {
    position: relative;
    margin: 0 auto;
    margin-top: 125px;
    text-align: center;

    img {
      width: 300px;
    }
  }

  &__press-save-desc {
    width: 300px;
    margin: 0 auto;
    margin-top: 10px;
    font-size: 12px;
    color: #ababab;
    text-align: center;
  }

  &__press-save-btn {
    position: relative;
    width: 300px;
    height: 14px;
    margin: 0 auto;
    margin-top: 20px;
    font-size: 14px;
    line-height: 14px;
    color: #e5e5e5;
    text-align: center;

    img {
      width: 12.5px;
      height: 14px;
      margin-right: 5.5px;
      vertical-align: bottom;
    }
  }

  &__qrcode-goods-container,
  &__qrcode-nogoods-container {
    position: relative;
    margin: 0 auto;
    margin-top: 82px;
    text-align: center;

    img {
      width: 300px;
    }
  }

  &__copy-dialog {
    position: relative;
    padding: 20px;
    margin: 0 auto;
    margin-top: 180px;
    margin-right: 25px;
    margin-left: 25px;
    background-color: #fff;
    border-radius: 4px;
  }

  &__dialog-cancel {
    position: absolute;
    top: -16px;
    right: -16px;
    width: 32px;
    height: 32px;
    background-image: url('data:image/png;base64,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');
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 32px 32px;
  }

  &__copy-title {
    margin-bottom: 10px;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 1.3px;
    color: #333;
  }

  &__copy-text {
    position: relative;
    width: 100%;
    height: 52px;
    padding: 8px 10px;
    overflow: hidden;
    font-size: 12px;
    line-height: 18px;
    color: #666;
    background-color: #fefefe;
    border: 1px solid #e5e5e5;
    border-radius: 3px;
    box-sizing: border-box;
    resize: none;

    &::after {
      position: absolute;
      border-color: #e5e5e5;
      border-radius: 3px;

      @include border-retina(surround, #e5e5e5);
    }

    &:focus {
      outline: none;
    }
  }

  &__qrcode-goods-container {
    margin-top: 55px;
  }

  &__qrcode-wrap {
    position: relative;
  }

  &__cancel-icon {
    position: absolute;
    top: -12px;
    left: 50%;
    z-index: 100;
    width: 32px;
    height: 32px;
    margin-left: 135px;
    background-image: url('data:image/png;base64,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');
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 32px 32px;
  }

  &__loading-img {
    img {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 30px;
      height: 30px;
      margin-top: -15px;
      margin-left: -15px;
      animation: loading .6s linear infinite;
    }
  }
}

@media screen and (max-width: 374px) {
  .share-mask {
    &__qrcode-nogoods-container,
    &__qrcode-goods-container,
    &__qrcode {
      img {
        width: 280px;
      }
    }

    &__press-save-btn {
      width: 280px;
    }

    &__cancel-icon {
      margin-left: 126px;
    }

    &__qrcode {
      margin-top: 80px;
    }

    &__qrcode-goods-container {
      margin-top: 20px;
    }

    &__qrcode-nogoods-container {
      margin-top: 50px;
    }
  }
}

@keyframes loading {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
