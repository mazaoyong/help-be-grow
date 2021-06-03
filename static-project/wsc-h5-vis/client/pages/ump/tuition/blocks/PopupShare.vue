<template>
  <div
    :data-clipboard-text="shareLink"
    class="tuition-share-link"
  >
    <!-- 分享弹窗 -->
    <multi-share-pop
      v-model="isPopupShareVisible"
      :share-options="shareOptions"
      title="立即分享给好友"
      @link="clickProxy('link')"
      @poster="clickProxy('poster')"
      @wechat="clickProxy('wechat')"
    />
    <share-mask
      :value="showWechatMask"
      @close="showWechatMask = false"
    />

    <van-popup v-model="showPoster" class="block-poster">
      <main>
        <img-wrap
          v-if="posterUrl"
          :src="posterUrl"
          width="300px"
        />

        <van-loading v-else />

        <van-icon
          name="close"
          color="#fff"
          size="24"
          @click="showPoster = false"
        />
      </main>

      <div class="block-poster__tip">
        长按保存海报，发送给好友
      </div>
    </van-popup>
  </div>
</template>
<script>
import Vue from 'vue';
import MultiSharePop from '@/components/multi-share-pop';
import ShareMask from '@/components/share-mask';

import { Popup as VanPopup, Loading as VanLoading, Icon as VanIcon, Toast } from 'vant';

import { ImgWrap } from '@youzan/vis-ui';

import Clipboard from 'clipboard';

export default Vue.extend({
  name: 'popup-share',
  components: {
    MultiSharePop,
    ShareMask,
    VanPopup,
    VanLoading,
    VanIcon,
    ImgWrap,
  },

  data() {
    return {
      showWechatMask: false,
      showPoster: false,
      shareOptions: [
        {
          text: '微信好友',
          type: 'wechat',
          icon: 'https://img01.yzcdn.cn/upload_files/2020/10/23/FqZex0OSw_XVPd0yzie03PoznXn-.png',
        },
        {
          icon: 'https://b.yzcdn.cn/public_files/65528042e15720b9c3f97b034d1cecd5.svg',
          text: '分享海报',
          type: 'poster',
        },
        {
          icon: 'https://b.yzcdn.cn/public_files/7e6518ab83c0f2848efbce6f611d6948.png',
          text: '复制链接',
          type: 'link',
        },
      ],
    };
  },

  computed: {

    isPopupShareVisible: {
      get() {
        return this.$store.state.isPopupShareVisible;
      },
      set(value) {
        this.$store.commit('setPopupShareVisible', value);
      },
    },

    shareLink() {
      const _shareLink = this.$store.getters.shareLink('link');
      // 设置分享链接的数据
      this.$track.collect('share:url', _shareLink);
      return _shareLink;
    },

    posterUrl() {
      return this.$store.state.posterUrl;
    },
  },

  methods: {
    clickProxy(type) {
      switch (type) {
        case 'link':
          this.onClickLink();
          break;
        case 'poster':
          this.onClickPoster();
          break;
        case 'wechat':
          this.onClickWechat();
          break;
        default: return void 0;
      }
      this.$track.runTask('shareTuition', /** 交互事件 */8);
    },
    onClickWechat() {
      this.showWechatMask = true;
      this.$track.collect('share:type', 'wechat');
    },
    onClickPoster() {
      this.showPoster = true;
      this.$track.collect('share:type', 'poster');
    },
    onClickLink() {
      const clipboard = new Clipboard('.tuition-share-link');

      clipboard.on('success', () => {
        Toast('复制链接成功');
        // 释放内存
        clipboard.destroy();
      });
      clipboard.on('error', e => {
        // 不支持复制
        Toast('复制失败，请直接点击右上角分享给朋友');
        // 释放内存
        clipboard.destroy();
      });
      this.$track.collect('share:type', 'link');
    },
  },

});
</script>
<style lang="scss" scoped>

.block-poster {
  overflow: hidden;
  background: transparent;
  user-select: none;

  main {
    display: flex;
    width: 300px;
    min-height: 506px;
    align-items: center;
    justify-content: center;
  }

  .imgWrap {
    overflow: hidden;
    border-radius: 8px;
  }

  &__tip {
    margin-top: 12px;
    font-size: 16px;
    color: #fff;
    text-align: center;
  }

  .van-icon-close {
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
