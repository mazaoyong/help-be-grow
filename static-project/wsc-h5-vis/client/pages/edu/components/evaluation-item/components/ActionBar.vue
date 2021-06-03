<template>
  <div class="action-bar">
    <p class="actions__thumb-num">
      {{ supportCount }}
    </p>
    <div @click.stop="onThumb">
      <van-icon
        :name="thumb.thumbName"
        :color="thumb.thumbColor"
        class="actions__thumb-icon"
      />
    </div>
  </div>
</template>

<script>
import { Icon } from '@youzan/vis-ui';

export default {
  name: 'action-bar',

  components: {
    'van-icon': Icon,
  },

  props: {
    supportCount: {
      type: Number,
      default: 0,
    },

    hasSupported: {
      type: Number,
      default: 0,
    },

    themeColor: {
      type: String,
      default: '#f44',
    },
  },

  computed: {
    thumb() {
      const thumbName = this.hasSupported ? 'love' : 'love-o';
      const thumbColor = this.hasSupported ? this.themeColor : '#979797';
      return {
        thumbName,
        thumbColor,
      };
    },
  },

  methods: {
    onThumb() {
      this.$emit('thumb');
    },
  },
};
</script>

<style lang="scss">
.action-bar {
  padding: 5px 15px;
  min-height: 16px;
  position: relative;
  box-sizing: border-box;

  .actions {

    &__thumb-num {
      position: absolute;
      right: 19px;
      bottom: 0;
      line-height: 16px;
      font-size: 12px;
      color: #969799;
    }

    &__thumb-icon {
      top: 0;
      right: 0;
      position: absolute;
      font-size: 16px;
    }
  }
}
</style>
