<template>
  <van-swipe
    ref="image-swp"
    :style="{ height: height + 'px' }"
    :loop="loop"
    :autoplay="showGoodsVideo ? 0 : 3000"
    :show-indicators="showIndicator && goodsPictures.length > 0"
    @change="changeSwiperPage"
    class="swp"
  >
    <van-swipe-item
      v-for="(img, index) in goodsPictures"
      :key="`${index}-${img}`"
      class="swp__item"
    >
      <template v-if="index === 0">
        <img-wrap
          :src="img"
          :fullfill="'!750x0.jpg'"
          class="swp__img"
          disable-lazyload
        />
        <template v-if="showGoodsVideo">
          <span
            @click="onPlayClick"
            class="swp__play-video"
          >
            播放视频
          </span>
          <goods-video
            ref="video"
            :src="video.videoUrl"
            :cover="video.coverUrl | formatImage"
            :showplayer="showPlayer"
            @stop-swipe="val => loop = val"
            @change-show-player="val => showPlayer = val"
            @change-show-indicator="val => showIndicator = val"
          />
        </template>
      </template>
      <img-wrap
        v-else
        :src="img"
        :fullfill="'!750x0.jpg'"
        class="swp__img"
        disable-lazyload
      />
    </van-swipe-item>
    <div v-if="goodsPictures.length > 1" slot="indicator" class="swp__indicator">
      {{ currentSwpPage + 1 }}/{{ goodsPictures.length }}
    </div>
  </van-swipe>
</template>

<script>
import { Swipe, SwipeItem } from 'vant';
import { ajax, ImgWrap } from '@youzan/vis-ui';
import fullfillImage from 'zan-utils/fullfillImage';
import GoodsVideo from './goods-video.vue';

export default {
  name: 'image-swp',

  components: {
    'van-swipe': Swipe,
    'van-swipe-item': SwipeItem,
    'goods-video': GoodsVideo,
    'img-wrap': ImgWrap,
  },

  filters: {
    formatImage: function(src, ext) {
      return fullfillImage(src, ext || '!750x0.jpg');
    },
  },

  props: {
    video: {
      type: Object,
      default: () => {
        return {};
      },
    },
    goodsPictures: {
      type: Array,
      default: () => {
        return [];
      },
    },
    goodsPictureRatio: {
      type: Number,
      default: 1,
    },
  },

  data() {
    return {
      height: 320,
      // 是否自动轮播
      loop: true,
      // 是否显示视频播放控制条
      showPlayer: false,
      // 是否显示轮播数目提示
      showIndicator: true,
      // 当前swp页
      currentSwpPage: 0,
      // 视频播放统计标志
      videoPaidCountFlag: false,
      showGoodsVideo: !!this.video.videoUrl,
    };
  },

  mounted() {
    // 如果屏幕宽度大于320，根据宽度再重新计算一次高度
    const swpElement = this.$refs['image-swp'];
    const { width } = swpElement.$el.getBoundingClientRect();
    this.height = Math.ceil(width * this.goodsPictureRatio);
  },

  methods: {
    // 点击播放按钮
    onPlayClick() {
      // 流量计费统计
      if (!this.videoPaidCountFlag) {
        this.videoPaidCountFlag = true;
        ajax({
          url: this.video.videoUrl,
          method: 'GET',
        });
      }
      this.showPlayer = true;
      this.$refs.video[0].playVideo();
    },

    changeSwiperPage(newPageIndex) {
      if (this.showGoodsVideo) {
        // 视频在swiper中被切换走时，暂停播放
        const isBackVideo = newPageIndex === 0;
        const isLeaveVideo = this.currentSwpPage === 0;
        if (isBackVideo || isLeaveVideo) {
          this.$refs.video[0].toggleVideoPlay(isBackVideo);
        }
      }
      this.currentSwpPage = newPageIndex;
    },
  },
};
</script>

