<template>
  <!--     :style="style" -->
  <div
    class="vis-tree-node"
    :class="{
      'vis-tree-node-open': childrenVisible,
      'show-border': level === 0,
    }"
  >
    <div
      class="vis-tree-node__body"
      :class="[{ clickable: clickable }]"
      :role="isLeaf ? 'button' : ''"
      @click="handleClickNode(slotProps)"
    >
      <section class="vis-tree-node__body-content">
        <slot v-bind="slotProps" />
      </section>
      <aside v-if="!isLeaf" class="vis-tree-node__body-aside">
        <van-loading v-if="loading" size="18" />
        <span
          v-else
          class="vis-tree-node__body-aside_icon"
          :style="{ transform: `rotate(${childrenVisible ? '-' : ''}90deg)` }"
        >
          <vis-icon name="arrow" />
        </span>
      </aside>
    </div>

    <template v-if="!isLeaf">
      <tree-node
        v-for="item in childrenData"
        v-show="childrenVisible"
        :id="item.id"
        :key="item.id"
        :visible="childrenVisible"
        :lazy-load="item.lazyLoad"
        :is-leaf="item.isLeaf"
        :level="level + 1"
        :label="item.label"
        :extra="item.extra"
        :children="item.children"
        :title="item.title"
        :load-request="loadRequest"
        @close="toggleChildrenVisible(false)"
      >
        <template slot-scope="nodeData">
          <slot v-bind="nodeData" />
        </template>
      </tree-node>
    </template>
  </div>
</template>

<script>
import { Toast, Loading } from 'vant';
// import Icon from '../../icon/index.js';
import { Icon } from '@youzan/vis-ui';
// import CustomNode from './customNode';

export default {
  name: 'tree-node',
  components: {
    // CustomNode,
    'vis-icon': Icon,
    'van-loading': Loading,
  },
  props: {
    loadRequest: {
      type: Function,
      default: () => () => Promise.reject(),
    },
    /** 是否是叶子结点 */
    isLeaf: {
      type: Boolean,
      default: false,
    },
    /** 是否是叶子结点 */
    lazyLoad: {
      type: Boolean,
      default: false,
    },
    /** 是否金庸 */
    disabled: {
      type: Boolean,
      default: false,
    },
    /** 等级 */
    level: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: 'tree node',
    },
    id: {
      type: [String, Number],
      default: 'tree node',
    },
    /** 额外数据 */
    extra: {
      type: Object,
      default: () => ({}),
    },
    children: {
      type: Array,
      default: () => [],
    },
    visible: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      childrenVisible: false,
      loading: false,
      lazyChildren: [],
      loaded: false,
    };
  },
  componentName: 'TreeNode',
  computed: {
    childrenData() {
      if (this.lazyLoad) {
        return this.lazyChildren;
      }
      return this.children;
    },
    slotProps() {
      return {
        id: this.id,
        level: this.level,
        label: this.label,
        extra: this.extra,
        title: this.title,
        isLeaf: this.isLeaf,
        visible: this.visible,
        disabled: this.disabled,
        close: () => {
          this.$emit('close');
        },
      };
    },
    style() {
      return {
        paddingLeft: this.level === 0 ? 0 : '8px',
      };
    },
    clickable() {
      return !(this.isLeaf || this.disabled);
    },
  },
  methods: {
    toggleChildrenVisible(v) {
      this.childrenVisible = v;
    },
    toggleChildren() {
      this.childrenVisible = !this.childrenVisible;
    },
    handleClickNode(payload) {
      if (!this.clickable) {
        return;
      }

      // 非懒加载或者加载过了
      if (!this.lazyLoad || this.loaded) {
        this.toggleChildren();
        return;
      }

      // 防止重复请求
      if (this.loading) {
        return;
      }

      this.loading = true;
      this.loadRequest(payload)
        .then((data) => {
          this.lazyChildren.push(...data);
          this.loaded = true;
          this.childrenVisible = true;
        })
        .catch((err) => {
          Toast(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.vis-tree-node {
  background: #ffffff;
  &__body {
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    &.clickable {
      &:active {
        background-color: #f2f3f5;
      }
    }

    &-content {
      flex: 1;
      overflow: hidden;
    }

    &-aside {
      margin-left: 16px;
      margin-right: 4px;
      flex: 0 0 18px;
      &_icon {
        display: inline-block;
        width: 18px;
        height: 18px;
        font-size: 18px;
        font-weight: bolder;
        will-change: transform;
        transition: all 200ms ease;
      }
    }
  }
  & + & {
    &.show-border {
      position: relative;
      &::after {
        /* position: absolute;
        content: ' ';
        pointer-events: none;
        top: 0;
        right: 12px;
        left: 12px;
        border: 0 solid #ebedf0;
        border-top-width: 1px; */
        position: absolute;
        box-sizing: border-box;
        content: ' ';
        pointer-events: none;
        top: -50%;
        right: -50%;
        bottom: -50%;
        left: -50%;
        border: 0 solid #ebedf0;
        transform: scale(0.5);
        border-top-width: 1px;
      }
    }
  }
}
@keyframes spin {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
