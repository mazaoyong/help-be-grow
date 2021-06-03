<template>
  <van-sku
    :value="value"
    :goods-id="alias"
    :sku="formatSku"
    :initial-sku="formatSelectedSku"
    close-on-click-overlay
    safe-area-inset-bottom
    v-on="proxyListeners"
    @sku-selected="handleSkuSelected"
  >
    <!-- 通过slot主动置空的形式，覆盖原来的DOM -->
    <template slot="sku-stepper">
      <div />
    </template>
    <template slot="sku-messages">
      <div />
    </template>
    <template slot="sku-header">
      <sku-header :activity-type="activityType" />
    </template>
    <template slot="extra-sku-group">
      <div class="extra">
        <component
          :is="key"
          v-for="key in componentKeys"
          :key="key"
          :activity-type="activityType"
          class="extra-item"
        />
      </div>
    </template>
    <template slot="sku-actions">
      <sku-actions
        :activity-type="activityType"
        @click="handleBtnClick"
      />
    </template>
  </van-sku>
</template>

<script>
import { Sku } from 'vant';
import mapKeysToCamelCase from '@youzan/utils/string/mapKeysToCamelCase';
import { mapState } from 'vuex';

import store from './store';

import Header from './components/header';
import Actions from './components/actions';
import Address from './components/address';
import Service from './components/service';
import Time from './components/time';

const extraComponents = {
  'sku-address': Address,
  'sku-service': Service,
  'sku-time': Time,
};

export default {
  name: 'ump-sku',

  store,

  components: {
    'van-sku': Sku,
    'sku-header': Header,
    'sku-actions': Actions,
    ...extraComponents,
  },

  props: {
    alias: {
      type: String,
      default: '',
    },

    value: {
      type: Boolean,
      required: true,
    },
    proxyListeners: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      componentKeys: Object.keys(extraComponents),
      sku: {},
    };
  },

  computed: {
    ...mapState(['activityType', 'formatSku', 'formatSelectedSku']),
  },

  methods: {
    handleSkuSelected: ({ selectedSkuComb }) => {
      // this.$emit('setSelectedSku', mapKeysToCamelCase(selectedSkuComb));
      store.commit('setSelectedSku', mapKeysToCamelCase(selectedSkuComb));
    },

    handleBtnClick(selectedSku) {
      this.$emit('resolve', selectedSku);
    },
  },

};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.extra {
  margin: 0 16px;

  .extra-item {
    position: relative;

    &::after {
      @include border-retina(bottom, $light-border-color);
    }

    &:last-child::after {
      @include border-retina(bottom, transparent);
    }
  }
}
</style>

<style lang="scss"> // eslint-disable-line vue-scoped-css/require-scoped
.van-sku-group-container {
  margin: 0 16px;
}
</style>
