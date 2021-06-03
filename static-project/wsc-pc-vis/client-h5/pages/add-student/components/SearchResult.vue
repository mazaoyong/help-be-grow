<template>
  <div class="search-result">
    <div class="search-result__caption">
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
        :is-selected="selectedStudentAssets.includes(stu.assetNo)"
        :disabled="!stu.isValid ||
          (selectedStudentIds.includes(stu.id) && !selectedStudentAssets.includes(stu.assetNo))"
        @select="onStudentSelected(stu)"
        @unselect="onStudentUnselected(stu)"
      >
        <slot :option="stu" name="item">
          <student-item
            :student-name="stu.name"
            :status-text="stu.statusText"
            :check-code="stu.checkCode"
            :status-extra-text="stu.statusExtraText"
            :status="stu.status"
            :course-type="stu.courseType"
            :used-hour="stu.used"
            :valid-hour="stu.remaining"
            :valid-date="stu.validDate"
            @goToCancel="onGoToCancel(stu)"
          />
        </slot>
      </search-result-item>
    </van-list>
  </div>
</template>

<script>
import { List } from 'vant';
import SearchResultItem from './SearchResultItem';
import StudentItem from './StudentItem';

export default {
  name: 'search-result',

  components: {
    'van-list': List,
    SearchResultItem,
    StudentItem,
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
    selectedStudentIds: {
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
    };
  },

  computed: {
    caption() {
      return `以下为购买${this.courseTitle}的有效学员：`;
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

    onGoToCancel(stu) {
      this.$emit('goToCancel', stu);
    },
  },
};
</script>

<style lang="postcss">
.search-result {
  margin: 10px 0;
  padding: 0 15px;
  background: #fff;
  border-radius: 4px;

  &__caption {
    line-height: 48px;
    font-size: 13px;
    color: #323233;
    border-bottom: 1px solid #ebedf0;
  }
}
</style>
