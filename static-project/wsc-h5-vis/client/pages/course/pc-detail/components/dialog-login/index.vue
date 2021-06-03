<template>
  <div class="dialog-login">
    <van-icon
      name="cross"
      size="24"
      color="#7d7e80"
      @click="$emit('close')"
    />

    <div class="dialog-login__body">
      <iframe
        v-show="iframeLoaded"
        src="https://passport.youzan.com/scan-login/qrcode?redirectUrl=https://"
        @load="onIframeLoad"
      />

      <van-loading v-if="!iframeLoaded" type="spinner" />
    </div>
  </div>
</template>

<script>
import { Icon as VanIcon, Loading as VanLoading } from 'vant';

export default {
  name: 'dialog-login',

  components: {
    VanIcon,
    VanLoading,
  },

  data() {
    return {
      iframeLoaded: false,
    };
  },

  methods: {
    onIframeLoad() {
      this.iframeLoaded = true;

      const messageHandler = (e) => {
        if (e.data) {
          if (e.data.type === 'success') {
            this.$emit('success');
          }
        }
      };
      window.addEventListener('message', messageHandler);
    },
  },
};
</script>

<style lang="scss">
.dialog-login-container {
  background: transparent;
}

.dialog-login {
  position: relative;
  width: 376px;
  height: 464px;
  overflow: hidden;
  background: #fff;
  border-radius: 4px;
  box-sizing: border-box;
  user-select: none;

  .van-icon-cross {
    position: absolute;
    top: 16px;
    left: 16px;
    z-index: 1;
    cursor: pointer;
  }

  &__body {
    position: relative;
    width: 100%;
    height: 100%;

    iframe {
      width: 100%;
      height: 100%;
    }

    .van-loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
