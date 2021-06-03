<template>
  <div v-if="isShowMask">
    <div
      class="m-mask"
      v-if="isShow"
    >
      <modal
        :is-show-close-button="isShowCloseButton"
        :bottom="bottom"
        :is-show-mask="isShowMask"
        @hideModal="onHideModal"
      >
        <slot></slot>
      </modal>
    </div>
  </div>
  <div v-else>
    <modal
      v-if="isShow"
      :is-show-close-button="isShowCloseButton"
      :bottom="bottom"
      :is-show-mask="isShowMask"
      @hideModal="onHideModal"
    >
      <slot></slot>
    </modal>
  </div>
</template>

<script>
import Modal from './modal';

export default {
  name: 'bottom-modal',
  components: {
    'modal': Modal,
  },
  props: {
    isCanClickMask: {
      type: Boolean,
      default: true,
    },
    isShow: {
      type: Boolean,
      default: false,
    },
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
.m-mask {
  z-index: 999;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, .6);
}
</style>
