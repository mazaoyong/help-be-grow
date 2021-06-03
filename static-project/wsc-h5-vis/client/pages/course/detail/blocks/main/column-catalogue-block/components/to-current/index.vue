<template>
  <div ref="el">
    <div v-if="show" class="to-current" @click="toCurrent">
      <vis-icon
        v-theme:fill.main
        class="to-current-icon"
        size="12px"
        name="target"
      />
      回到上次学习
    </div>
  </div>
</template>

<script>
import { throttle } from 'lodash';
import { Icon } from '@youzan/vis-ui';

export default {
  components: {
    'vis-icon': Icon,
  },

  data() {
    return {
      show: false,
    };
  },

  rootState: ['columnProgress'],

  mounted() {
    this.eventFunc = throttle(this.scroll);
    window.addEventListener('scroll', this.eventFunc);
  },

  destroyed() {
    window.removeEventListener('scroll', this.eventFunc);
  },

  methods: {
    getCurrentEl() {
      return this.$refs.el.parentElement.querySelector(`[data-alias='${this.columnProgress.alias}']`);
    },

    scroll() {
      const currentEl = this.getCurrentEl();
      if (currentEl) {
        const top = currentEl.getBoundingClientRect().top;
        if (top < 0 || top > window.innerHeight) {
          this.show = true;
        } else {
          this.show = false;
        }
      }
    },

    toCurrent() {
      const currentEl = this.getCurrentEl();
      if (currentEl) {
        const elementY = currentEl.getBoundingClientRect().top;
        const windowScrollTop = window.pageYOffset || 0;
        const windowHeight = window.innerHeight || 0;
        window.scrollTo({
          top: elementY + windowScrollTop - windowHeight / 2,
          behavior: 'smooth',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.to-current {
  position: fixed;
  right: 0;
  bottom: 60px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  margin-bottom: constant(safe-area-inset-bottom);
  margin-bottom: env(safe-area-inset-bottom);
  font-size: 12px;
  line-height: 30px;
  color: $vice-text-color;
  background-color: $white;
  border-radius: 15px 0 0 15px;
  box-shadow: 0 0 5px 0 $shadow-color;

  .to-current-icon {
    margin-right: 4px;
  }
}
</style>
