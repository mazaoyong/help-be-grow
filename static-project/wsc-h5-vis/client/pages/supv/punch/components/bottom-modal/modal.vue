<template>
  <div name="modal">
    <div
      :class="['m-modal', isShowMask ? '' : 'm-modal--fixed']"
      :style="{ paddingBottom:  `${bottom}px` }">
      <a
        v-if="isShowCloseButton"
        class="u-btn u-btn-close"
        @click="onHideModal"
      />
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'modal',
  props: {
    isShowCloseButton: {
      type: Boolean,
      default: true,
    },
    bottom: {
      type: Number,
      default: 0,
    },
    isShowMask: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    onHideModal() {
      this.$emit('hideModal');
    },
  },
};
</script>

<style lang="scss">
.m-modal {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  border-radius: 12px 12px 0 0;
  background-color: #fff;
}
.m-modal.m-modal--fixed {
  z-index: 999;
  position: fixed;
  bottom: 0;
  left: 0;
  box-shadow: 0 2px 15px rgba(0, 0, 0, .14);
}
.u-btn-close {
  position: absolute;
  top: 9px;
  right: 9px;
  width: 25px;
  height: 25px;
  line-height: 25px;
  font-size: 20px;
  color: #666;
  text-align: center;
  background-image: url('https://b.yzcdn.cn/punch/icon/closeBtn.png');
  background-position: center center;
  background-size: 14px 14px;
  background-repeat: no-repeat;
}
</style>
