<template>
  <div v-if="fetched" :class="{'discount-package': !activityEnd}">
    <template v-if="!activityEnd">
      <!-- 套餐区域 -->
      <package-lists />

      <!-- sku -->
      <goods-sku />

      <!-- 底部提交栏 -->
      <submit-bar />
    </template>

    <!-- 套餐失效 -->
    <empty-popup v-else />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Args from 'zan-utils/url/args';
import PackageLists from './components/PackageLists';
import GoodsSku from './components/GoodsSku';
import SubmitBar from './components/SubmitBar';
import EmptyPopup from './components/Empty';

export default {
  name: 'discount-package',

  components: {
    PackageLists,
    GoodsSku,
    SubmitBar,
    EmptyPopup,
  },

  data() {
    return {
      productAlias: Args.get('productAlias') || '',
      activityAlias: Args.get('activityAlias') || '',
    };
  },

  computed: {
    ...mapState(['activityEnd', 'fetched']),
  },

  mounted() {
    // this.$store.commit('INIT_DATA');
    this.$store.dispatch('FETCH_PACKAGES', {
      productAlias: this.productAlias,
      activityAlias: this.activityAlias,
    });
  },
};
</script>

<style scoped>
.discount-package {
  padding-bottom: 70px;
}
</style>
