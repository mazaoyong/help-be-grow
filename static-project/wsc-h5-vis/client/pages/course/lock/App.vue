<!-- Copy from paid-content/containers/lock -->
<template>
  <div class="lock">
    <div class="lock-header">
      <i class="lock-header-icon" />
      <div>已停止访问该网页</div>
      <div>该页面涉及违规信息，已停止访问</div>
    </div>
    <div class="lock-footer">
      <a class="js-im-icon" @click="onOpenImClick">
        联系客服
      </a>
      <a
        v-show="!isMobile"
        class="lock-footer-copy"
        :data-clipboard-text="telHref"
      >拨打电话</a>
      <a v-show="isMobile" v-if="telHref" :href="'tel:' + telHref">
        拨打电话
      </a>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant';
import Bot from '@youzan/im-base-pure/lib/core/Bot';
import queryString from 'zan-utils/url/queryString';
import imUtils from '@youzan/im-base-pure/lib/helpers/utils';
import Clipboard from 'clipboard';
import UA from 'zan-utils/browser/ua_browser';
import { getPhoneApi } from '../../../common-api/activity';

const isMobile = UA.isMobile();

export default {
  name: 'lock',

  data() {
    return {
      areaCode: '',
      mobileNumber: '',
      phoneNumber: '',
      isMobile,
    };
  },

  computed: {
    telHref() {
      const prefix = (this.areaCode && (this.areaCode + '-')) || '';
      const phone = this.mobileNumber || this.phoneNumber || '';
      return phone ? prefix + phone : '';
    },
  },

  created() {
    // title
    const search = queryString.parse(window.location.search) || {};
    document.title = search.title || '知识付费商品';
    // phone
    getPhoneApi().then(({ data }) => {
      this.areaCode = data.areaCode;
      this.mobileNumber = data.mobileNumber;
      this.phoneNumber = data.phoneNumber;
    });
    // bot
    this.initBot();
  },

  mounted() {
    // add copy
    const clipboard = new Clipboard('.lock-footer-copy');
    clipboard.on('success', e => {
      Toast('复制成功');
      // 释放内存
      clipboard.destroy();
    });
  },

  methods: {
    initBot() {
      // chat
      const channel = imUtils.getChannel();
      this.bot = Bot.getInstance({
        config: {
          origin: window.location.origin,
          version: 2,
          channel,
        },
      });
    },

    onOpenImClick(event) {
      event.preventDefault();
      this.bot.trigger('im:show');
    },
  },
};
</script>

<style lang="scss" scoped>
.lock {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  background-color: #f8f8f8;

  .lock-header-icon {
    display: inline-block;
    width: 80px;
    height: 80px;
    margin-bottom: 17px;
    background: url(//img01.yzcdn.cn/public_files/2018/06/13/8dd7d711ca79ff79956a5fb5938b037d.png);
    background-size: 100% 100%;
  }

  .lock-header {
    margin-top: 96px;
    font-size: 12px;

    div {
      margin-top: 20px;

      &:nth-last-child(1) {
        color: #9b9b9b;
      }
    }
  }

  .lock-footer {
    padding-bottom: 30px;
    font-size: 12px;

    a {
      padding: 10px 0;
      line-height: 1;
      color: #38f;

      &:first-child {
        &::after {
          display: inline-block;
          margin: 0 6px;
          font-size: 12px;
          content: '|';
        }
      }
    }
  }
}
</style>
