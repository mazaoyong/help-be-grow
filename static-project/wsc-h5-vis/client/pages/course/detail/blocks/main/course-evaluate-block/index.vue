<template>
  <info-block
    v-log.inner="log"
    class="course-evaluate-block"
    :title="`课程评价(${count})`"
    :has-more="hasEvaluate"
    :url="hasEvaluate ? url : ''"
  >
    <evaluation-item
      v-if="hasEvaluate"
      :evaluation="data"
      :content-style="'ellipsis'"
      :mode="0"
    />
    <div v-else class="no-evaluation">
      暂无课程评价
    </div>
  </info-block>
</template>

<script>
import rootStore from '@/pages/course/detail/store';
import InfoBlock from '@/pages/course/detail/components/info-block';
// 使用评价页面的组件
import EvaluationItem from '@/pages/edu/components/evaluation-item';
import storeName from './name';
import store from './store';

rootStore.registerModule(storeName, store);

export default {
  storeName,

  components: {
    InfoBlock,
    EvaluationItem,
  },

  state: ['count', 'data'],
  getters: ['url'],

  computed: {
    hasEvaluate() {
      return this.count > 0;
    },

    log() {
      if (this.hasEvaluate) {
        return {
          '.head': ['click_all_evaluate', '点击查看全部评价'],
        };
      }
      return null;
    },
  },

  created() {
    this.$dispatch('initEvaluate');
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.course-evaluate-block {
  margin-bottom: 8px;
}

.no-evaluation {
  padding-left: 16px;
  font-size: 13px;
  line-height: 42px;
  color: $disabled-color;
}
</style>
