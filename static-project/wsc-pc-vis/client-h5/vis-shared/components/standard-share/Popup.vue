<template>
  <div>
    <vis-standard-popup
      v-model="value"
      title="立即分享给好友"
      :buttons="buttons"
      class="share-button-popup"
      v-on="proxyListeners"
    >
      <share-button
        class="share-button-popup__button"
        :copy-link="copyLink"
        :share="onShare"
        :button-option="buttonOption"
        flex="flex-start"
      />
    </vis-standard-popup>
  </div>
</template>

<script>
import { Popup } from '@youzan/vis-ui';
import { Toast } from 'vant';
import Button from './index.vue';
import Clipboard from 'clipboard';
import OpenShareMask from './share-wechat/main';
import OpenPoster from './share-poster/main';
export default {
  components: {
    'vis-standard-popup': Popup,
    'share-button': Button,
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    proxyListeners: {
      type: Object,
      default: () => ({}),
    },
    copyLink: {
      type: String,
      default: '',
    },
    getPoster: {
      type: Function,
      default: () => {},
    },
    buttonOption: {
      type: Array,
      default: () => ['wechat', 'poster', 'link'],
    },
  },

  computed: {
    buttons() {
      return [
        {
          text: '取消',
          onClick: ctx => {
            this.closePopup();
          },
        },
      ];
    },
  },

  created() {
    const idx = this.buttonOption.findIndex(type => type === 'poster');
    if (idx !== -1) {
      this.getPoster().then(url => {
        this.posterUrl = url;
      });
    }
  },

  methods: {
    onShare(type) {
      this.$emit('share', type);
      if (type === 'wechat') {
        OpenShareMask();
        this.closePopup();
      } else if (type === 'poster') {
        OpenPoster({
          props: {
            getPoster: this.getPoster,
          },
        });
        this.closePopup();
      } else if (type === 'link') {
        const clipboard = new Clipboard('.js_link-button');
        clipboard.on('success', e => {
          Toast('复制成功');
          // 释放内存
          clipboard.destroy();
        });
        clipboard.on('error', e => {
          // 不支持复制
          Toast('复制失败，请选择其他分享方式~');
          // 释放内存
          clipboard.destroy();
        });
        this.closePopup();
      }
    },

    closePopup() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss">
  .share-button-popup {
    .vis-standard-popup__content {
      min-height: auto !important;
    }

    &__button {
      margin-top: 8px;
      margin-bottom: 16px;
    }
  }

  .is-iphonex .vis-standard-popup__buttons {
    margin-bottom: 8px;
  }
</style>
