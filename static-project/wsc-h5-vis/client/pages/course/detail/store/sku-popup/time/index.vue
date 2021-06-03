<template>
  <van-cell
    v-if="timeStr"
    class="time"
    :border="false"
  >
    <template slot="title">
      <vis-icon
        v-theme:fill.main
        class="time-icon"
        size="16px"
        name="waiting"
      />
      <span class="time-str">{{ timeStr }}</span>
    </template>
  </van-cell>
</template>

<script>
import { Cell } from 'vant';
import { Icon } from '@youzan/vis-ui';
import store from '../../index';

export default {
  components: {
    'van-cell': Cell,
    'vis-icon': Icon,
  },

  computed: {
    timeStr() {
      return store.getters.timeStr;
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.time {
  padding-left: 0;

  .time-icon {
    display: inline-block;
    margin-right: 4px;
    vertical-align: sub;
  }

  .time-str {
    display: inline-block;
    font-size: 13px;
    line-height: 24px;
    color: $vice-text-color;
  }
}
</style>
