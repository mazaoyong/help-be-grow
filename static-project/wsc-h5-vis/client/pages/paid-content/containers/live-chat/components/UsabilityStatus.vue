<template>
  <div
    v-if="value"
    class="usability-status"
    :style="{
      backgroundColor: background,
      color: color
    }">
    <slot>
      <van-icon
        name="warn"
        class="usability-status__icon"
      />
      当前网络不可用，请检查你的网络设置
    </slot>
  </div>
</template>

<script>
import popupMixins from '../mixins/popup.js';
import { Icon } from 'vant';

export default {
  name: 'usability-status',

  components: {
    [Icon.name]: Icon,
  },

  mixins: [popupMixins],

  props: {
    background: {
      type: String,
      default: '#ffe0e0',
    },
    color: {
      type: String,
      default: '#666',
    },
  },
};
</script>

<style lang="scss">
  .usability-status {
    height: 36px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    position: fixed;
    left: 0;
    width: 100%;
    top: 0;
    z-index: 1;

    &__icon {
      font-size: 14px;
      color: #f44;
      margin-right: 5px;
    }
  }
</style>
