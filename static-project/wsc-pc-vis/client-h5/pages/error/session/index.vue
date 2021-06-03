<template>
  <div v-if="loading" class="loading-container">
    <van-loading type="spinner" />
  </div>
</template>
<script>
import ZNB from '@youzan/znb';
import { action } from '@youzan/zan-jsbridge';
import UA from '@youzan/utils/browser/ua_browser';
import Args from '@youzan/utils/url/args';
import compareVersions from '@youzan/utils/string/compareVersions';

import { Loading, Dialog } from 'vant';
export default {
  name: 'session-error',

  components: {
    'van-loading': Loading,
    [Dialog.Component.name]: Dialog.Component,
  },

  data() {
    return {
      loading: false,
    };
  },

  created() {
    if (UA.isWsc()) {
      const { type } = Args.get('type');
      if (type === 'json') {
        // json session失效
        this.showTip();
      } else {
        // 页面session失效
        const MAX_WAIT_TIME = 3000;
        const appVersion = UA.getPlatformVersion();
        if (compareVersions(appVersion, '4.66.0') >= 0) {
          document.title = '正在尝试修复页面';
          this.loading = true;
          const refreshSession = new Promise((resolve, reject) => {
            action.on('refreshEduSessionSuccess', () => {
              resolve();
            });
            action.call('refreshEduSession');
          });
          // 最多等待微商城app 3s 去刷新sessionId
          const timeout = new Promise((resolve, reject) => {
            setTimeout(() => {
              reject('刷新session失败');
            }, MAX_WAIT_TIME);
          });
          Promise.race([refreshSession, timeout])
            .then(() => {
              const redirectUrl = decodeURIComponent(Args.get('redirect_url'));
              if (redirectUrl !== '' &&
                redirectUrl.indexOf('/v4/vis/h5/error/session') === -1) {
                location.href = redirectUrl;
                this.loading = false;
              } else {
                this.loading = false;
                this.showTip();
              }
            })
            .catch(() => {
              document.title = '页面异常';
              this.loading = false;
              this.showTip();
            });
        } else {
          // 兼容老版本App
          this.showTip();
        }
      }
    } else if (UA.isMiniProgramWebview()) {
      // 商家端小程序环境
      ZNB.init().then(() => {
        ZNB.getWx().then((wx) => {
          wx.miniProgram.reLaunch({
            url: '/pages/login/index?pageType=LOGOUT',
          });
        });
      });
    } else {
      // 其他环境（如PC)
      location.href = '//account.youzan.com/h5/login';
    }
  },

  methods: {
    showTip() {
      Dialog.alert({
        title: '提示',
        message: '页面发生异常，您可以尝试回到店铺页后重新进入',
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.loading-container {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.5);

  .van-loading {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
