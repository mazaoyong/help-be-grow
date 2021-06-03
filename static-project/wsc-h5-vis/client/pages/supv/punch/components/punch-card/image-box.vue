<template>
  <div class="punch-card__image-box">
    <ul>
      <li
        v-for="(item, index) in imageWithPlaceholder"
        :key="index"
        @click="showPicsPreview(item.imageNo)"
      >
        <img-wrap
          v-if="item.imageNo > -1"
          width="inherit"
          height="inherit"
          :src="item.src"
          :fullfill="'!160x0.jpg'"
          :cover="true"
        />
        <span v-else />
      </li>
    </ul>
  </div>
</template>
<script>
import { ImagePreview } from 'vant';
import { ImgWrap } from '@youzan/vis-ui';
import fullfillImage from '@youzan/utils/fullfillImage';

export default {
  name: 'image-box',
  components: {
    'img-wrap': ImgWrap,
  },
  props: {
    imageList: {
      type: Array,
      default: () => ([]),
    },
  },
  data() {
    return {
      isShowPicsPreview: false,
    };
  },
  computed: {
    imageListWithNewDomain() {
      return this.imageList.map(url => url.replace(/https?:\/\/img\.yzcdn\.cn/, _global.url.imgqn));
    },
    imageWithPlaceholder() {
      const imageSize = this.imageListWithNewDomain.length;
      /** @type {Array<{src: string; imageNo: number}>} */
      const currentImageList = this.imageListWithNewDomain.map((image, index) => ({
        src: image,
        imageNo: index,
      }));
      if (imageSize === 4) {
        const placeholder = [{ src: undefined, imageNo: -1 }];
        const prefixImages = currentImageList.slice(0, 2);
        const suffixImages = placeholder.concat(currentImageList.slice(-2));
        return prefixImages.concat(suffixImages);
      }
      return currentImageList;
    },
    filledImage() {
      return this.imageListWithNewDomain.map(o => {
        if (typeof o === 'string') {
          return fullfillImage(o, 'origin');
        }
      });
    },
  },
  methods: {
    showPicsPreview(index) {
      if (index >= 0) {
        this.isShowPicsPreview = true;
        ImagePreview({
          lazyLoad: true,
          images: this.imageListWithNewDomain,
          startPosition: index,
          onClose: () => {
            this.isShowPicsPreview = false;
          },
        });
      }
    },
  },
};
</script>
<style lang="scss">
.punch-card {
  &__image-box > ul {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;

    li {
      width: 80px;
      height: 80px;
      margin: 0 4px 4px 0;

      img {
        width: inherit !important;
        height: inherit !important;
      }
    }
  }
}
</style>
