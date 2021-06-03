<template>
  <div
    id="app-content"
    :class="mediaClass"
  >
    <router-view @type="onTypeChange" />
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
import UA from 'zan-utils/browser/ua_browser';
import Args from 'zan-utils/url/args';
import apis from './api';
import Bus from 'pct/utils/bus';

export default {
  name: 'app',

  data() {
    const isAdmin =
      window._global.paidcontent && window._global.paidcontent.is_admin;
    return {
      qrcode: '',
      isLoading: '',
      isAdmin: !!isAdmin,
      isInviteCall: false,
      isFenxiao: false,
      contentType: -1,
    };
  },

  computed: {
    type() {
      return this.$route.name && this.$route.name.toLowerCase();
    },
    alias() {
      return this.$route.query.alias;
    },
    zanAlias() {
      return Args.get('zanAlias');
    },
    editUrl() {
      const editMap = {
        columnshow: 'column',
        contentshow: 'content',
        vipbenefit: 'benefit',
      };
      const type = editMap[this.type];
      if (!type) return '';

      // 后台权益编辑页面url不规范，特殊处理一下
      if (type === editMap.vipbenefit) {
        return (
          `${window._global.url.base}/v4/vis/pct/page/benefit#/edit/${this.alias}`
        );
      }
      const contentTypeText = [
        '',
        'text',
        'audio',
        'video',
      ];
      if (type === editMap.contentshow) {
        return `${window._global.url.base}/v4/vis/pct/page/content#/edit/${contentTypeText[this.contentType]}?alias=${this.alias}`;
      }

      return `${window._global.url.base}/v4/vis/pct/page/column#/edit/?alias=${this.alias}`;
    },
    showQrcode() {
      return this.isPC && !this.isLoading && !this.zanAlias && !this.$route.meta.hideQrcode;
    },
    isPC() {
      return !UA.isMobile() || this.$root.showPCMode;
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
      // console.log(val);
      if (val && !this.isInviteCall) {
        let url;
        if (this.alias) {
          url = `${window._global.url.wap}/ump/paidcontent?kdt_id=${
            window._global.kdt_id
          }&page=${this.type}&alias=${this.alias}#/${this.type}?alias=${
            this.alias
          }`;
        } else {
          url = `${window._global.url.wap}/ump/paidcontent?kdt_id=${
            window._global.kdt_id
          }&page=${this.type}#/${this.type}`;
        }
        this.isLoading = true;
        apis.getInviteData(
          {
            url: url,
            isShortenUrl: true,
          },
          true
        ).then(
          data => {
            this.isLoading = false;
            this.qrcode = data;
          }
        );
      }
    },
  },

  created() {
    // 专栏才会走判断分销的逻辑
    Bus.$on('columnType', (val) => {
      console.log('val', val);
      this.isFenxiao = +val === 1 && this.type === 'columnshow';
    });
  },

  methods: {
    onTypeChange(type) {
      this.contentType = type;
    },
  },
};
</script>

<style lang="scss">
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
