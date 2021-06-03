<template>
  <van-action-sheet v-model="show" title="推荐以下课程赚奖励">
    <recommend-list :items="recommendGoodsList" />
  </van-action-sheet>
</template>

<script>
import { mapState } from 'vuex';
import { ActionSheet } from 'vant';
import RecommendList from '../../components/recommend-list';

export default {
  components: {
    'van-action-sheet': ActionSheet,
    RecommendList,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
    ...mapState('recommend-gift', ['recommendGoodsList']),
  },
};
</script>

<style lang="scss" scoped>

</style>
