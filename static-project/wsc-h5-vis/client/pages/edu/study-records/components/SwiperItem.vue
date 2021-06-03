<template>
  <div
    :style="style"
    class="swiper-item"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'swiper-item',

  props: {
    index: Number,
  },

  data() {
    return {
      currentItemIndex: 0,
      listLength: 0,
      translateX: 0,
      threshold: 100,
      isTouchEnded: false,

      width: 0,
      height: 0,
      enteredWidth: 0,
      enteredHeight: 0,
      leavedWidth: 0,
      leavedHeight: 0,
      childEl: null,
    };
  },

  computed: {
    style() {
      const style = {
        width: `${this.width}px`,
        height: `${this.height}px`,
      };

      if (this.isTouchEnded) {
        style.transition = 'all .3s ease-out';
      }

      return style;
    },
  },

  watch: {
    currentItemIndex(currentItemIndex) {
      if (this.currentItemIndex !== this.index) {
        this.width = 297;
        this.height = 156;
      } else {
        this.width = 330;
        this.height = 173;
      }
    },

    isTouchEnded(isTouchEnded) {
      if (this.currentItemIndex !== this.index) {
        this.width = 297;
        this.height = 156;
      } else {
        this.width = 330;
        this.height = 173;
      }
    },

    /**
     * 监听移动距离，根据移动距离决定自身的状态
     * 可以分为以下几种情况
     * - 进入项（左&右）
     * - 退出项（当前项）
     *
     * - 头部（第一个）
     * - 尾部（最后一个）
     *
     * - 拖动中
     * - 拖动结束
     */
    translateX(newV) {
      const isLeaving = this.index === this.currentItemIndex;
      const isEntering = newV > 0
        ? this.index === this.currentItemIndex - 1
        : this.index === this.currentItemIndex + 1;

      if (!this.isTouchEnded) {
        const translateX = Math.abs(newV);
        let percent = translateX / this.threshold;
        if (percent > 1) percent = 1;
        if (isLeaving) {
          this.width = 330 - 33 * percent;
          this.height = 173 - 17 * percent;
        } else if (isEntering) {
          this.width = 297 + 33 * percent;
          this.height = 156 + 17 * percent;
        }
      }
    },
  },

  created() {
    // 获取列表项长度
    const listLength = this.$parent.$slots.default.length;
    this.listLength = listLength;

    // 尺寸分为以下几种
    // 1.大于一张 + 第一张
    // 2.就一张 + 第一张
    // 3.大于一张 + 最后一张
    // 4.大于两张 + 中间态
    this.enteredWidth = 330;
    this.enteredHeight = 173;
    this.leavedWidth = 297;
    this.leavedHeight = 156;

    if (listLength === 1) {
      this.enteredWidth = this.leavedWidth = window.innerWidth - 20;
      this.enteredHeight = this.leavedHeight = 173;
    }

    if (this.index === 0) {
      this.width = this.enteredWidth;
      this.height = this.enteredHeight;
    } else {
      this.width = this.leavedWidth;
      this.height = this.leavedHeight;
    }
  },
};
</script>

<style lang="scss">
.swiper-item {
  flex: 0 0 auto;
  margin-left: 10px;
  display: inline-block;
  background: #fff;
  border-radius: 4px;
  transform-origin: center;

  &:first-child {
    margin-left: 0;
  }
}
</style>
