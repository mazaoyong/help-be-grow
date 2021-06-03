<template>
  <div class="fission-coupon-bg">
    <img src="https://img01.yzcdn.cn/upload_files/2021/02/23/Fom1kscGXsAaCbY2d9YqHewJPch8.png">
    <div class="coupon-text" :style="{ transform: transformStyle }">
      恭喜你！送你 {{ num }} 张优惠券
    </div>
  </div>
</template>

<script>
export default {
  props: {
    num: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      transformStyle: 'scale(1) translateY(-50%)',
    };
  },
  mounted() {
    const windowWidth = document.documentElement.getBoundingClientRect().width;
    const fissionWidth = windowWidth - 24;
    if (fissionWidth < 375) {
      this.transformStyle = `scale(${(fissionWidth / 375).toFixed(2)}) translateY(-50%)`;
      console.log('fission mounted', this.transformStyle);
    }
  },
};
</script>

<style lang="scss" scoped>
.fission-coupon-bg {
  height: auto;
  position: relative;
  img {
    display: block;
    width: 100%;
  }
}
.coupon-text {
  position: absolute;
  top: 50%;
  left: 20px;
  transform-origin: left;
  font-size: 22px;
  color: #FFEAA1;
  line-height: 22px;
}
</style>
