<template>
  <div class="pc-cover-block">
    <img-wrap
      width="402px"
      height="228px"
      :src="picture.url"
      :cover="false"
      fullfill="!large.jpg"
      disable-lazyload
    />
  </div>
</template>

<script>
import { ImgWrap } from '@youzan/vis-ui';

export default {
  name: 'pc-cover-block',

  components: {
    ImgWrap,
  },

  rootState: ['goodsData'],
  rootGetters: ['pageWidth', 'isImageText'],

  computed: {
    picture() {
      return this.goodsData.pictures[0];
    },
  },
};
</script>
