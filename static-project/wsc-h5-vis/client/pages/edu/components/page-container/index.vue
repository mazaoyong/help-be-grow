/* eslint-disable vue-scoped-css/require-scoped */
<template>
  <div
    id="app-content"
    :class="mediaClass"
    :style="`min-height:${height}px`"
    class="page-container"
  >
    <slot />
    <div
      v-if="showQrcode"
      class="pc-qrcode"
    >
      <p>手机扫码访问</p>
      <img
        :src="qrcode"
        class="preview-qrcode"
        alt="二维码"
      >
      <a
        :href="editUrl"
        v-if="isAdmin && editUrl"
      >重新编辑</a>
    </div>
  </div>
</template>

<script>
let app;
try {
  if (window) {
    const UA = require('zan-utils/browser/ua_browser');
    const Args = require('zan-utils/url/args');
    const axios = require('axios');
    const Toast = 'vant/lib/toast';
    const screenHeight = window.innerHeight;
    const isIphoneX = !!document.getElementsByClassName('is-iphonex').length;
    const height = isIphoneX ? screenHeight - 180 : screenHeight - 146;

    app = {
      name: 'PageContainer',

      data() {
        const isAdmin = window._global.wscvis_edu && window._global.wscvis_edu.is_admin;
        return {
          height,
          qrcode: '',
          isLoading: '',
          isAdmin: !!isAdmin,
        };
      },
      computed: {
        alias() {
          return Args.get('alias');
        },
        zanAlias() {
          return Args.get('zanAlias');
        },
        editUrl() {
          return `https://www.youzan.com/v4/vis/edu/course#/course-manage/edit/${this.alias}`;
        },
        showQrcode() {
          return this.isPC && !this.isLoading && !this.zanAlias;
        },
        isPC() {
          return !UA.isMobile();
        },
        mediaClass() {
          return {
            'pc-mode': this.isPC,
          };
        },
      },
      mounted() {
        if (this.isPC) {
          this.init();
        }
      },
      methods: {
        init() {
          // TODO fixme SSR 方案导致组件使用原生axios
          axios({
            method: 'GET',
            url: '/wscvis/knowledge/qrcode.json',
            params: {
              isShortenUrl: true,
              url: window.location.href,
              kdt_id: window._global.kdt_id,
              deleteWhite: true,
            },
            timeout: 5000,
          }).then(res => {
            this.isLoading = false;
            if (res.data && res.data.code === 0) {
              this.qrcode = res.data.data;
            }
          })
            .catch(err => {
              Toast.fail(err.msg);
            });
        },
      },
    };
  }
} catch (error) { // node环境
  app = {
    name: 'PageContainer',
    data() {
      return {
        height: 521,
        mediaClass: '',
        showQrcode: false,
        isAdmin: false,
        editUrl: false,
      };
    },
  };
}

export default app;
</script>

<style lang="scss">// eslint-disable-line
@import 'var';

$body-background: #f8f8f8;

body {
  height: auto;
  background-color: $body-background;
  overflow-x: hidden;
}

body::-webkit-scrollbar {
  display: none;
  overflow: hidden;
}

.page-container {
  position: relative;
}

/* 文字分隔符 */
.content-separator {
  border-left: 1px solid;
  margin: 0 4px;
}

/* reset 全局css 给所有元素设置了box-sizing: border-box; */
.cap-app-nav__main {
  box-sizing: content-box;
}

.pc-mode {
  position: relative;
  margin: 0 auto;
  width: 375px;

  .video-content-fix {
    position: relative;
    width: 375px;
    left: auto;

    + div {
      margin-top: auto;
    }
  }

  /*
  .auido-content .cover-wrap {
    width: 375px !important;
    height: auto !important;
  }
  */

  .van-goods-action {
    margin: 0 auto;
    width: 375px;
  }

  .paid-content__pay-container,
  .content-action {
    left: 50%;
    width: 375px;
    transform: translateX(-50%);
  }
}

.pc-qrcode {
  position: absolute;
  top: 100px;
  right: -217px;
  width: 155px;
  padding: 15px 12px 23px;
  border: 1px solid $c-gray-light;
  background-color: $c-white;
  box-sizing: content-box;
  color: $c-black;
  text-align: center;

  > p {
    margin-bottom: 15px;
    font-size: 14px;
  }

  > a {
    display: inline-block;
    margin-top: 15px;
    width: 68px;
    height: 30px;
    line-height: 30px;
    border: 1px solid $c-gray-light;
    border-radius: 2px;
    font-size: 12px;
    color: $c-black;
  }

  .preview-qrcode {
    width: 155px;
    height: 155px;
  }
}
</style>
