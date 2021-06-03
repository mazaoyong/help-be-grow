<template>
  <div class="home-flash">
    <c-flash :list="carousel" />
  </div>
</template>

<script>
import Flash from '../../components/flash/index.vue';
import { mapActions, mapState } from 'vuex';

export default {
  name: 'home-intro',

  components: {
    'c-flash': Flash,
  },
  computed: {
    ...mapState('recommend-gift', ['carousel']),
  },
  mounted() {
    this.getCarousel();
  },
  methods: {
    ...mapActions('recommend-gift', ['getCarousel']),
  },
};
</script>

<style lang="scss" scoped>
.home-flash {
  position: absolute;
  top: 12px;
  left: 12px;
}
</style>
