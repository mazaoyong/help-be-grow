<template>
  <div class="course-list--wrap">
    <van-list
      v-if="itemList.length > 0"
      v-model="isLoading"
      :finished="isFinished"
      @load="onLoadMore"
    >
      <course-item
        v-for="(item, index) in itemList"
        :key="index"
        :item="item"
        class="list-item"
      />
    </van-list>
    <no-course
      v-else
      class="no-wait"
      desc="暂无待上课记录"
    />
  </div>
</template>

<script>
import { Toast, List } from 'vant';
import CourseItem from '../../../components/course-item';
import NoCourse from '../../../../components/no-course';
import { findWaitingLessonPage } from '../../../api.js';

export default {
  name: 'course-list',

  components: {
    'van-list': List,
    CourseItem,
    NoCourse,
  },

  data() {
    return {
      isLoading: false,
      isFinished: false,
      total: 0,
      pageNumber: 1,
      pageSize: 10,
      itemList: [],
      assetNo: '',
    };
  },

  created() {
    this.assetNo = this.$route.params.assetNo;
    if (this.assetNo) {
      this.onLoadMore();
    } else {
      history.go(-1);
    }
  },

  methods: {
    onLoadMore() {
      this.fetchData();
    },

    fetchData() {
      this.isLoading = true;
      findWaitingLessonPage({
        assetNo: this.assetNo,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
      })
        .then((data) => {
          this.itemList = this.itemList.concat(data.content);
          this.total = data.total;
          // 分页逻辑
          if (this.itemList.length >= this.total) {
            this.isFinished = true;
          }
          this.pageNumber = this.pageNumber + 1;
          this.isLoading = false;
        })
        .catch(msg => {
          this.isFinished = true;
          this.isLoading = false;
          Toast(msg);
        });
    },
  },
};
</script>

<style lang="scss">
.course-list--wrap {
  padding: 0 10px;

  .no-wait {
    margin-top: 130px;
  }

  .list-item {
    margin-top: 10px;
    padding-top: 10px;
    background-color: #fff;
    position: relative;
  }
}
</style>
