<template>
  <div>
    <tree v-if="ready" :data="treeData" :load-request="chapterLoadRequest">
      <template slot-scope="nodeData">
        <content-list
          v-if="nodeData.isLeaf"
          :has-custom-chapters="hasCustomChapters"
          :has-content="nodeData.extra.hasContent"
          :chapter-id="nodeData.extra.chapterId"
          :visible="nodeData.visible"
          :style="{marginLeft: `${-12 + (nodeData.level - 1) * 8}px`}"
        />
        <!-- <custom-node v-if="nodeData.isLeaf" /> -->
        <default-node v-else v-bind="nodeData" />
      </template>
    </tree>
    <div v-else class="chapters-loading">
      <van-loading type="spinner">
        正在加载专栏目录...
      </van-loading>
    </div>
    <template v-if="showDefaultChapterContents">
      <content-list
        has-content
        :has-custom-chapters="hasCustomChapters"
        :chapter-id="defaultChapterId"
        visible
      />
    </template>
  </div>
</template>
<script>

import { Loading } from 'vant';

import Tree, { DefaultNode } from '@/components/tree';
// import CustomNode from '@/components/tree/CustomNode';

import { fetchChapters, buildTreeData } from './utils';

import ContentList from '../content-list';
// import storeName from '../../name';

export default {
  name: 'chapters',
  // storeName,
  components: {
    Tree,
    DefaultNode,
    ContentList,
    'van-loading': Loading,
    // CustomNode,
  },

  props: {
    hasCustomChapters: {
      type: Boolean,
      default: false,
    },

  },
  data: () => ({
    ready: false,
    treeData: [],
    defaultChapterId: 0,
    showDefaultChapterContents: false,
  }),

  rootState: ['goodsData'],

  mounted() {
    const { column: { alias } = {} } = this.goodsData;
    // this.goodsData.column.alias
    fetchChapters(alias)
      .then((list) => {
        if (list.length > 1) {
          // this.$commit('SET_HAS_CUSTOM_CHAPTERS', true);
          this.$emit('onHasCustomChaptersChange', true);
        }
        const total = list.reduce((acc, cur) => acc + cur.contentCount, 0);
        // this.$commit('SET_CONTENT_TOTAL_COUNT', total);
        this.$emit('onTotalChange', total);
        const defaultChapter = list.find((item) => item.isDefaultChapter);
        if (defaultChapter && defaultChapter.hasContent) {
          this.defaultChapterId = defaultChapter.id;
          this.showDefaultChapterContents = true;
        }
        return list.filter((item) => !item.isDefaultChapter);
      })
      .then((rest) => {
        this.treeData = rest.map(buildTreeData);
        this.ready = true;
      });
  },

  methods: {
    chapterLoadRequest(nodeData) {
      const { id } = nodeData || {};
      const { alias } = this.goodsData.column;
      return fetchChapters(alias, id).then((list) => list.map(buildTreeData));
    },
  },
};
</script>
<style lang="scss" scoped>
.chapters-loading {
  height: 100px;
  display: flex;
  align-content: center;
  justify-content: center;
}
</style>
