<template>
  <!-- 分享弹窗 -->
  <div class="share-popup">
    <van-actionsheet
      v-model="show"
      description="选择邀请方式"
      cancel-text="取消"
    >
      <div class="share-popup__list">
        <div
          v-for="(item, index) in shareConfig"
          :key="index"
          :data-clipboard-text="item.copyText"
          :class="{ 'js-share-copy': item.type === 'copy' }"
          class="share-popup__item"
          @click="handleClick(item)"
        >
          <img
            class="share-popup__item-icon"
            :src="item.icon"
            :alt="item.text"
          >
          <div class="share-popup__item-text">
            {{ item.text }}
          </div>
        </div>
      </div>
    </van-actionsheet>
  </div>
</template>
<script>
import { ActionSheet, Toast } from 'vant';

import Clipboard from 'clipboard';

export default {
  name: 'share-popup',

  components: {
    'van-actionsheet': ActionSheet,
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },

    shareLink: {
      type: String,
      required: true,
    },

  },

  data() {
    return {
      shareConfig: [
        {
          type: 'copy',
          icon: 'https://b.yzcdn.cn/public_files/2019/07/16/db4045f6c5a63b75150884b2906c865b.png',
          text: '复制邀请链接',
          copyText: '',
        },
        {
          type: 'poster',
          icon: 'https://b.yzcdn.cn/public_files/2020/01/10/shareposter.png',
          text: '生成邀请海报',
        },
      ],
    };
  },

  computed: {
    show: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },

  watch: {
    shareLink(url) {
      let copyConfig = this.shareConfig[0];
      copyConfig.copyText = url;
      this.$set(this.shareConfig, 0, copyConfig);
    },
  },

  methods: {
    handleClick(item) {
      if (item.type === 'copy') {
        if (Clipboard.isSupported()) {
          const clipboard = new Clipboard('.js-share-copy');
          clipboard.on('success', () => {
            Toast('复制成功');
            this.show = false;
            clipboard.destroy();
          });
          clipboard.on('error', () => {
            Toast('复制失败');
            clipboard.destroy();
          });
        } else {
          Toast('复制失败');
        }
        this.$emit('log-click');
      } else {
        // 海报
        this.show = false;
        this.$emit('show-poster');
      }
    },
  },
};
</script>
<style lang="scss">
@import "mixins/index.scss";
.share-popup {
  &__list {
    display: flex;
    padding: 24px 42px;
    align-items: center;
  }

  &__item {
    flex: 1;
    text-align: center;

    img {
      width: 44px;
      height: 44px;
    }

    &-text {
      margin-top: 8px;
      font-size: 12px;
      color: #646566;
    }
  }
}
</style>
