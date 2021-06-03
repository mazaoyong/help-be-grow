<template>
  <info-block
    v-if="nextInfo.alias"
    v-log="['click_next_all', '下一篇内容点击全部']"
    class="next-content-block"
    title="下一篇"
    :url="url"
    :has-more="!!url"
  >
    <goods-card
      v-log="['click_next_content', '点击下一篇内容']"
      :alias="nextInfo.alias"
      :media-type="nextInfo.mediaType"
      :img="nextInfo.cover"
      :title="nextInfo.title"
    >
      <span v-if="nextInfo.summary" class="summary">
        {{ nextInfo.summary }}
      </span>
    </goods-card>
  </info-block>
</template>

<script>
import GoodsCard from '@/components/goods-card';
import InfoBlock from '@/pages/course/detail/components/info-block';

export default {
  components: {
    GoodsCard,
    InfoBlock,
  },

  rootState: ['goodsData', 'kdtId', 'sortType'],

  computed: {
    url() {
      const { alias } = this.goodsData.column;
      if (alias) {
        return `/wscvis/course/detail/${alias}?kdt_id=${this.kdtId}`;
      }
      return '';
    },

    nextInfo() {
      return this.goodsData.nextOwlInfo;
    },
  },

  watch: {
    'goodsData.alias': {
      immediate: true,
      handler(alias) {
        const { isOwnAsset, column = {} } = this.goodsData;

        // 关联了专栏 & 已拥有 的内容
        // 请求下一篇内容信息
        if (!!column.alias && isOwnAsset && alias) {
          this.$store.dispatch('fetchNextInfo');
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.next-content-block {
  margin-bottom: 8px;

  .summary {
    @include ellipsis;

    display: block;
  }
}
</style>
