<template>
  <div class="text-container">
    <div
      :class="containerClass"
      @click="handleReply">
      <p class="text__detail">
        <i v-if="item.fromMsg.msgCat === 1" class="text__icon" />
        <pre class="text__detail-pre" v-html="parsedLinkContent" />
      </p>
    </div>
  </div>
</template>

<script>

import { linkify } from '../utils/index.js';
import escape from 'zan-utils/string/escape';

export default {

  name: 'chat-item-text',

  components: {
  },

  props: {
    content: String,
    isReply: {
      type: Boolean,
      default: false,
    },
    item: Object,
    position: {
      type: String,
      default: 'left',
      validator(value) {
        return ['left', 'right'].indexOf(value) > -1;
      },
    },
  },

  data() {
    return {
    };
  },

  computed: {
    containerClass() {
      return {
        text: true,
        clearfix: true,
        'text--reply': this.isReply,
        'text--right': this.position === 'right',
      };
    },
    parsedLinkContent() {
      const currUserInputParseLink = linkify(escape(this.content));
      return currUserInputParseLink;
    },
  },

  created() {

  },

  mounted() {
  },

  methods: {
    handleReply() {
      const uid = this.item.fromMsg.wxUid;
      if (!this.isReply && (window._global.verify_weixin_openid || '') !== uid) {
        this.$listeners.reply(this.item);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .text-container {
    display: block;
    overflow: hidden;
  }

  .text {
    max-width: 216px;
    padding: 8px 10px;
    background-color: #fff;
    border-radius: 2px;
    box-sizing: border-box;
    float: left;

    &.text--reply {
      padding: 0;
    }

    &.text--right {
      float: right;
    }

    .text__detail {
      line-height: 20px;
      color: #333;
      font-size: 14px;
      word-break: break-word;

      ::v-deep a {
        color: #38f;
      }
    }

    .text__detail-pre {
      white-space: pre-wrap;
      word-wrap: break-word;
      display: inline;
    }

    .text__icon {
      display: inline-block;
      width: 14px;
      height: 14px;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAmVJREFUSA1jZAACz/0MMn/+MHQBmQ7/GRgkQWLUAowMDM+BZh1gYWEo2+7I8IQRatlFoEVC1LIEmzlAi98BLdVnAvmM1paBHACyA2QXE5DtABKgE3Bgonac4XM4yC6QD3ECJkYWBhuxYAZWRnacakiVYMGnQZlHn6FGZwXD2scTGGbfLgUrBTlCnlsLnzaw3KOv1xn+/v+NoQ6vhbc/n2VY9qCNIVqxhuH4600MVz4cZhBgFWWYZXERwyB0gegj8gyvfjxCF2ZgdNkNSkCYgJmRFejCPwxMjMwMk01PMPCyCDKkndRn+P3vJ4MarzGmBqiIobALQ6JyMwMuC7H6UIxDjmGpzUOGlssRDAdfrmTovBrH4CGVxMAMDM4f/78wXP90AqeFYpzyOOVAElgtRNfx6Os1hlm3S9CFyeITZSHIZAFWMQZOFl6slnz985Hh0+83WOXQBYm2MF2tl8FFMgZdP5i/9tEEhhm3CrHKoQsSbSFI47Nvdxm6ryWimNGotx6FT4hDkoU//n4FZw1kQ3///4XMJcjGW9IQ1E2GguFvIUlxqMSrx7DbBWvBRHTgEm3htqezGS6824fV4Adfr2IVxyZItIWXPxxiAGFKAdUTDT+rCNhNf/5hVk0gCaJ9iM9nJkLuDHLcmgysTOwM3jLpDPe/XGZ49wvUWMMEVLFQmEOaIVi+kOHf/38MNz6eZNj4ZAqmTVARRtfdDM9AbQ10FbD6ENzeQpckkw9qo4Li8AA2/ZDmAWVZAIu5B5hALWJQIxWLJFWFoA3hMiZQ8xvUIgYKLAd5maq2AA0DmQkyG2QHyC4AnHmtVnOUGDEAAAAASUVORK5CYII=) no-repeat;
      background-size: cover;
      vertical-align: sub;
      margin-right: 3px;
    }
  }
</style>
