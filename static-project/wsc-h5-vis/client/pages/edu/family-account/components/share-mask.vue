<template>
  <div v-show="showShareGuide" class="share-mask" @click="closeMask">
    <i class="share-mask__icon" />
    <p class="share-mask__title">
      立即分享给好友吧
    </p>
    <p class="share-mask__desc">
      点击屏幕右上角，邀请好友
    </p>
    <div class="share-mask__icon">
      <img src="https://img01.yzcdn.cn/public_files/2017/08/30/0db0c59e46d67472ed92a4ced7c70903.png" alt="引导提示">
    </div>
  </div>
</template>
<script>
export default {
  name: 'share-mask',

  props: {
    showShareGuide: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    closeMask() {
      this.$emit('close-mask');
    },
  },

};
</script>
<style lang="scss">
.share-mask {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;
  line-height: 30px;
  color: #fff;
  background: rgba(0, 0, 0, .8);

  &__title {
    margin: 140px auto 0 auto;
    font-size: 20px;
    font-weight: 500;
    text-align: center;
  }

  &__desc {
    margin: 5px;
    font-size: 14px;
    text-align: center;
  }

  &__icon {
    position: fixed;
    top: 12px;
    right: 33px;
    width: 66px;
    height: 117px;
    background-image: url(/public_files/2017/08/30/0db0c59e46d67472ed92a4ced7c70903.png);
    background-size: 66px 117px;

    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
