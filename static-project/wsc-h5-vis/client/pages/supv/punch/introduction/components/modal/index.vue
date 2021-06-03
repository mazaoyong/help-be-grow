<template>
  <div
    class="m-mask"
    v-if="isShow"
    @click="onHideModal('mask')"
  >
    <div class="m-modal">
      <div
        v-if="title"
        class="u-tit"
      >
        {{ title }}
      </div>
      <slot></slot>
      <div class="m-btn-box">
        <div
          v-if="showCloseButton"
          class="u-btn"
          @click="onCloseModal('close')"
        >
          {{ closeButtonText }}
        </div>
        <div
          v-if="showConfirmButton"
          class="u-btn u-btn-confirm"
          @click="onCloseModal('confirm')"
        >
          {{ confirmButtonText }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'modal',
  props: {
    title: {
      type: String,
      default: '',
    },
    isCanClickMask: {
      type: Boolean,
      default: true,
    },
    showCloseButton: {
      type: Boolean,
      default: true,
    },
    showConfirmButton: {
      type: Boolean,
      default: true,
    },
    closeButtonText: {
      type: String,
      default: '取消',
    },
    confirmButtonText: {
      type: String,
      default: '确认',
    },
    isShow: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onCloseModal(type) {
      this.$emit('closeModal', type);
    },
    onHideModal(type) {
      if (this.isCanClickMask && type === 'mask') {
        this.isShow = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.m-mask {
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .6);
}
.m-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  bottom: auto;
  width: 284px;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px #999999;
  border-radius: 7px;
  background-color: #fff;
}
.u-tit {
  box-sizing: border-box;
  margin: 10px 24px;
  line-height: 26px;
  font-size: 14px;
  font-weight: bold;
  color: #353535;
  text-align: center;
}
.m-btn-box {
  display: flex;
  height: 44px;
  line-height: 44px;
  text-align: center;
}
.u-btn {
  display: inline-block;
  flex: 1;
  line-height: 44px;
  font-size: 14px;
  color: #4a4a4a;
  text-align: center;
  border-top: 1px solid #ebebeb;
  border-left: 1px solid #ebebeb;
}
.u-btn:first-child {
  border-top: 1px solid #ebebeb;
  border-left: none;
}
.u-btn-confirm {
  font-weight: bold;
  color: #00b389
}
</style>
