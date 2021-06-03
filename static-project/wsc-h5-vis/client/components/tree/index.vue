<template>
  <div class="vis-tree" role="tree">
    <tree-node
      v-for="item in data"
      :id="item.id"
      :key="item.id"
      :load-request="loadRequest"
      :label="item.label"
      :children="item.children"
      :lazy-load="item.lazyLoad"
      :title="item.title"
      :is-leaf="item.isLeaf"
      :extra="item.extra"
      :disabled="item.disabled"
    >
      <template slot-scope="nodeData">
        <slot v-bind="nodeData">
          <default-node v-bind="nodeData" />
        </slot>
      </template>
    </tree-node>
  </div>
</template>

<script>
import TreeNode from './TreeNode';
import DefaultNode from './DefaultNode';
export { DefaultNode };

export default {
  name: 'vis-tree',
  components: {
    TreeNode,
    DefaultNode,
  },

  props: {
    loadRequest: {
      type: Function,
      default: () => () => Promise.reject(),
    },
    data: {
      type: Array,
      default() {
        return [];
      },
    },
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {},

  methods: {},
};
</script>

<style scoped lang="scss">
.vis-tree {
  padding: 0 12px;
}
</style>
