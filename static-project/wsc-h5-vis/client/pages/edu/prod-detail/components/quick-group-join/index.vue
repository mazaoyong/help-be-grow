<template>
  <div v-if="groupInfo" class="quick-group-join van-goods-action" @click="$emit('click')">
    <div class="imgs">
      <img :src="groupInfo.avatar">
      <img src="https://b.yzcdn.cn/wsc-h5-vis/course/detail/join-group.png">
    </div>
    <p class="tip">
      {{ groupInfo.name }}的团只差
      <span class="num">{{ groupInfo.gapNum }}</span>
      人
    </p>
    <p class="button">
      快速凑团
      <van-icon class="arrow" name="arrow" />
    </p>
  </div>
</template>

<script>
import { Icon } from 'vant';

export default {
  components: {
    'van-icon': Icon,
  },

  props: {
    groupInfo: {
      type: Object,
      default: null,
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.quick-group-join {
  position: fixed;
  align-items: center;
  bottom: 50px;
  z-index: 2;
  display: flex;
  height: 50px;
  padding: 0 16px;
  font-size: 14px;
  background-color: #f7f8fa;

  .imgs {
    position: relative;
    width: 52px;
    height: 30px;
    flex-shrink: 0;

    img {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 2;
      width: 30px;
      height: 30px;
      border-radius: 50%;

      &:last-child {
        left: 22px;
        z-index: 1;
      }
    }
  }

  .tip {
    width: 100%;
    margin: 0 8px;

    .num {
      color: #f44;
    }
  }

  .button {
    flex-shrink: 0;
    color: $disabled-color;

    .arrow {
      font-size: 16px;
      color: $gray-icon-color;
      vertical-align: text-bottom;
    }
  }
}
</style>
