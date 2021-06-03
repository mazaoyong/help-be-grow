<template>
  <div class="share-card">
    <vis-popup-close :show-pop="showPop" @close-pop="onPopClose">
      <template>
        <img v-if="isInited" class="share-card__card" :src="canvasImg">
        <div v-else class="share-card__loading">
          <van-loading size="60px" />
        </div>
        <div class="share-card__desc">
          长按图片可保存到相册
        </div>
      </template>
    </vis-popup-close>
  </div>
</template>

<script>
import { Toast, Loading } from 'vant';
import { Canvas, PopupClose } from '@youzan/vis-ui';
import { uploadNetMaterial } from 'pct/utils';
import apis from './apis';
import mixinPackage from './mixins/mixin-package';
import { getCommonWeappCode } from '@/common-api/utils';

const canvas = Canvas.coreDraw;

const global = window._global;
const miniprogram = global.miniprogram || {};
const isWeapp = miniprogram.isWeapp;

export default {
  name: 'share-card',

  components: {
    'vis-popup-close': PopupClose,
    'van-loading': Loading,
  },

  mixins: [mixinPackage],

  props: {
    value: {
      type: Boolean,
      default: false,
    },

    alias: {
      type: String,
      default: '',
    },

    type: {
      type: Number,
      default: -1,
    },

    pageUrl: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      isInited: false,
      canvasImg: '',
      qrcodeUrl: '',
      errMsg: '',
      showPop: false,
    };
  },

  watch: {
    value(showPop) {
      if (showPop) {
        if (!this.isInited) {
          this.init();
        }
        this.showPop = true;
      } else {
        this.showPop = false;
      }
    },
  },

  created() {
    this.fetchPoster().catch(error => {
      this.$emit('error', error);
    });
  },

  methods: {
    init() {
      const steps = [
        this.getAvatar(_global.visBuyer.finalAvatar),
      ];
      if (this.pageUrl) {
        steps.push(this.fetchQrcode());
      }

      Promise.all(steps)
        .then(([avatarUrl]) => {
          this.drawShareCard(avatarUrl);
        })
        .catch(errMsg => {
          // if (errMsg && typeof errMsg === 'string') {
          //   Toast(errMsg);
          // }
          Toast(errMsg && typeof errMsg === 'string' ? errMsg : '网络错误');
          this.errMsg = errMsg;
          this.$emit('error', errMsg);
        });
    },

    fetchPoster() {
      return apis.getActivityPoster({
        alias: this.alias,
        type: this.type,
      })
        .then(res => {
          if (res && res.type) {
            switch (this.type) {
              case 7:
                this.parsePackageData(res.data);
                break;
              default:
                break;
            }
          }
        });
    },

    fetchQrcode() {
      if (isWeapp) {
        // 生成小程序码
        const data = {
          page: `/packages/edu/webview/index`,
          targetUrl: encodeURIComponent(this.pageUrl),
        };
        return getCommonWeappCode(data)
          .then(res => {
            if (res) {
              this.qrcodeUrl = res;
            }
          });
      } else {
        return apis.getQrCode({
          url: this.pageUrl,
          width: 160,
          height: 160,
          isShortenUrl: false,
        })
          .then(res => {
            if (res) {
              this.qrcodeUrl = res;
            }
          });
      }
    },

    drawShareCard(avatarUrl = '') {
      let shareCardConfig = null;

      if (this.type === 7) {
        shareCardConfig = this.getPackageConfig(avatarUrl);
      }

      canvas(shareCardConfig).then((canvas) => {
        const canvasImg = canvas.toDataURL('image/png');
        this.canvasImg = canvasImg;
        this.isInited = true;
      })
        .catch(() => {
          Toast('生成卡片失败，等会再来试试吧');
        });
    },

    getAvatar(avatarSrc = '') {
      return uploadNetMaterial(avatarSrc)
        .then((res = {}) => {
          return res.data.url.replace('http:', 'https:');
        });
    },

    onPopClose() {
      this.$emit('input', false);
    },
  },
};
</script>

<style lang="scss">
.share-card {

  &__loading {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 311px;
    height: 455px;
  }

  &__card {
    margin-top: 5px;
    width: 311px;
    height: 455px;
    background: #fff;
    border-radius: 4px;
  }

  &__desc {
    margin-top: 12px;
    line-height: 20px;
    text-align: center;
    font-size: 14px;
    color: #fff;
  }
}
</style>
