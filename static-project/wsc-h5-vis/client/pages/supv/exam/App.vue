<template>
  <div
    id="app-content"
    :class="mediaClass"
  >
    <router-view />
    <div
      v-if="showQrcode"
      class="pc-qrcode"
    >
      <p>手机扫码访问</p>
      <img
        class="preview-qrcode"
        :src="qrcode"
        alt="二维码"
      >
      <a v-if="isAdmin && editUrl && !isFenxiao" :href="editUrl">
        重新编辑
      </a>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant';
import UA from 'zan-utils/browser/ua_browser';
import { getPCQrCode } from './api';
// TODO 获取invite qrcode
export default {
  name: 'app',

  data() {
    return {
      qrcode: '',
      isLoading: '',
      isAdmin: false,
    };
  },

  computed: {
    type() {
      return this.$route.name && this.$route.name.toLowerCase();
    },
    showQrcode() {
      return this.isPC && !this.isLoading;
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

  watch: {
    // 加入路由懒加载后，route信息获取会有迟滞，通过watch方式获取到route name后再执行后续操作
    type(val) {
      if (val) {
        let url;
        if (this.isPC) {
          url = `https://h5.youzan.com/wscvis/exam/detail?examId=${this.$route.query.examId}&kdtId=${window._global.kdt_id}`;
          this.isLoading = true;
          getPCQrCode(url)
            .then(
              res => {
                this.isLoading = false;
                this.qrcode = res.data;
              },
              err => {
                Toast.fail(err.msg);
              }
            );
        }
      }
    },
  },

  created() {},
};
</script>

<style lang="scss">// eslint-disable-line
@import 'var';

body {
  height: auto;
  overflow-x: hidden;
}

body::-webkit-scrollbar {
  display: none;
  overflow: hidden;
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
