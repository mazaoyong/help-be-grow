<template>
  <img-wrap
    class="no-data"
    :width="`${width}px`"
    :height="`${height}px`"
    :fullfill="`!origin.png`"
    disable-lazyload
    src="https://b.yzcdn.cn/wsc-h5-vis/course/detail/no-data.png"
  />
</template>

<script>
import { ImgWrap } from '@youzan/vis-ui';

export default {
  components: {
    ImgWrap,
  },

  props: {
    width: {
      type: Number,
      default: 80,
    },
    height: {
      type: Number,
      default: 80,
    },
  },
};
</script>

<style lang="scss" scoped>
.no-data {
  margin: 0 auto;
}
</style>
