<template>
  <div>
    <!-- 目录树（除了自定义目录） -->
    <template>
      <tree v-if="ready" :data="treeData" :load-request="chapterLoadRequest">
        <template slot-scope="nodeData">
          <content-list
            v-if="nodeData.isLeaf && nodeData.extra.hasContent"
            :chapter-id="nodeData.extra.chapterId"
            :visible="nodeData.visible"
            :sortable="false"
            need-check-view-change
            class="chapters-content-list"
            :style="{marginLeft: `${-12 + (nodeData.level - 1) * 8}px`}"
            @viewChange="(viewState, onClose) => handleViewChange(viewState, nodeData, onClose)"
          />
          <default-node v-else v-bind="nodeData" />
        </template>
      </tree>
      <!--  加载目录树时候的 Loading -->
      <div v-else class="chapters-loading">
        <van-loading type="spinner">
          正在加载专栏目录...
        </van-loading>
      </div>
      <!--   折叠按钮 -->
      <fold-button :show="showFoldButton" @close="handleClose" />
    </template>
    <!--  未分类目录的内容列表 -->
    <content-list
      v-if="showDefaultChapterContents"
      :chapter-id="defaultChapterId"
      visible
    />
    <empty v-if="showEmptyTip" message="该专栏还没有设置内容哦" />
  </div>
</template>
<script>
import { Loading } from 'vant';

import Tree, { DefaultNode } from '@/components/tree';
// import CustomNode from '@/components/tree/CustomNode';

import FoldButton from '../fold-button';

import { fetchChapters, buildTreeData } from './utils';

import ContentList from '../content-list';
import Empty from '../Empty';
import storeName from '../../name';

export default {
  name: 'chapters',
  storeName,
  components: {
    Tree,
    Empty,
    DefaultNode,
    ContentList,
    FoldButton,
    [Loading.name]: Loading,
  },
  data: () => ({
    ready: false,
    treeData: [],
    defaultChapterId: 0,
    showFoldButton: false,
    showDefaultChapterContents: false,
    hasCustomChapters: false,
  }),

  rootState: ['goodsData'],

  computed: {
    showEmptyTip() {
      return this.ready && !this.hasCustomChapters && !this.showDefaultChapterContents;
    },
  },

  methods: {
    init() {
      const { alias } = this.goodsData;
      // 获取所有的目录信息（包含自定义目录）
      fetchChapters(alias)
        .then((list) => {
          // 累加获得内容数量
          const total = list.reduce((acc, cur) => acc + cur.contentCount, 0);
          this.$commit('SET_CONTENT_TOTAL_COUNT', total);
          // 判断下未分类目录下是否有内容
          const defaultChapter = list.find((item) => item.isDefaultChapter);
          if (defaultChapter && defaultChapter.hasContent) {
            this.defaultChapterId = defaultChapter.id;
            this.showDefaultChapterContents = true;
          }
          // 未分类目录要单独展示，过滤出来
          const customChapters = list.filter((item) => !item.isDefaultChapter);
          this.hasCustomChapters = customChapters.length > 0;
          this.$commit('SET_SORT_TYPE_TOGGLE_BUTTON_VISIBILITY', customChapters.length <= 0);
          return customChapters;
        })
        .then((customChapters) => {
          // 拼装树组件需要的数据
          this.treeData = customChapters.map(buildTreeData);
          this.ready = true;
        });
    },
    chapterLoadRequest(nodeData) {
      const { id } = nodeData || {};
      const { alias } = this.goodsData;
      return fetchChapters(alias, id).then((list) => list.map(buildTreeData));
    },
    handleClose() {
      if (this._close) {
        this._close();
        this.$nextTick(() => {
          this.showFoldButton = false;
        });
      }
    },
    handleViewChange(show, nodeData, onClose) {
      if (show) {
        this.showFoldButton = true;
        this._foldButtonId = nodeData.id;
        this._close = () => {
          nodeData.close();
          onClose();
        };
      } else {
        if (this._foldButtonId === nodeData.id) {
          this.showFoldButton = false;
          this._foldButtonId = -1;
          this._close = () => {};
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.chapters-loading {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* .chapters-content-list{
  margin-left: -12px;
} */
</style>
