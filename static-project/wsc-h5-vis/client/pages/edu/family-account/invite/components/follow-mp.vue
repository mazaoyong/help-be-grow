<template>
  <!-- 公众号关注引导 -->
  <van-popup
    v-model="showActionSheet"
    :buttons="buttons"
    class="follow-up"
  >
    <h3>了解学员学习动态</h3>
    <template v-if="isShow">
      <div v-if="isLoaded" class="img-container">
        <img-wrap width="178px" height="178px" :src="logoWithQrUrl" />
        <!-- 非微信环境需要保存图片 -->
        <img-wrap
          v-if="!isWX"
          width="178px"
          height="178px"
          :src="logoAndQrUrl"
          class="img-cover"
        />
      </div>
      <div v-else class="img-loading">
        <van-loading size="60px" />
      </div>
      <p class="desc">
        长按识别二维码,关注公众号，及时了解学员动态
      </p>
    </template>
    <template v-else>
      <div class="no-account-img-wrap">
        <img class="no-account-img" :src="noAccountImg">
      </div>
      <div class="tip">
        商家二维码失效
        <br>
        公众号暂时无法关注
      </div>
    </template>
  </van-popup>
</template>
<script>
import { Loading, Toast } from 'vant';
import { ImgWrap, Canvas, Popup } from '@youzan/vis-ui';

import { ZNB } from '@youzan/wxsdk';
import { getGuideConfig, getQrcodeConfig } from '../config/guide.config';
import { uploadNetMaterial, invoke } from 'pct/utils';
const canvas = Canvas.coreDraw;

export default {
  name: 'follow-up',

  components: {
    'van-loading': Loading,
    'van-popup': Popup,
    ImgWrap,
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    qrUrl: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
    shopName: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      logoAndQrUrl: '',
      logoWithQrUrl: '',
      isLoaded: false,
      isWX: false,
      isShow: true,
      buttons: [
        {
          text: '我知道了',
          class: 'cancel-btn',
          onClick: () => { this.showActionSheet = false; },
        },
      ],
    };
  },

  computed: {
    showActionSheet: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input');
      },
    },

    noAccountImg() {
      return `${_global.url.imgqn}/public_files/2018/11/19/bfc666f3eb05081b88d7353f43e18123.png`;
    },
  },

  mounted() {
    ZNB.init()
      .then(({ platform }) => {
        if (platform === 'weapp' || platform === 'wechat') {
          this.isWX = true;
        }
        if (this.showActionSheet) {
          if (!this.qrUrl) {
            this.isShow = false && Toast('获取公众号二维码失败，请刷新页面～');
          } else {
            this.initPreviewPic();
          }
        }
      });
  },

  methods: {
    fetchCdnQrUrl() {
      if (!this.qrUrl) {
        return;
      }
      return invoke(uploadNetMaterial, this.qrUrl)
        .then(res => {
          return res.url;
        });
    },

    fetchQrUrl(qrUrl) {
      const { logo, shopName } = this;
      // 带logo的二维码
      const logoWithQrConfig = getQrcodeConfig({
        qrUrl,
        logo,
      });
      canvas(logoWithQrConfig)
        .then(canvas => {
          this.logoWithQrUrl = canvas.toDataURL('image/png');
          this.isLoaded = true;
        })
        .catch(() => {
          this.isShow = false;
          Toast('获取公众号二维码失败，请刷新页面～');
        });

      if (!this.isWX) {
        // 长按需要保存的二维码
        const logoAndQrConfig = getGuideConfig({
          logo,
          shopName,
          qrUrl,
        });
        return canvas(logoAndQrConfig)
          .then(canvas => {
            this.logoAndQrUrl = canvas.toDataURL('image/png');
          });
      }
    },

    initPreviewPic() {
      this.fetchCdnQrUrl()
        .then(qrUrl => {
          this.fetchQrUrl(qrUrl);
        })
        .catch(() => {
          this.isShow = false;
          Toast('获取公众号二维码失败，请刷新页面～');
        });
    },
  },
};
</script>
<style lang="scss">
@import "mixins/index.scss";
.follow-up {
  padding-top: 16px;
  text-align: center;

  .vis-standard-popup__content {
    min-height: 0 !important;
  }

  .vis-standard-popup__buttons {
    padding: 0 16px;
  }

  .vis-standard-popup__button {
    position: relative;
    margin-bottom: 28px;
    height: 44px;
    line-height: 44px;
    border-radius: 44px;

    .van-button__text {
      color: #323233;
    }

    &::after {
      @include border-retina();
      border-radius: 44px;
    }
  }

  h3 {
    margin-bottom: 18px;
    font-size: 16px;
    text-align: center;
  }

  .imgWrap {
    margin: 0 auto 10px auto;
  }

  .desc {
    margin-bottom: 20px;
    line-height: 20px;
    font-size: 14px;
    color: $text-color;
  }

  .img-container {
    position: relative;

    .img-cover {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      opacity: 0;
    }
  }

  .img-loading {
    margin: 0 auto;
    width: 178px;
    height: 178px;
  }

  .no-account-img-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    width: 220px;
    height: 220px;
    border: 1px solid #dcdee0;

    .no-account-img {
      width: 100px;
      height: 100px;
    }
  }

  .tip {
    margin: 24px 0;
    line-height: 16px;
    font-size: 12px;
    color: #333;
  }
}
</style>
