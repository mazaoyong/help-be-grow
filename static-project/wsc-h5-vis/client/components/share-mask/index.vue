<template>
  <div v-if="show || value" class="share-mask" @click="closeMask">
    <i class="share-mask__icon" />
    <p class="share-mask__title">
      <slot name="title">
        立即分享给好友吧
      </slot>
    </p>
    <p class="share-mask__desc">
      <slot name="desc">
        点击屏幕右上角将本页面分享给好友
      </slot>
    </p>
    <div class="share-mask__icon" :style="{'right': position}">
      <img src="https://img01.yzcdn.cn/public_files/2017/08/30/0db0c59e46d67472ed92a4ced7c70903.png" alt="引导提示">
    </div>
  </div>
</template>
<script>
const { isMiniProgram } = _global.miniprogram || {};
export default {
  name: 'share-mask',

  props: {
    show: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      position: isMiniProgram ? '66px' : '33px',
    };
  },

  methods: {
    closeMask() {
      this.$emit('close');
    },
  },

};
</script>
<style lang="scss" scoped>
.share-mask {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 3000;
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
    width: 66px;
    height: 117px;

    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
