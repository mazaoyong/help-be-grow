<template>
  <footer class="layout-footer" :class="{ 'layout-footer--fixed': isFixed }">
    <slot />

    <block-copyright />
  </footer>
</template>

<script>
import BlockCopyright from '../../../blocks/block-copyright';

export default {
  name: 'layout-footer',

  components: {
    BlockCopyright,
  },

  data() {
    return {
      isFixed: true,
    };
  },

  mounted() {
    const detail = document.querySelector('.layout-detail');
    if (detail) {
      const { height: detailHeight } = detail.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const OTHER_HEIGHT = 378;
      const FOOTER_HEIGHT = 116;
      if (detailHeight >= viewportHeight - OTHER_HEIGHT - FOOTER_HEIGHT) {
        this.isFixed = false;
      }
    }
  },
};
</script>

<style lang="scss">
.layout-footer {
  position: static;
  bottom: 0;
  left: 0;
  width: 100%;
  margin-top: 50px;

  &--fixed {
    position: fixed;
  }
}
</style>
