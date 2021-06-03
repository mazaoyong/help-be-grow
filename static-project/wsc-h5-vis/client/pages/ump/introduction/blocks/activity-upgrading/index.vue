<template>
  <div class="activity-upgrading" :style="style">
    <main v-if="!isLoading">
      <div v-if="hasWeapp" class="qrcode-tip">
        <div class="img-box">
          <img-wrap
            :src="qrcode"
            alt="小程序二维码"
            width="236px"
            height="236px"
          />
        </div>
        <p class="tips-title">
          为保障更好的服务体验
        </p>
        <p class="tips-subtitle">
          请{{ isWeixin ? '长按识别小程序码':'保存小程序码进入微信扫码' }}参与活动
        </p>
      </div>
      <div v-else class="no-qrcode-tip">
        <div class="no-qrcode-tip__img">
          <img-wrap
            width="100px"
            height="100px"
            alt="提示图标"
            src="https://b.yzcdn.cn/public_files/2018/11/19/bfc666f3eb05081b88d7353f43e18123.png"
          />
        </div>
        <p class="tips-subtitle">
          对不起，活动正在升级中，无法参与活动
        </p>
      </div>
    </main>
  </div>
</template>

<script>
import UA from 'zan-utils/browser/ua_browser';
import { getWeappInfo, getCommonWeappCode } from '@/common-api/utils';

import { ImgWrap } from '@youzan/vis-ui';

export default {
  name: 'activity-upgrading',
  components: {
    ImgWrap,
  },

  props: {
    shareUrl: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      isLoading: true,
      qrcode: '',
      hasWeapp: false,
      height: 0,
    };
  },

  computed: {
    isWeixin() {
      return UA.isWeixin();
    },

    style() {
      const height = window.innerHeight;
      return {
        height: `${height}px`,
      };
    },
  },

  mounted() {
    // 先获取有没有小程序店铺
    getWeappInfo()
      .then(weappInfo => {
        if (!weappInfo.appId) {
          return;
        }
        // 如果有小程序店铺，就获取小程序店铺二维码
        return this.fetchQrcode()
          .then(qrcodeImage => {
            this.qrcode = qrcodeImage;
            this.hasWeapp = true;
          });
      }).finally(() => {
        this.isLoading = false;
      });
  },

  methods: {
    fetchQrcode() {
      const data = {
        page: '/packages/edu/webview/index',
        targetUrl: encodeURIComponent(this.shareUrl),
      };
      return getCommonWeappCode(data);
    },
  },
};
</script>
<style lang="scss" scoped>
.activity-upgrading {
  height: 100vh;
  padding: 134px 16px 0px;

  main {
    text-align: center;

    .qrcode-tip {
      padding-bottom: 30px;
      background: #fff;
      border-radius: 8px;
    }

    .no-qrcode-tip {
      padding-top: 220px;

      &__img {
        display: flex;
        justify-content: center;
      }
    }

    .img-box {
      padding: 40px 0 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .tips-title, .tips-subtitle {
      font-size: 14px;
      line-height: 24px;
      color: #AB4D29;
    }
  }
}
</style>
