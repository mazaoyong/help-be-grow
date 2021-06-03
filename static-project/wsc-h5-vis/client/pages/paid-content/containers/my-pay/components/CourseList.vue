<template>
  <div :class="[`${prefix}`]">
    <div v-if="!noData" :class="[`${prefix}__list`]">
      <van-list
        v-model="isLoading"
        :loading="isOnLoad"
        :finished="isFinished"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoadMoreCourse"
      >
        <p v-if="ongoingData.length > 0" class="course__list-sub">
          进行中
        </p>
        <course-item
          v-for="(item, index) in ongoingData"
          :key="`ongoing${index}`"
          :item="item"
          :is-bottom-line="index != ongoingData.length - 1"
        />
        <p v-if="unstartData.length > 0" class="course__list-sub">
          未开始
        </p>
        <course-item
          v-for="(item, index) in unstartData"
          :key="`unstart${index}`"
          :item="item"
          :is-bottom-line="index != unstartData.length - 1"
        />
        <p v-if="endData.length > 0" class="course__list-sub">
          已学完
        </p>
        <course-item
          v-for="(item, index) in endData"
          :key="`end${index}`"
          :item="item"
          :is-bottom-line="index != endData.length - 1"
        />
        <p v-if="refundData.length > 0" class="course__list-sub">
          已退课
        </p>
        <course-item
          v-for="(item, index) in refundData"
          :key="`refund${index}`"
          :item="item"
          :is-bottom-line="index != refundData.length - 1"
        />
      </van-list>
    </div>
    <template v-else>
      <slot />
    </template>
  </div>
</template>

<script>
import Vue from 'vue';
import { Lazyload, List, Toast } from 'vant';
import format from 'date-fns/format';
import api from 'pct/api/index.js';
import CourseItem from './CourseItem';

Vue.use(Lazyload);
Vue.use(List);

export default {
  name: 'course-list',

  components: {
    CourseItem,
  },

  data() {
    return {
      prefix: 'course',
      data: [],
      total: 0,
      totalPages: 1,
      pageNumber: 1,
      pageSize: 10,
      isLoading: false,
      isFinished: false,
      isOnLoad: false,
      error: false,
    };
  },

  computed: {
    noData() {
      return this.data.length < 1;
    },
    // 根据status（1-已学完、2-未开始、3-进行中）对data进行filter操作
    unstartData() {
      return this.data.filter((value, index) => {
        return value.eduCourseLittleDTO.eduCourseState === 2;
      });
    },
    ongoingData() {
      return this.data.filter((value, index) => {
        return value.eduCourseLittleDTO.eduCourseState === 3;
      });
    },
    endData() {
      return this.data.filter((value, index) => {
        return value.eduCourseLittleDTO.eduCourseState === 1;
      });
    },
    refundData() {
      return this.data.filter((value, index) => {
        return value.eduCourseLittleDTO.eduCourseState === 4;
      });
    },
  },

  created() {
    this.onLoadMoreCourse();
  },

  methods: {
    onLoadMoreCourse() {
      if (!this.isOnLoad) this.fetchData();
    },

    fetchData() {
      this.isOnLoad = true;
      api.findPageStuSchedule({
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
      })
        .then((data) => {
          this.data = this.data.concat(data.content);
          this.total = data.total;
          this.totalPages = data.totalPages;
          console.log(this.pageNumber, this.totalPages);
          // 分页逻辑
          if (this.pageNumber >= data.totalPages) {
            this.isFinished = true;
          }
          this.pageNumber = this.pageNumber + 1;
          this.isOnLoad = false;
          this.isLoading = false;
        })
        .catch(msg => {
          console.log(msg);
          Toast(msg);
          this.isLoading = false;
          this.isOnLoad = false;
          this.error = true;
        });
    },

    getTime(timeStamp) {
      return format(timeStamp, 'YYYY-MM-DD');
    },
  },
};
</script>

<style lang="scss">
.course {

  &__list {

    .loading-wrap {
      padding: 10px;
    }

    .van-loading {
      margin: 0 auto;
    }

    &-sub {
      line-height: 17px;
      font-size: 12px;
      color: #969799;
      margin-top: 16px;
      margin-bottom: 10px;
      padding-left: 15px;
    }
  }
}
</style>
