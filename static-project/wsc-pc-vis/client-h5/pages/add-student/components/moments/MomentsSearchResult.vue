<template>
  <div class="moments-search-result">
    <div
      v-if="pageFrom === 'moments'"
      class="moments-search-result__caption"
    >
      {{ caption }}
    </div>
    <van-list
      v-model="isComputedLoading"
      :finished="isComputedFinished"
      finished-text=""
      @load="onLoad"
    >
      <search-result-item
        v-for="stu in studentList"
        :key="stu.assetNo"
        class="moments-search-result__item"
        :is-selected="selectedStudentAssets.includes(stu.assetNo)"
        @select="onStudentSelected(stu)"
        @unselect="onStudentUnselected(stu)"
      >
        <moments-student-item
          :student-name="stu.name"
          :student-avator="stu.avator"
          :status-text="stu.statusText"
          :student="stu"
        />
      </search-result-item>
    </van-list>
  </div>
</template>

<script>
import { List } from 'vant';
import Args from 'zan-utils/url/args';
import SearchResultItem from '../SearchResultItem';
import MomentsStudentItem from './MomentsStudentItem';

export default {
  name: 'moments-search-result',

  components: {
    'van-list': List,
    SearchResultItem,
    MomentsStudentItem,
  },

  props: {
    isLoading: Boolean,
    isFinished: Boolean,
    studentList: {
      type: Array,
      default: () => [],
    },
    selectedStudentAssets: {
      type: Array,
      default: () => [],
    },
    courseTitle: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      isComputedLoading: this.isLoading,
      isComputedFinished: this.isFinished,
      pageFrom: Args.get('pageFrom'),
    };
  },

  computed: {
    caption() {
      return `所有学员`;
    },
  },

  watch: {
    isLoading(val) {
      this.isComputedLoading = val;
    },
    isFinished(val) {
      this.isComputedFinished = val;
    },
  },

  methods: {
    onLoad() {
      this.$emit('load');
    },

    onStudentSelected(stu) {
      this.$emit('select', stu);
    },

    onStudentUnselected(stu) {
      this.$emit('unselect', stu);
    },
  },
};
</script>

<style lang="postcss">
.moments-search-result {
  margin: 10px 0;
  padding: 0 15px;
  background: #fff;
  border-radius: 4px;

  &__caption {
    line-height: 48px;
    font-size: 13px;
    color: #323233;
  }

  &__item {
    border-top: 0 solid #ebedf0 !important;

    .search-result-item__aside {
      display: flex;
      align-items: center;
    }
  }
}
</style>
