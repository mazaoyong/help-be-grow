<template>
  <div :class="['join-count-banner', `join-count-banner-style-${pageStyle}`]">
    <p class="text">
      今天已有{{ count }}人得到奖励
    </p>
  </div>
</template>

<script>
export default {
  name: 'join-count-banner',

  props: {
    count: {
      type: Number,
      default: 0,
    },

    pageStyle: {
      type: Number,
      default: 1,
    },
  },
};
</script>

<style lang="scss" scoped>
.join-count-banner {
  height: 35px;
  padding: 0 24px;
  text-align: center;
  border-radius: 19.5px;

  .text {
    line-height: 35px;
    font-size: 14px;
    font-weight: 500;
    color: #fff;
  }

  &-style {
    &-1 {
      background-image: linear-gradient(91deg, rgba(165,11,11,0.00) 2%,
        rgba(163,15,15,0.20) 21%, rgba(166,14,14,0.40) 51%,
        rgba(168,17,17,0.20) 83%, rgba(167,15,15,0.00) 98%);
    }

    &-2 {
      background-image: linear-gradient(91deg, rgba(23,81,204,0.00) 2%,
        rgba(23,81,204,0.41) 21%, rgba(23,81,204,0.80) 51%,
        rgba(23,81,204,0.42) 83%, rgba(23,81,204,0.00) 98%);
    }

    &-3 {
      background-image: linear-gradient(91deg, rgba(84,85,255,0.00) 2%,
        rgba(156,165,255,0.40) 22%, rgba(156,165,255,0.70) 51%,
        rgba(156,165,255,0.40) 83%, rgba(75,77,246,0.00) 98%);
    }
  }
}
</style>
