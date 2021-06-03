<template>
  <div
    id="pivot"
    slot="pivot"
    class="pivot"
    :style="pivotStyle">
    {{ `${innerTime} / ${formattedDuration}` }}
  </div>
</template>

<script>
import UA from 'zan-utils/browser/ua_browser';

export default {
  name: 'pivot',

  props: {
    inactive: Boolean,
    progress: Number,
    currentTime: String,
    duration: Number,
  },

  data() {
    const isMobile = UA.isMobile();

    return {
      maxLeft: 100,
      windowWidth: isMobile ? window.innerWidth : 375,
      pivotWidth: 0,
      innerTime: '00:00',
    };
  },

  computed: {
    pivotStyle() {
      const pivotStyle = {
        left: this.progress + '%',
      };

      if (this.progress >= this.maxLeft) {
        pivotStyle.left = this.windowWidth - this.pivotWidth + 'px';
      }

      return pivotStyle;
    },

    formattedDuration() {
      return this.getTime(this.duration);
    },
  },

  watch: {
    currentTime(newV) {
      this.innerTime = newV;
    },

    progress(newV) {
      this.innerTime = this.getTime(this.duration * newV / 100);
    },
  },

  mounted() {
    this.$emit('inited', this.$el);

    this.pivotWidth = this.$el.getBoundingClientRect().width;
    this.maxLeft = 100 - Math.floor(this.pivotWidth / this.windowWidth * 100);
  },

  methods: {
    pad(number) {
      return number < 10 ? `0${number}` : `${number}`;
    },
    getTime(seconds) {
      const minute = parseInt(seconds / 60, 10);
      const second = parseInt(seconds % 60);
      return `${this.pad(minute)}:${this.pad(second)}`;
    },
  },
};
</script>

<style lang="scss">
.pivot {
  position: absolute;
  top: 50%;
  padding: 0 12px;
  line-height: 32px;
  text-align: center;
  white-space: nowrap;
  color: #fff;
  font-size: 20px;
  border-radius: 16px;
  background: rgba(0, 0, 0, .9);
  transform: translate3d(0, -50%, 0) scale(.5);
  transform-origin: left;
  user-select: none;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    transform: translateY(-14px);
    background: transparent;
  }
}
</style>
