<template>
  <div class="vis-empty">
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
  name: 'empty',

  props: {
    desc: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="postcss">
.vis-empty {
  width: 100%;
  margin-top: 40%;
  text-align: center;
  .img-box {
    position: relative;
    margin: 0 auto;
    width: 100px;
    height: 100px;
  }
  .img {
    position: absolute;
    display: block;
    top: 0;
    left: 50%;
    margin-left: -50%;
    width: 100px;
    height: 100px;
  }
  .desc {
    margin: 5px 0 20px;
    font-size: 14px;
    line-height: 20px;
    color: #999;
    text-align: center;
  }
}
</style>
