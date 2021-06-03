<template>
  <div class="recommend-list">
    <div class="recommend-list__title">
      <van-divider>
        {{ title }}
      </van-divider>
    </div>

    <div class="recommend-list__goods">
      <slot />
    </div>
  </div>
</template>
<script>
import { Divider } from 'vant';

export default {
  name: 'recommend-list',

  components: {
    'van-divider': Divider,
  },

  props: {
    title: {
      type: String,
      default: '更多精选课程',
    },
  },
};
</script>
<style lang="scss" scoped>
.recommend-list {
  &__title {
    font-size: 14px;
    line-height: 18px;
    color: #323233 !important;
    text-align: center;

    .van-divider {
      color: #323233;
    }
  }

  &__goods {
    display: flex;
    margin: 0 10px;
    box-sizing: border-box;
    flex-wrap: wrap;
  }
}
</style>
