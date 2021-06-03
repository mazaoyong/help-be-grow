<template>
  <div class="vis-no-course">
    <div class="img-box">
      <img
        class="img"
        src="https://b.yzcdn.cn/public_files/2018/11/19/bfc666f3eb05081b88d7353f43e18123.png"
      >
    </div>
    <p
      v-html="desc"
      class="desc"
    />
    <slot />
  </div>
</template>

<script>
export default {
  name: 'no-course',

  props: {
    desc: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss">
.vis-no-course {
  width: 100%;
  text-align: center;

  .img-box {
    position: relative;
    width: 100px;
    height: 100px;
    margin: 0 auto;
  }

  .img {
    position: absolute;
    top: 0;
    left: 50%;
    display: block;
    width: 100px;
    height: 100px;
    margin-left: -50%;
  }

  .desc {
    margin: 5px 0 20px;
    font-size: 14px;
    line-height: 20px;
    color: #969799;
    text-align: center;
  }
}
</style>
