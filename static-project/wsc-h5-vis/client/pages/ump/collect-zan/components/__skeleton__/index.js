import Vue from 'vue';
import App from './App.vue';

Vue.mixin({
  beforeCreate() {
    this.$store = {
      getters: {
        recordList: () => [],
      },
    };
  },
});

// eslint-disable-next-line no-new
export default Vue.extend({
  render: h => h(App),
});
