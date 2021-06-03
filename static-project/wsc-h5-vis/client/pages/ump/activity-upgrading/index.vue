<template>
  <div class="activity-upgrading">
    <main v-if="!isLoading">
      <div v-if="hasWeapp" style="padding-top:180px">
        <img-wrap
          :src="qrcode"
          alt="小程序二维码"
          width="130px"
          height="130px"
        />
        <p class="tips-title">
          为保障更好的服务体验
        </p>
        <p class="tips-subtitle">
          请{{ isWeixin? '长按识别小程序码':'保存小程序码进入微信扫码' }}参与活动
        </p>
      </div>
      <div v-else style="padding-top:220px">
        <img-wrap
          width="40px"
          height="42px"
          alt="提示图标"
          src="https://b.yzcdn.cn/public_files/e7b5097a960ac3e0dd198e8ac6491f45.png"
        />
        <p class="tips-subtitle">
          对不起，活动正在升级中，无法参与活动
        </p>
      </div>
    </main>
  </div>
</template>

<script>
import Args from 'zan-utils/url/args';
import UA from 'zan-utils/browser/ua_browser';
import { getWeappInfo, getCommonWeappCode } from '../../../common-api/utils';

import { ImgWrap } from '@youzan/vis-ui';

export default {
  name: 'activity-upgrading',
  components: {
    'img-wrap': ImgWrap,
  },
  data() {
    return {
      alias: Args.get('alias') || '',
      isLoading: true,
      qrcode: '',
      hasWeapp: false,
      type: Args.get('type') || 'edu',
    };
  },
  computed: {
    isWeixin() {
      return UA.isWeixin();
    },
    isEdu() {
      return this.type === 'edu';
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
      const {
        kdt_id: kdtId,
        url: { h5: globalH5Url },
      } = window._global;
      const alias = this.alias;
      const baseUrl = `${globalH5Url}/wscvis/${
        this.isEdu ? 'edu/prod-detail' : 'knowledge/index'
      }?`;
      const data = {};
      // TODO: 以后知识付费迁移内嵌 h5 后此处生成链接的逻辑要改
      if (this.isEdu) {
        // 线下课是内嵌 H5，生成 webview 的二维码
        data.page = '/packages/edu/webview/index';
        data.targetUrl = encodeURIComponent(
          `${baseUrl}alias=${alias}&kdt_id=${kdtId}`
        );
      } else {
        // 知识付费是原生小程序，生成原生页面二维码
        data.page = `/packages/paidcontent/${this.type}/index?kdt_id=${kdtId}&alias=${alias}`;
      }
      return getCommonWeappCode(data);
    },
  },
};
</script>
<style lang="scss">
body {
  background: #fff;
}

.activity-upgrading {
  main {
    text-align: center;
    .imgWrap {
      margin: 0 auto 20px;
    }
    .tips-title {
      font-size: 14px;
    }
    .tips-subtitle {
      font-size: 12px;
      margin-top:8px;
      color: #969799;
    }
  }
}
</style>
