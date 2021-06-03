<template>
  <van-popup
    v-model="show"
    class="popup"
    position="bottom"
    :overlay="overlay"
    :overlay-class="overlayClass"
    :overlay-style="overlayStyle"
    :lock-scroll="lockScroll"
    :lazy-render="lazyRender"
    :close-on-popstate="closeOnPopstate"
    :close-on-click-overlay="closeOnClickOverlay"
    :closeable="closeable"
    :close-icon="closeIcon"
    :close-icon-position="closeIconPosition"
    :transition="transition"
    :get-container="getContainer"
    round
    @open="onOpen"
    @opened="onOpened"
    @close="onClose"
    @closed="onClosed"
    @click-overlay="onClickOverlay"
  >
    <h3 v-if="title" class="title">
      {{ title }}
    </h3>
    <div class="content" :style="{ minHeight, maxHeight }">
      <slot />
    </div>
    <div v-if="buttons.length" class="buttons">
      <van-button
        v-for="(button, index) in buttons"
        :key="index"
        class="button"
        :class="button.class"
        @click="button.onClick"
      >
        {{ button.text }}
      </van-button>
    </div>
  </van-popup>
</template>

<script>
import { Popup, Button } from 'vant';

const deviceHeight = document.documentElement.clientHeight;

export default {
  name: 'popup',

  components: {
    [Popup.name]: Popup,
    [Button.name]: Button,
  },

  props: {
    value: {
      type: Boolean,
      required: true,
    },
    overlay: {
      type: Boolean,
      default: true,
    },
    overlayClass: {
      type: String,
      default: '',
    },
    overlayStyle: {
      type: Object,
      default: null,
    },
    lockScroll: {
      type: Boolean,
      default: true,
    },
    lazyRender: {
      type: Boolean,
      default: true,
    },
    closeOnPopstate: {
      type: Boolean,
      default: false,
    },
    closeOnClickOverlay: {
      type: Boolean,
      default: true,
    },
    closeable: {
      type: Boolean,
      default: false,
    },
    closeIcon: {
      type: String,
      default: 'cross',
    },
    closeIconPosition: {
      type: String,
      default: 'top-right',
    },
    transition: {
      type: String,
      default: '',
    },
    getContainer: {
      type: [Function, String],
      default: null,
    },
    title: {
      type: String,
      default: '',
    },
    buttons: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    show: {
      get() {
        return this.value;
      },

      set(show) {
        if (show) {
          this.$emit('open');
        } else {
          this.$emit('close');
        }
      },
    },

    minHeight() {
      let height = Math.floor(deviceHeight * 0.5);
      if (this.hasButton) {
        height = height - 50;
      }
      if (this.hasTitle) {
        height = height - 50;
      }
      return `${height}px`;
    },

    maxHeight() {
      let height = Math.floor(deviceHeight * 0.8);
      if (this.hasButton) {
        height = height - 50;
      }
      if (this.hasTitle) {
        height = height - 50;
      }
      return `${height}px`;
    },

    hasTitle() {
      return !!this.title;
    },

    hasButton() {
      return !!this.buttons.length;
    },
  },

  methods: {
    onOpen() {
      this.$emit('open');
    },

    onOpened() {
      this.$emit('opened');
    },

    onClose() {
      this.$emit('close');
    },

    onClosed() {
      this.$emit('closed');
    },

    onClickOverlay() {
      this.$emit('click-overlay');
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.title {
  line-height: 50px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  color: $main-text-color;
}

.content {
  overflow: auto;
}

.buttons {
  display: flex;
  padding: 7px 16px;
  width: 100%;
  box-sizing: border-box;
}

.button {
  width: 100%;
  height: 36px;
  line-height: 36px;

  &:first-child {
    border-top-left-radius: 18px;
    border-bottom-left-radius: 18px;
  }

  &:last-child {
    border-top-right-radius: 18px;
    border-bottom-right-radius: 18px;
  }
}

.is-iphonex .buttons {
  margin-bottom: 34px;
}
</style>
