<template>
  <div
    v-if="studentList.length"
    class="moments-search-result"
  >
    <div class="moments-search-result__caption">
      {{ caption }}
    </div>
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
  </div>
</template>

<script>
import { Toast } from 'vant';
import SearchResultItem from '../SearchResultItem';
import MomentsStudentItem from './MomentsStudentItem';

import apis from '../../../../pages-api/add-student';

export default {
  name: 'moments-reviewed-result',

  components: {
    SearchResultItem,
    MomentsStudentItem,
  },

  props: {
    selectedStudentAssets: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      studentList: [],
    };
  },

  computed: {
    caption() {
      return `近期点评过的学员`;
    },
  },

  watch: {
  },

  mounted() {
    this.fetchRecentlyStudents();
  },

  methods: {
    onStudentSelected(stu) {
      this.$emit('select', stu);
    },

    onStudentUnselected(stu) {
      this.$emit('unselect', stu);
    },

    fetchRecentlyStudents() {
      apis
        .findRecentReviewedStudents()
        .then(res => {
          const list = res;
          this.studentList = [
            ...list.map(stu => {
              return {
                assetNo: stu.studentId,
                id: stu.studentId,
                name: stu.studentName,
                avator: stu.avatar || 'https://b.yzcdn.cn/public_files/2019/03/23/1ab34592f489f63f1552424dfcc5fbd9.png',
                phone: stu.mobile,
                time: stu.recentStudyTime,
              };
            }),
          ];
          if (this.studentList.length >= list.total) {
            this.isListFinished = true;
          }
        })
        .catch(errMsg => {
          Toast(errMsg);
        });
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