<style lang="scss">
.swp {
  text-align: center;

  &__item {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__img {
    display: inline;
    max-width: 100%;
  }

  &__play-video {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 55px;
    height: 55px;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG4AAABuCAMAAADxhdbJAAAAulBMVEUAAAAAAAAAAAAAAAAAAAAAAACBgYEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+/v5iYmIrKysaGhoQEBAAAAAAAAAAAADs7OzHx8f6+vr09PTw8PC0tLSZmZl0dHRERET39/fj4+Pb29vX19fR0dG9vb2hoaH7+/vo6Ojm5uavr6+FhYVUVFRQUFD///9wIZ9UAAAAPXRSTlNmAF9dYWOSTkwSBVgbAkgOLAk7HTUMOQtTPiUkRRT8hHFsakIxGeS/9+/psZ6MefHb0s7Ht6P539ytlH99tx4IiAAABA5JREFUaN7Nmuda2zAUhiVZjkfsONOGLEaStkAppUC37/+2KiDmBNdJ9EnO+P4wnthvzpKPpcM4okGv3W15J03huqJ54rW67d6AI9LGhVHfc1mFXK8fxfXisjmhKpH+PKsLFw59piF/GNaAC04l05Q8DSxxwbjKdVIoySr3jgML3KRV4jiOI1YorlD/KFFbE0Nc2C2h5BoflpDd0AQ3dFZZgm2UWCU6Qxg38Mr3qlb1N/IGGK4nCCaYpsTKRT0AF6eVMAiYxrq4jkdZwEBRPnkdPVzSLK7AYOWLmokObiIK0wQzkpDFL5PtuEhuMA00UEbbcJFLl9jz3GgzbiKL5YlZqVjq5GQTLhEUNjtJueQm63GdJn22Ll6zsw4Xe8tPuqwGuUueF6/BpYBtgH1pNa5H36oOkZd6VbiBWAaX1abijoMKnA/UG1h//v+4IUCDecMyLnSApITT0wlLuC4SODx83fe4CeZK3J3BO1zr1fS6WXTT1iouwI3DzSPcGA0cHr4Z4RK2exxL3nCnOA3nnRa4UO4DJ8MlbgjQLHjDJc4H0tIiOf1XXIcBRXdhXnose8G19Y27+DB9uDA2b/6C8/VDd5vn+fWtafD8Z1zs6ruykStNHy/N3OnGCheRuVo4pR9/zbwZKVwfx+Xfn4xwfYXzyLu6OKX7c4PgeQonmZJkIC6/+w3QlgCXswHREZzSxwvUPAWjTEFx+fUZGrwea8M40vQGwylY18CZpK9fEGcqGHUpAI706TPUsTCPkQAc6RtQEh47ITaEI101dM1TsCaVHYqjkrjUKzwFc2rA5R/O9HCi+GGHy6dPWqkpLXGkcy2cnTNJd5c6znTsUoWC90cvVWwKgfR4qVkIFmVOhXerXebGixjp4RxYxPAlGl80aYk2fQDRIwF7AEU2uOkvsBUzah5o7YKbBy7hVKGVGexr5VvjJ2HcVQNtxJiHt7X0VDVraxcYjtIfxy0ULi6CB+B+UvojoYvBF64G9XsmL1zo62QD62bLRY6+LJ+hvfq7W3fgrYCb+4btVgAf7WejY7TnbZz9blIdaguOz3aPmx1u+5SPsX12fK99zFdxwX63vnm64439wx5b8NEuD2VGhz5y4tnuDtSywx8Xct4HeACtv+WoV9R81HscB9mcJ049/iRPOsmmIYRA1DuEIIJjGrHgfCGKS1zjJCloIto+HhM4dY3HOAE4/ONamMaayTGONql679sPbvXjYx1LU8p8m6E7P4NHCkercds+Urj64ZHRwGRqNjCZ4gOT1bOnrqBxUPq7PH9qM+w6q3y0SCFkZRc1CyxHeRNklDepY1B51NKBtUZhXWPYnbYvN9rltzv1DpnHi7kvq1HzBTBkjiiL2unzCL0jpfM8Qp+2o4wj+gfblKJxDtrlbwAAAABJRU5ErkJggg==);
    background-size: 55px 55px;
    transform: translate(-50%, -50%);
    text-indent: -999px;
  }

  &__indicator {
    position: absolute;
    padding: 0.3rem 0.5rem;
    border-radius: 1rem;
    font-size: 10px;
    transform: scale(.83);
    transform-origin: right bottom;
    right: 15px;
    bottom: 15px;
    color: #fff;
    background-color: #000000;
    opacity: .5;
  }
}
</style>
