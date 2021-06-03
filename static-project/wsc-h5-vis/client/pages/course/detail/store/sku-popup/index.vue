<template>
  <van-sku
    :value="value"
    :goods-id="alias"
    :sku="parsedSku"
    :initial-sku="parsedInitialSku"
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
      <sku-header :activity-type="activityType" :payload="payload" />
    </template>
    <template slot="extra-sku-group">
      <div class="extra">
        <component
          :is="key"
          v-for="key in componentKeys"
          :key="key"
          :activity-type="activityType"
          :payload="payload"
          class="extra-item"
        />
      </div>
    </template>
    <template slot="sku-actions">
      <sku-actions :activity-type="activityType" :payload="payload" />
    </template>
  </van-sku>
</template>

<script>
import { cloneDeep, each, get, pick } from 'lodash';
import { Sku } from 'vant';
import mapKeysToSnakeCase from '@youzan/utils/string/mapKeysToSnakeCase';
import mapKeysToCamelCase from '@youzan/utils/string/mapKeysToCamelCase';
import Header from './header';
import Actions from './actions';
import MeetReduce from './meet-reduce';
import Address from './address';
import Service from './service';
import Time from './time';
import LadderSelect from './ladder-select';
import store from '../index';

const extraComponents = {
  'sku-meet-reduce': MeetReduce,
  'sku-address': Address,
  'sku-service': Service,
  'sku-time': Time,
  'sku-ladder-select': LadderSelect,
};

export default {
  components: {
    'van-sku': Sku,
    'sku-header': Header,
    'sku-actions': Actions,
    ...extraComponents,
  },

  props: {
    activityType: {
      type: Number,
      default: 0,
    },
    // eslint-disable-next-line vue/require-prop-types
    payload: {
      default: null,
    },
    initialSku: {
      type: Object,
      default: () => ({}),
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
    };
  },

  computed: {
    alias() {
      return store.state.goodsData.alias;
    },

    parsedInitialSku() {
      let initialSku = {};
      if (this.initialSku) {
        this.parsedSku.list.forEach(sku => {
          if (sku.id === this.initialSku.id && sku.stock_num) {
            initialSku = pick(this.initialSku, ['s1', 's2', 's3', 's4', 's5']);
          }
        });
      }
      return initialSku;
    },

    parsedSku() {
      // 打开前处理 sku ，用活动库存来覆盖库存数据，实现 sku 禁用
      const list = cloneDeep(store.state.goodsData.sku.list);
      if (this.activityType) {
        const activitySkuMap = get(store, `state.activityDataMap.${this.activityType}.sku.map`, null);
        if (activitySkuMap) {
          each(list, item => {
            if (activitySkuMap[item.id]) {
              if (Number.isInteger(activitySkuMap[item.id].stockNum)) {
                item.stockNum = activitySkuMap[item.id].stockNum;
              }
              return;
            }
            item.stockNum = 0;
          });
        }
      }
      return {
        ...store.state.goodsData.sku,
        tree: mapKeysToSnakeCase(store.state.goodsData.sku.tree, true),
        list: mapKeysToSnakeCase(list, true),
      };
    },
  },

  created() {
    if (!Object.keys(this.parsedInitialSku).length) {
      store.commit('selectedSku', null);
    }
  },

  methods: {
    handleSkuSelected: ({ selectedSkuComb }) => {
      store.commit('selectedSku', mapKeysToCamelCase(selectedSkuComb));
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
