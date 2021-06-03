<template>
  <transition name="fadeIn" appear>
    <div v-show="show" class="toast" :class="`toast--${type}`">
      <van-icon :name="icon" :color="iconColor" size="16" />
      <span class="toast__message">{{ message }}</span>
    </div>
  </transition>
</template>

<script>
import { Icon as VanIcon } from 'vant';

export default {
  name: 'toast',

  components: {
    VanIcon,
  },

  props: {
    type: {
      type: String,
      default: 'info',
    },

    message: {
      type: String,
      default: '',
    },

    duration: {
      type: Number,
      default: 3000,
    },

    closed: {
      type: Function,
      default: () => {},
    },
  },

  data() {
    return {
      show: false,
    };
  },

  computed: {
    icon() {
      return {
        info: 'info',
        success: 'checked',
        error: 'clear',
      }[this.type];
    },

    iconColor() {
      return {
        info: '#155BD4',
        success: '#2DA641',
        error: '#D40000',
      }[this.type];
    },
  },

  watch: {
    show(show) {
      if (show) {
        const timeout = setTimeout(() => {
          this.show = false;
          this.$nextTick(() => {
            this.closed && this.closed();
            clearTimeout(timeout);
          });
        }, this.duration);
      }
    },
  },

  mounted() {
    this.show = true;
  },
};
</script>

<style lang="scss">
.toast {
  position: fixed;
  top: 80px;
  left: 50%;
  z-index: 1;
  max-width: 280px;
  padding: 14px 24px 14px 16px;
  word-break: break-all;
  background: #fff;
  border-radius: 4px;
  transform: translateX(-50%);
  box-shadow: 0 2px 24px 0 rgba(200, 201, 204, .5);

  &--info {
    color: #323233;
  }

  &--success {
    color: #2da641;
  }

  &--error {
    color: #d40000;
  }

  .van-icon {
    vertical-align: middle;
  }

  &__message {
    margin-left: 16px;
    font-size: 14px;
    font-weight: 700;
    line-height: 20px;
  }
}

.fadeIn-enter-active,
.fadeIn-leave-active {
  transition: all .5s ease-in-out;
}

.fadeIn-enter,
.fadeIn-leave-to {
  opacity: 0;
  transform: translate(-50%, -80px);
}
</style>
