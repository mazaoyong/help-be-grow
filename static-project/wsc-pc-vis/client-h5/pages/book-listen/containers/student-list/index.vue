<template>
  <div class="f-safeArea select-student-wrap">
    <van-search
      v-model="keyword"
      placeholder="请输入学员姓名或手机号"
      show-action
      shape="round"
      @search="onSearch"
      @cancel="onCancel"
    />

    <van-list
      v-model="isLoading"
      class="select-student-wrap__list"
      :finished="finished"
      @load="fetchStudents"
    >
      <template v-if="students.length > 0">
        <student-item
          v-for="item in students"
          :key="item.student.id"
          :name="item.student.name"
          :student-id="item.student.id"
          :mobile="item.student.mobile"
          :avatar="item.student.avatar"
          :selected-id="selectedId"
          @selectStu="onSelectStu"
        />
      </template>
      <div
        v-else
        class="select-student-wrap__list-empty"
      >
        <img
          class="img"
          src="https://b.yzcdn.cn/public_files/2018/11/19/bfc666f3eb05081b88d7353f43e18123.png"
        >
        <p>暂无学员</p>
      </div>
    </van-list>
  </div>
</template>

<script>
import { Search, List } from 'vant';
import StudentItem from './components/StudentItem';

export default {
  name: 'select-student',

  components: {
    'van-search': Search,
    'van-list': List,
    StudentItem,
  },

  data() {
    return {
      keyword: '',
      pageNumber: 1,
      pageSize: 10,
      students: [],
      selectedId: 0,
      isLoading: false,
      finished: false,
    };
  },

  created() {
    const selectedStu = this.$store.getters['selectedStu'] || {};
    this.selectedId = selectedStu.id;
  },

  methods: {
    fetchStudents() {
      const filter = {
        keyword: this.keyword,
      };

      const pageRequest = {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
      };

      this.$store.dispatch('fetchStudents', { filter, pageRequest })
        .then((res = {}) => {
          const content = res.content;
          const total = res.total;
          this.students = this.students.concat(content);
          this.isLoading = false;
          if (this.students.length < total && content.length > 0) {
            this.pageNumber++;
          } else {
            this.finished = true;
          }
        });
    },

    onSearch() {
      this.pageNumber = 1;
      this.students = [];
      this.fetchStudents();
    },

    onCancel() {
      // this.$emit('cancel');
      // this.$router.replace({ path: 'book-detail' });
      this.$router.go(-1);
    },

    onSelectStu(studentId) {
      this.selectedId = studentId;
      this.students.forEach(item => {
        if (item.student.id === studentId) {
          // this.$emit('selectedStu', item.student);
          this.$store.dispatch('updateSelectedStu', item.student);
          // this.$router.replace({ path: 'book-detail' });
          this.$router.go(-1);
        }
      });
    },
  },
};
</script>

<style lang="postcss">
.select-student-wrap {
  background-color: #f2f2f7;

  &__list {
    min-height: 100vh;
    margin: 10px 10px  0;
    border-radius: 4px;
    background-color: #fff;

    &-empty {
      padding-top: 80px;
      text-align: center;
      font-size: 14px;
      color: #999;

      .img {
        width: 100px;
        height: 100px;
        margin-bottom: 5px;
      }
    }
  }
}
</style>
