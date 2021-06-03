<template>
  <van-swipe
    ref="image-swipe"
    :height="height"
    :loop="loop"
    :autoplay="hasVideo ? 0 : 3000"
    :show-indicators="showIndicator && picturesWithVideo.length > 0"
    class="swp"
    @change="changeSwiperPage"
  >
    <van-swipe-item
      v-for="(img, index) in picturesWithVideo"
      :key="img.id"
      class="swp__item"
      @click="previewImage(index)"
    >
      <template v-if="index === 0">
        <img-wrap
          :src="fullfillImage(img.url)"
          :cover="false"
          class="swp__img"
          width="100%"
          height="100%"
          disable-lazyload
        />
        <template v-if="hasVideo">
          <span class="swp__play-video" @click="onPlayClick"></span>
          <goods-video
            ref="video"
            :src="video.videoUrl"
            :cover="fullfillImage(video.coverUrl)"
            :showplayer="showPlayer"
            @stop-swipe="val = (loop = val)"
            @change-show-player="val = (showPlayer = val)"
            @change-show-indicator="val = (showIndicator = val)"
          />
        </template>
      </template>
      <img-wrap
        v-else
        :src="fullfillImage(img.url)"
        :cover="false"
        class="swp__img"
        width="100%"
        height="100%"
        disable-lazyload
      />
    </van-swipe-item>
    <mini-font-tag
      v-if="picturesWithVideo.length > 1"
      slot="indicator"
      class="swp__indicator"
      height="16px"
      background-color="rgba(0, 0, 0, .5)"
      :text="`${ current + 1 }/${ picturesWithVideo.length }`"
    />
  </van-swipe>
</template>

<script>
import { Swipe, SwipeItem, ImagePreview } from 'vant';
import { ajax, ImgWrap } from '@youzan/vis-ui';
import fullfillImage from '@youzan/utils/fullfillImage';
import rootStore from '@/pages/course/detail/store';
import MiniFontTag from '@/components/mini-font-tag';
import GoodsVideo from './components/goods-video';
import storeName from './name';
import store from './store';

rootStore.registerModule(storeName, store);

export default {
  storeName,

  components: {
    'van-swipe': Swipe,
    'van-swipe-item': SwipeItem,
    ImgWrap,
    GoodsVideo,
    MiniFontTag,
  },

  data() {
    return {
      loop: true,

      height: 320,

      current: 0,

      showIndicator: true,

      showPlayer: false,

      videoPaidCountFlag: true,
    };
  },

  rootState: ['env'],
  getters: ['video', 'hasVideo', 'picturesWithVideo', 'maxPictureRatio'],

  mounted() {
    const swpElement = this.$refs['image-swipe'];
    const { width } = swpElement.$el.getBoundingClientRect();
    this.height = Math.floor(width * this.maxPictureRatio);
  },

  methods: {
    fullfillImage(src) {
      return fullfillImage(src, '!750x0.jpg');
    },

    previewImage(index) {
      // PC preview 时，不要review
      if (!this.env.isMobile) return;
      let startPosition = +index;
      let previewImages = this.picturesWithVideo;
      if (this.hasVideo) {
        if (+index === 0) {
          // 视频不支持预览
          return;
        }
        previewImages = this.picturesWithVideo.slice(1);
        startPosition = Math.max(0, index - 1);
      }
      ImagePreview({
        images: previewImages.map(image => image.url),
        startPosition,
      });
    },

    changeSwiperPage(index) {
      if (this.hasVideo) {
        // 视频在swiper中被切换走时，暂停播放
        const isBackVideo = index === 0;
        const isLeaveVideo = this.current === 0;
        if (isBackVideo || isLeaveVideo) {
          this.$refs.video[0].toggleVideoPlay(isBackVideo);
        }
      }
      this.current = index;
    },

    onPlayClick() {
      // 流量计费统计
      if (!this.videoPaidCountFlag) {
        this.videoPaidCountFlag = true;
        ajax({
          url: this.video.countPlayedUrl,
          method: 'GET',
        });
      }
      this.showPlayer = true;
      this.$refs.video[0].playVideo();
    },
  },
};
</script>

<style lang="scss"> // eslint-disable-line vue-scoped-css/require-scoped
@import 'mixins/index.scss';

.swp {
  position: relative;
  display: block;
  width: 100%;
  padding: 0;
  margin: 0;
  background-color: $background-color;

  &__item {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__img {
    display: flex;
    align-items: center;
    max-width: 100%;
    max-height: 100%;
    min-width: 50%;
    min-height: 50%;
  }

  &__play-video {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 103px;
    height: 44px;
    background-image: url('https://img01.yzcdn.cn/public_files/a3d95760462585b1e0c786a69d2e3571.png');
    background-repeat: no-repeat;
    transform: translate(-50%, -50%);
  }

  &__indicator {
    position: absolute;
    right: 15px;
    bottom: 15px;
  }
}

// ImgWrap 引用了 vant 的Image，由于样式引用机制不同，会有样式覆盖问题。。。
.van-image-preview__image {
  position: absolute !important;
}
</style>
