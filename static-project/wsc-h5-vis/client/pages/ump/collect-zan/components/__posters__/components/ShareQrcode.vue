<template>
  <div class="share-qrcode">
    <div class="share-qrcode__text">
      <p>扫描或长按识别二维码</p>
      <p>为我助力吧</p>
    </div>
    <img class="share-qrcode__qrcode" :src="qrcode">
  </div>
</template>

<script>
export default {
  props: {
    qrcode: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss">
.share-qrcode {
  position: absolute;
  bottom: 32px;
  left: 50%;
  display: flex;
  width: 236px;
  transform: translateX(-50%);
  justify-content: space-between;
  align-items: center;

  &__text {
    font-size: 14px;
    line-height: 18px;
    color: #969799;
    text-align: left;
    flex: 1 1 0;
  }

  &__qrcode {
    width: 80px;
    height: 80px;
    flex: 0 0 auto;
  }
}
</style>
