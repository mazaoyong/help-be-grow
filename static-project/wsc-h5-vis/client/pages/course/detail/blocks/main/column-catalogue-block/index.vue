<template>
  <info-block
    v-tab="tab"
    class="column-catalogue-block"
    :title="title"
  >
    <span
      v-if="sortTypeToggleButtonVisible"
      slot="title-right"
      class="sort"
      @click="$rootDispatch('toggleSortType')"
    >
      <vis-icon
        class="sort-icon"
        size="14px"
        :name="sortType === 'desc' ? 'reverseorder' : 'positivesequence'"
      />
      {{ sortType === 'desc' ? '倒序' : '正序' }}
    </span>
    <next ref="next" />
    <fallback-list v-if="isFXColumn" ref="list" />
    <chapters v-else ref="chapters" />
  </info-block>
</template>

<script>
import { Icon } from '@youzan/vis-ui';
import rootStore from '@/pages/course/detail/store';
import InfoBlock from '@/pages/course/detail/components/info-block';
import Next from './components/next';
// import List from './components/list';
import Chapters from './components/chapters';
import FallbackList from './components/fallback-list';
import storeName from './name';
import store from './store';
import { GOODS_TYPE } from '../../../../../../constants/course/goodsType';

rootStore.registerModule(storeName, store);

export default {
  storeName,

  components: {
    'vis-icon': Icon,
    InfoBlock,
    Next,
    // List,
    Chapters,
    FallbackList,
  },

  state: ['total', 'hasCustomChapters', 'sortTypeToggleButtonVisible'],
  rootState: ['goodsData', 'sortType', 'columnFreeContentCount', 'goodsType'],

  computed: {
    title() {
      const { hasCustomChapters, total } = this;
      if (total > 0) {
        return `全部内容（${total}）`;
      }
      // 有目录且专栏为空的时候，不显示全部内容。
      return hasCustomChapters ? '全部内容' : '';
    },
    tab() {
      const tab = {
        index: 2,
        title: '专栏目录',
        onShow: () => {
          if (this.isFXColumn) {
            this.$refs.list.check();
          } else {
            this.$refs.chapters.init();
          }
          this.$refs.next.useSticky();
        },
        onHide: () => {
          this.$refs.next.noSticky();
        },
      };
      // 有免费试看内容且未购买的时候，显示「试看」标签。
      if (this.columnFreeContentCount && !this.goodsData.isOwnAsset) {
        tab.tag = '试看';
      }
      return tab;
    },
    isFXColumn() {
      return this.goodsType === GOODS_TYPE.FX_COLUMN;
    },
  },

  created() {
    // 读取缓存的排序类型
    this.$rootDispatch('initSortType');
    // 读取缓存的内容阅读进度
    this.$rootDispatch('initContentProgress');
    // 读取缓存的专栏学习进度
    this.$rootDispatch('initColumnProgress');
    /** @deprecated 读取最后一页的缓存弃用 */
    this.$dispatch('initLastPage');
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.column-catalogue-block {
  margin-bottom: 8px;
  line-height: 14px;

  .sort {
    font-size: 12px;
    color: $vice-text-color;
  }

  .sort-icon {
    display: inline-block;
    vertical-align: text-top;
  }
}
</style>
