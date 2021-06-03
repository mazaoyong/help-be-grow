<template>
  <div ref="el">
    <div
      v-if="show"
      class="fold-button"
      :style="{ opacity: scrolling ? 0.6 : 1 }"
      @click="$emit('close')"
    >
      收起
      <vis-icon class="fold-button__icon" size="16px" name="arrow-up" />
    </div>
  </div>
</template>

<script>
import { throttle } from 'lodash';
import { Icon } from '@youzan/vis-ui';

export default {
  name: 'fold-button',
  components: {
    'vis-icon': Icon,
  },

  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      scrolling: false,
    };
  },

  mounted() {
    let isScrolling;
    const scrollCallback = () => {
      if (!this.show) {
        return;
      }
      if (!this.scrolling) {
        this.scrolling = true;
      }

      clearTimeout(isScrolling);
      isScrolling = setTimeout(() => {
        this.scrolling = false;
      }, 200);
    };

    this._eventFunc = throttle(scrollCallback, 100, {
      leading: false,
      trailing: false,
    });
    window.addEventListener('scroll', this._eventFunc);
  },

  destroyed() {
    window.removeEventListener('scroll', this._eventFunc);
  },
};
</script>

<style lang="scss" scoped>
/* @import "mixins/index.scss"; */

.fold-button {
  position: fixed;
  right: 16px;
  bottom: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 74px;
  background: #ffffff;
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.04), 0 0 6px 0 rgba(0, 0, 0, 0.16);
  border-radius: 20px;
  color: #646566;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: constant(safe-area-inset-bottom);
  margin-bottom: env(safe-area-inset-bottom);

  &__icon {
    margin-left: 8px;
  }
}
</style>
