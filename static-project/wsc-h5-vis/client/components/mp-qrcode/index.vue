<template>
  <div v-if="!isBdapp" class="mp-qrcode">
    <van-popup v-model="show" :close-on-click-overlay="false">
      <div class="mp-qrcode__content">
        <van-icon
          class="mp-qrcode__close"
          name="close"
          size="22px"
          color="#fff"
          @click="onClose"
        />

        <van-loading v-if="isLoading" class="mp-qrcode__loading" />
        <img v-else :src="qrcodeUrl" class="mp-qrcode__code">
        <div v-if="showBuyTip" class="mp-qrcode__tip1">
          {{ buyTip || '你需要关注后才能购买' }}
        </div>
        <div class="mp-qrcode__tip2">
          长按识别或截图保存关注公众号
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { ZNB } from '@youzan/wxsdk';
import { isChainStore } from '@youzan/utils-shop';
import { Popup, Loading, icon, Toast } from 'vant';
import { getMpQrcode, getMpQrcodeList } from '../../common-api/utils/index';

export default {
  name: 'mp-qrcode',

  components: {
    'van-popup': Popup,
    'van-loading': Loading,
    'van-icon': icon,
  },

  props: {
    pushMessage: {
      type: Boolean,
      default: false,
    },
    mpId: {
      type: Number,
      default: 0,
    },
    productId: {
      type: Number,
      default: 0,
    },
    showBuyTip: {
      type: Boolean,
      default: true,
    },
    buyTip: {
      type: String,
      default: '你需要关注后才能购买',
    },
  },

  data() {
    return {
      show: false,
      isLoading: false,
      qrcodeUrl: '',
      isBdapp: false,
    };
  },

  created() {
    this.show = true;
    this.fetchQrcode();
    ZNB.getEnv().then(env => {
      if (env.platform === 'swan') {
        this.isBdapp = true;
      }
    }).catch(() => {});
  },

  methods: {
    fetchQrcode() {
      if (this.pushMessage && this.productId && !isChainStore) {
        this.fetchQrcodeList();
      } else {
        this.fetchQrcodeUrl();
      }
    },

    fetchQrcodeList() {
      this.isLoading = true;
      getMpQrcodeList({
        goodsId: this.productId,
      })
        .then(res => {
          if (res.activities && res.activities.length) {
            res.activities.forEach(activity => {
              if (activity.activityType === 1 && activity.qr) {
                this.qrcodeUrl = activity.qr.url;
              }
            });
          }
        })
        .catch(() => {
          Toast('获取公众号二维码失败');
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    fetchQrcodeUrl() {
      this.isLoading = true;
      getMpQrcode({
        mp_id: this.mpId,
      })
        .then(res => {
          if (res.qrcodeUrl) {
            this.qrcodeUrl = res.qrcodeUrl;
          }
        })
        .catch(() => {
          Toast('获取公众号二维码失败');
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    onClose() {
      this.show = false;
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss">
.mp-qrcode {
  .van-popup {
    overflow-y: visible;
    background: transparent;
  }

  &__content {
    position: relative;
    padding: 40px 52px;
    text-align: center;
    background: #fff;
    border-radius: 4px;
    box-sizing: border-box;
  }

  &__close {
    position: absolute;
    top: -38px;
    right: 0;
  }

  &__loading {
    margin: 0 auto;
  }

  &__code {
    width: 160px;
    height: 160px;
  }

  &__tip1 {
    margin-top: 16px;
    font-size: 16px;
    line-height: 20px;
    color: #323233;
    text-align: center;
    white-space: nowrap;
  }

  &__tip2 {
    margin-top: 8px;
    font-size: 14px;
    line-height: 18px;
    color: #7d7e80;
    text-align: center;
    white-space: nowrap;
  }
}
</style>
