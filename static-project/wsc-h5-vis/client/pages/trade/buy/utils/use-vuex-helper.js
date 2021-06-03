import Vue from 'vue';
import mixinVuexHelper from 'common/mixins/mixin-vuex-helper';

export const useVuexHelper = () => {
  Vue.mixin(mixinVuexHelper);
};
