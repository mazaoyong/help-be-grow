<template>
  <div class="paid-info-recommand-box">
    <recommand-card
      v-for="(item, index) in recommandData"
      :key="index"
      :source-data="item"
    />
  </div>
</template>
<script>
import API from '../api';
import RecommandCard from './components/RecommandCard';

export function getRecommandCourse() {
  // 获取推荐课程信息
  return API.getRecommandCourse();
};

export default {
  name: 'recommand-box',

  components: {
    [RecommandCard.name]: RecommandCard,
  },

  props: {
    recommandData: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {};
  },
};
</script>
<style lang="scss">
.paid-info {

  &-recommand-box {
    display: flex;
    margin: 0 10px;
    box-sizing: border-box;
    flex-wrap: wrap;
  }
}
</style>
