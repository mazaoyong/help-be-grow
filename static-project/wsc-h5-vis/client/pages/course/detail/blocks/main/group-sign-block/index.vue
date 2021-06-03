<template>
  <info-block
    v-if="data"
    class="group-sign-block"
    title="打卡"
    more-text="去打卡"
    has-more
    @click="click"
  >
    <goods-card
      :img="data.coverUrl"
      :title="data.gciName"
      @click="click"
    />
  </info-block>
</template>

<script>
import { ZNB } from '@youzan/wxsdk';
import buildUrl from '@youzan/utils/url/buildUrl';
import GoodsCard from '@/components/goods-card';
import InfoBlock from '@/pages/course/detail/components/info-block';
import { getSupportPunch } from './api';

export default {
  components: {
    GoodsCard,
    InfoBlock,
  },

  data() {
    return {
      data: null,
    };
  },

  rootState: ['env', 'goodsData', 'kdtId'],

  created() {
    this.init();
  },

  methods: {
    init() {
      if (this.goodsData.isOwnAsset && this.goodsData.column.alias) {
        getSupportPunch(this.goodsData.column.alias)
          .then(res => {
            if (res && res.bindGci) {
              this.data = res;
            }
          });
      }
    },

    click() {
      const {
        bought,
        gciAlias,
        proceedStatus,
      } = this.data;

      let h5Url = `/wscvis/supv/punch/introduction?alias=${gciAlias}&kdt_id=${this.kdtId}`;
      let weappUrl = `/packages/new-punch/introduction/index?alias=${gciAlias}`;

      if (proceedStatus === 2 && bought) {
        h5Url = `/wscvis/supv/punch/task?alias=${gciAlias}&kdt_id=${this.kdtId}`;
        weappUrl = `/packages/new-punch/task/index?alias=${gciAlias}`;
      }

      ZNB.navigate({
        url: buildUrl(h5Url, 'h5', this.kdtId),
        weappUrl,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.group-sign-block {
  margin-bottom: 8px;
}
</style>
