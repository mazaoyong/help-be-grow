<template>
  <vis-wrap
    @click="onClick"
    extend-style="padding: 0 0 0 16px;"
    extend-class="lift-nav-box"
  >
    <div>
      <vis-title-label
        :left-content="leftContent"
        :right-content="rightContent"
        :arrow="Boolean(count)"
      />
      <evaluation-item
        v-if="Boolean(count)"
        :evaluation="lastEvaluation"
        :content-style="'ellipsis'"
        :mode="0"
      />
      <div v-else class="evaluate-empty">
        暂无课程评价
      </div>
    </div>
  </vis-wrap>
</template>

<script>
import Wrap from '../wrap';
import TitleLabel from '../title-label';
import EvaluationItem from '../../../components/evaluation-item';

export default {
  name: 'evaluate',

  components: {
    'vis-wrap': Wrap,
    'vis-title-label': TitleLabel,
    EvaluationItem,
  },

  props: {
    count: {
      type: Number,
      default: 0,
    },
    lastEvaluation: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },

  computed: {
    leftContent() {
      return `课程评价 (${this.count})`;
    },
    rightContent() {
      return this.count > 0 ? '查看全部' : '';
    },
  },

  methods: {
    onClick() {
      this.$emit('click');
    },
  },
};
</script>

<style lang="scss">
.no-border {
  border: none !important;
}
.evaluation-item {
  padding-left: 0;
}
.evaluate-empty {
  line-height: 42px;
  font-size: 13px;
  color: #969799;
}
</style>
