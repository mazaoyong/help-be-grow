<template>
  <div class="promotion-info">
    <vis-card extend-style="padding: 0 12px;">
      <vis-label
        left-content="赠品"
        extend-left-style="font-size: 14px; font-weight: bold; color: #111;"
      />
      <template
        v-for="(pro, index) in promotionInfo"
      >
        <vis-label
          :key="index"
          show-arrow
          extend-left-style="width: 100px;"
          no-right
          @click="onShowPromotionModal()"
        >
          <template slot="left-content">
            <van-tag
              plain
            >
              {{ pro.tags }}
            </van-tag>
          </template>
          <template slot="right-content">
            <span class="des">
              {{ pro.descriptions }}
            </span>
          </template>
        </vis-label>
      </template>
    </vis-card>

    <!-- 促销弹窗 -->
    <promotion-pop
      v-model="isShowPromotionPop"
      :promotion-info="promotionInfo"
    />
  </div>
</template>

<script>
import { Tag } from 'vant';
import Card from '../../../components/card';
import Label from '../../../components/label';
import PromotionPop from './components/PromotionPop';

export default {
  name: 'promotion-info',

  components: {
    'van-tag': Tag,
    'vis-card': Card,
    'vis-label': Label,
    PromotionPop,
  },

  props: {
    promotionInfo: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },

  data() {
    return {
      isShowPromotionPop: false,
    };
  },

  methods: {
    onShowPromotionModal() {
      this.isShowPromotionPop = true;
    },
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';

.promotion-info {
  .vis-label-left {
    width: auto !important;
  }

  .des {
    padding-right: 30px;

    @include multi-ellipsis(1);
  }
}
</style>
