<template>
  <div v-if="!switched">
    <goods-list :recommends="nonOwlModule && nonOwlModule.recommends" />
    <pct-list :recommends="owlModule && owlModule.recommends" />
  </div>

  <div v-else>
    <pct-list :recommends="owlModule && owlModule.recommends" />
    <goods-list :recommends="nonOwlModule && nonOwlModule.recommends" />
  </div>
</template>

<script>
import GoodsList from './GoodsList';
import PctList from './PctList';

export default {
  name: 'bottom-recommends',

  components: {
    'goods-list': GoodsList,
    'pct-list': PctList,
  },

  props: {
    owlModule: Object,
    nonOwlModule: Object,
  },

  data() {
    return {};
  },

  computed: {
    switched() {
      return this.nonOwlModule && this.nonOwlModule.serialNo;
    },
  },

};
</script>

<style lang="scss">

</style>
