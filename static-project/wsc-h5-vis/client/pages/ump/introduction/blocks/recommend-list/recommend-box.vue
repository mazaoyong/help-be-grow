<template>
  <div class="recommend-box">
    <div class="recommend-box__title">
      <van-divider>更多精选课程</van-divider>
    </div>

    <div class="recommend-box__goods">
      <recommend-card
        v-for="(item, index) in recommendGoods"
        :key="index"
        :source-data="item"
        @click.native="onCardClick(index)"
      />
    </div>
  </div>
</template>
<script>
import { Divider } from 'vant';
import { logRecommendGoods } from './track';
import RecommendCard from './recommend-card';

export default {
  name: 'recommend-box',

  components: {
    'van-divider': Divider,
    RecommendCard,
  },

  props: {
    recommendGoods: {
      type: Array,
      default: () => [],
    },
  },

  methods: {
    onCardClick(index) {
      logRecommendGoods(index);
    },
  },
};
</script>
<style lang="scss" scoped>
.recommend-box {
  &__title {
    margin: 0 10px;
    line-height: 18px;
    text-align: center;
    font-size: 14px;
    color: #323233 !important;

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
