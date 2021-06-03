<template>
  <div
    :class="[prefix]"
    :style="{
      width: width,
      height: height,
    }"
  >
    <template>
      <img v-if="!cover" :src="src" :class="[`${prefix}__bg`]" />
      <img
        ref="imgDom"
        :src="src"
        :class="[`${prefix}__img`]"
        :alt="alt"
        :style="{
          'object-fit': cover ? 'cover' : 'contain',
        }"
      />
    </template>
  </div>
</template>

<script>
// 默认占位图
const defaultImg =
  'https://img01.yzcdn.cn/public_files/2018/01/30/585dae8447d80013ef9344adc973c6ee.png?imageView2/2/w/730/h/0/q/75/format/webp';

export default {
  name: 'img-wrap',

  props: {
    width: {
      type: String,
      default: 'auto',
    },
    height: {
      type: String,
      default: 'auto',
    },
    // 加载时的图片
    loadingImg: {
      type: String,
      default: '',
    },
    // 加载失败时的图片
    errorImg: {
      type: String,
      default: '',
    },
    // 填充显示
    cover: {
      type: Boolean,
      default: true,
    },
    // 图片源地址
    src: {
      type: String,
      required: true,
      default: defaultImg,
    },
    // 图片文字描述
    alt: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      prefix: 'imgWrap',
    };
  },
};
</script>

<style lang="scss" scoped>
.imgWrap {
  position: relative;
  overflow: hidden;
  &__bg {
    position: absolute;
    left: -7%;
    top: -7%;
    width: 114%;
    height: 114%;
    object-fit: cover;
    filter: blur(13px);
  }
  &__img {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
