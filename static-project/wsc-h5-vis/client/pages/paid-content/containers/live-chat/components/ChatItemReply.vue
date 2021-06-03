<template>
  <div>
    <div
      v-if="isReply"
      class="reply">
      <div class="question">
        <p class="question__text">
          <i v-if="item.toMsg.msgCat === 1" class="question__icon" />
          <span class="question__username">
            {{ name }}：
          </span>
          <pre class="question__detail" v-html="content" />
        </p>
      </div>
      <slot />
    </div>
    <template v-else>
      <slot />
    </template>
  </div>
</template>

<script>
import get from 'lodash/get';
import { linkify } from '../utils/index.js';
import escape from 'zan-utils/string/escape';

export default {

  props: {
    isReply: Boolean,
    item: Object,
  },

  data() {
    return {
    };
  },

  computed: {
    name() {
      return get(this, 'item.toMsg.nickname');
    },
    content() {
      return linkify(escape(get(this, 'item.toMsg.content')));
    },
  },
};
</script>

<style lang="scss" scoped>
  .reply {
    box-sizing: border-box;
    max-width: 216px;
    background-color: #fff;
    border-radius: 2px;
    padding: 10px;

    .question {
      border-bottom: 1px solid #e5e5e5;
      margin-bottom: 8px;

      &__text {
        line-height: 18px;
        font-size: 12px;
        margin-bottom: 6px;
        word-break: break-word;

        ::v-deep a {
          color: #38f;
        }
      }

      &__detail {
        white-space: pre-wrap;
        word-wrap: break-word;
        display: inline;
      }

      &__icon {
        display: inline-block;
        width: 14px;
        height: 14px;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAmVJREFUSA1jZAACz/0MMn/+MHQBmQ7/GRgkQWLUAowMDM+BZh1gYWEo2+7I8IQRatlFoEVC1LIEmzlAi98BLdVnAvmM1paBHACyA2QXE5DtABKgE3Bgonac4XM4yC6QD3ECJkYWBhuxYAZWRnacakiVYMGnQZlHn6FGZwXD2scTGGbfLgUrBTlCnlsLnzaw3KOv1xn+/v+NoQ6vhbc/n2VY9qCNIVqxhuH4600MVz4cZhBgFWWYZXERwyB0gegj8gyvfjxCF2ZgdNkNSkCYgJmRFejCPwxMjMwMk01PMPCyCDKkndRn+P3vJ4MarzGmBqiIobALQ6JyMwMuC7H6UIxDjmGpzUOGlssRDAdfrmTovBrH4CGVxMAMDM4f/78wXP90AqeFYpzyOOVAElgtRNfx6Os1hlm3S9CFyeITZSHIZAFWMQZOFl6slnz985Hh0+83WOXQBYm2MF2tl8FFMgZdP5i/9tEEhhm3CrHKoQsSbSFI47Nvdxm6ryWimNGotx6FT4hDkoU//n4FZw1kQ3///4XMJcjGW9IQ1E2GguFvIUlxqMSrx7DbBWvBRHTgEm3htqezGS6824fV4Adfr2IVxyZItIWXPxxiAGFKAdUTDT+rCNhNf/5hVk0gCaJ9iM9nJkLuDHLcmgysTOwM3jLpDPe/XGZ49wvUWMMEVLFQmEOaIVi+kOHf/38MNz6eZNj4ZAqmTVARRtfdDM9AbQ10FbD6ENzeQpckkw9qo4Li8AA2/ZDmAWVZAIu5B5hALWJQIxWLJFWFoA3hMiZQ8xvUIgYKLAd5maq2AA0DmQkyG2QHyC4AnHmtVnOUGDEAAAAASUVORK5CYII=) no-repeat;
        background-size: cover;
        vertical-align: sub;
        margin-right: 3px;
      }

      &__username {
        color: #999;
      }
    }
  }
</style>
