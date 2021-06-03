<template>
  <audio-player v-if="isAudio" />
  <video-player v-else-if="isVideo" />
  <image-player v-else />
</template>

<script>
import rootStore from '@/pages/course/detail/store';
import Image from './components/image';
import Audio from './components/audio';
import Video from './components/video';
import storeName from './name';
import store from './store';

rootStore.registerModule(storeName, store);

export default {
  storeName,

  components: {
    'image-player': Image,
    'audio-player': Audio,
    'video-player': Video,
  },

  watch: {
    'goodsData.alias'() {
      this.$dispatch('reset');
    },

    url: {
      immediate: true,
      handler(url) {
        // 监控音视频资源为空的情况
        if ((this.isAudio || this.isVideo) &&
          this.goodsData.isOwnAsset && !this.lock && !url && (
          // 非微信环境，需要判断是否开启了仅微信环境访问
          this.env.isWeixin || !this.goodsData.mediaUrlSwitch
        )) {
          try {
            window.yzStackLog &&
            window.yzStackLog.log({
              name: 'empty-resource-exception',
              message: '知识付费音视频内容空资源异常',
              level: 'error',
              extra: {
                alias: this.goodsData.alias,
              },
            }) &&
            window.yzStackLog.monitor({
              extra: {
                name: 'empty-resource-exception',
              },
            });
          } catch (err) {}
        }
      },
    },
  },

  getters: ['url', 'lock'],
  rootState: ['goodsData', 'env'],
  rootGetters: ['isAudio', 'isVideo'],
};
</script>
