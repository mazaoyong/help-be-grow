<template>
  <div
    class="vis-notification"
  >
    {{ message }}
  </div>
</template>

<script>
export default {
  name: 'notification',
  props: {
    message: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss">
.vis-notification {
  z-index: 999;
  position: fixed;
  bottom: 50px;
  width: 100%;
  min-height: 35px;
  line-height: 35px;
  font-size: 12px;
  color: #f60;
  text-align: center;
  background-color: rgba(255, 247, 204, 1);
}
.is-iphonex .vis-notification {
  bottom: 84px;
  bottom: calc(constant(safe-area-inset-bottom) + 50px);
  bottom: calc(env(safe-area-inset-bottom) + 50px);
}
.pc-mode .vis-notification {
  margin: 0 auto;
  width: 375px;
}
</style>
