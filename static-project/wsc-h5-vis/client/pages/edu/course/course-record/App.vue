<template>
  <vis-page-container>
    <div
      v-if="!noData"
      class="course-record"
    >
      <p class="record-total">
        累计上课：{{ total }}次
      </p>
      <van-list
        v-model="isLoading"
        :loading="isOnLoad"
        :finished="isFinished"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoadMore"
      >
        <lesson-item
          v-for="(item, index) in lessonRecords"
          :key="index"
          :tag-status="tagText(item.lessonState)"
          :start-time="Number(item.startTime)"
          :end-time="Number(item.endTime)"
          :classroom-name="item.classroomName"
          :consume-course-time="item.consumeCourseTime"
          :sign-in-operator="item.signInOperator"
        />
      </van-list>
    </div>
    <div
      v-else
      class="no-course--padding"
    >
      <no-course :desc="'暂无上课记录'" />
    </div>
  </vis-page-container>
</template>
<script>
import { Toast, List } from 'vant';
import Args from 'zan-utils/url/args';
import PageContainer from '../../components/page-container';
import LessonItem from './components/LessonItem';
import NoCourse from '../../components/no-course';
import { findPageLessonRecordV2 } from '../api.js';

export default {
  name: 'course-record',

  components: {
    'vis-page-container': PageContainer,
    'van-list': List,
    LessonItem,
    NoCourse,
  },

  props: {
  },

  data() {
    return {
      total: 0,
      totalPages: 1,
      lessonRecords: [],
      isLoading: false,
      isFinished: false,
      pageNumber: 1,
      pageSize: 10,
      isOnLoad: false,
      error: false,
    };
  },

  computed: {
    noData() {
      return this.lessonRecords.length < 1;
    },
  },

  created() {
    document.title = '上课记录';
    this.onLoadMore();
  },

  methods: {
    tagText(state) {
      switch (Number(state)) {
        case 0:
          return '待签到';
        case 1:
          return '已签到';
        case 2:
          return '请假';
        case 3:
          return '未到';
        default:
          return '';
      }
    },

    onLoadMore() {
      if (!this.isOnLoad) this.fetchData();
    },

    fetchData() {
      this.isOnLoad = true;
      findPageLessonRecordV2({
        studentId: Args.get('studentId'),
        assetNo: Args.get('assetNo'),
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
      })
        .then((data) => {
          this.lessonRecords = this.lessonRecords.concat(data.content);
          this.total = data.total;
          this.totalPages = data.totalPages;
          // 分页逻辑
          if (this.pageNumber >= this.totalPages) {
            this.isFinished = true;
          }
          this.pageNumber = this.pageNumber + 1;
          this.isLoading = false;
          this.isOnLoad = false;
        })
        .catch(msg => {
          this.isLoading = false;
          this.isOnLoad = false;
          this.error = true;
          Toast(msg);
        });
    },
  },
};
</script>
<style lang="scss">
.course-record {
  padding: 0 10px;

  .record-total {
    font-size: 12px;
    color: #969799;
    line-height: 17px;
    padding: 15px 6px 10px;
  }
}

.no-course--padding {
  padding-top: 130px;
}
</style>
