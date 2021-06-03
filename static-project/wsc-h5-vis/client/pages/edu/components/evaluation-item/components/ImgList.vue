<template>
  <div
    v-if="list.length > 0"
    :class="['img-list', classSuffix ? `img-list${classSuffix}` : '']"
  >
    <div
      v-for="(url, $index) in list"
      :key="$index"
      :class="[
        'img-box',
        classSuffix ? `img-box${classSuffix}` : '',
        isPictureDisplayWrap & $index > 1 ? 'picture-wrap' : ''
      ]"
      @click.stop="onPreview($index)"
    >
      <img-wrap
        :width="imgConfig.width"
        :height="imgConfig.height"
        :src="url"
        :cover="false"
      />
    </div>
  </div>
</template>

<script>
import { ImagePreview } from 'vant';
import fullfillImage from 'zan-utils/fullfillImage';
import { ImgWrap } from '@youzan/vis-ui';

export default {
  name: 'img-list',

  components: {
    'img-wrap': ImgWrap,
  },

  props: {
    list: Array,
    mode: Number,
  },

  data() {
    return {
      imgs: [],
      classSuffix: '',
      imgConfig: {
        width: 'auto',
        height: 'auto',
      },
      isPictureDisplayWrap: false,
    };
  },

  computed: {

  },

  mounted() {
    this.initData();
  },

  methods: {
    initData() {
      this.imgs = this.getfullfillImages();
      this.formatClassName();
    },

    formatClassName() {
      const mode = this.mode || 0;
      const modeDict = ['--row', '--col', '--col-cover'];
      if (this.mode === 0) {
        // TODO
        this.imgConfig = {
          width: '70px',
          height: '70px',
        };
      }
      this.classSuffix = modeDict[mode];
      if (this.list.length === 4) {
        this.isPictureDisplayWrap = true;
      }
    },

    getfullfillImages(isPre) {
      const numDict = [480, 1000, 750];
      const num = isPre ? 1200 : numDict[this.mode];
      const str = `!${num}x${num}.jpg`;
      return this.list.map(url => fullfillImage(url, str));
    },

    onPreview(index) {
      ImagePreview({
        startPosition: index,
        images: this.getfullfillImages(true),
      });
    },
  },
};
</script>

<style lang="scss">
.img-list {
  padding: 12px 0 10px 32px;

  /* &--col {
    padding: 0 15px;
  } */

  &--col-cover {
    padding: 0 15px;
  }

  .img-box {
    &--row {
      display: inline-block;
      margin-right: 4px;
      margin-bottom: 4px;
      width: 70px;
      height: 70px;
    }

    &--col {
      width: 100%;
      padding-bottom: 16px;

      .img {
        width: 100%;
      }
    }

    &--col-cover {
      width: 100%;

      .img {
        width: 100%;
        height: 145px;
        object-fit: cover;
      }
    }
  }

  .imgWrap {
    border-radius: 4px;
  }
}
</style>
