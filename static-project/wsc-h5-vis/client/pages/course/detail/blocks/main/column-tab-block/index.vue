<template>
  <info-tab
    v-show="show"
    v-model="active"
    class="column-tab-block"
    :sticky="env.isMobile"
    @change="change"
  />
</template>

<script>
import InfoTab from '@/pages/course/detail/components/info-tab';

export default {
  components: {
    InfoTab,
  },

  data() {
    return {
      active: 1,
      show: false,
    };
  },

  rootState: ['env', 'goodsData'],

  created() {
    if (this.goodsData.isOwnAsset) {
      this.active = 2;
    }
  },

  methods: {
    change(tabs) {
      if (tabs.length > 1) {
        this.show = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.column-tab-block {
  ::v-deep .van-tabs {
    z-index: 1;
    box-shadow: 0 2px 10px 0 $shadow-color;
  }
}
</style>
