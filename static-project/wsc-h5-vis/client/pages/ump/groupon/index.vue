<template>
  <div class="groupon">
    <component :is="page" />
    <salesman-cube
      v-show="false"
      :need-set-share="false"
      :cube="[[]]"
      @getSeller="handleGetSeller"
    />
  </div>
</template>

<script>
import GrouponError from './components/Error';
import Groupon from './components/component-groupon';
import injectH5Components from '@/common/inject-h5-components';

const [SalesmanCube] = injectH5Components({
  pureComponents: ['salesman-cube'],
});

export default {
  name: 'groupon-detail',

  components: {
    SalesmanCube,
    GrouponError,
    Groupon,
  },

  data() {
    return {
      page: Groupon,
    };
  },

  created() {
    this.$store.dispatch('initData', {
      errCallback: () => {
        this.page = GrouponError;
      },
    });
  },
  methods: {
    handleGetSeller(sl) {
      if (!sl) {
        return;
      }
      this.$store.dispatch('initSalesmanInfo', sl);
    },
  },
};
</script>
