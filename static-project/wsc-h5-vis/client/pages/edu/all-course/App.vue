<template>
  <vis-page-container>
    <div
      v-if="fetched"
      class="all-course"
    >
      <div
        v-if="!noData"
        v-waterfall-lower="getAllCourse"
        class="all-course__list list"
        waterfall-offset="300"
        waterfall-disabled="isWaterfallDisabled"
      >
        <course-item
          v-for="item in list"
          :key="item.alias"
          :url="item.shortenUrl"
          :cover-url="item.coverUrl"
          :title="item.title"
          :desc="item.desc"
          :tags="item.tags"
          :start-date="item.startDate"
          :end-date="item.endDate"
          :price="item.price"
          :students-count="item.studentsCount"
          :is-vip-discount="item.isVipDiscount"
        />
        <van-loading
          v-if="isLoading"
          type="circle"
        />
      </div>
      <template v-else>
        <slot />
      </template>
    </div>
  </vis-page-container>
</template>

<script>
import PageContainer from '../components/page-container';
import makeDateStr from '@youzan/utils/date/makeDateStr';
import ajax from 'captain-ajax';
import { Loading } from 'vant';
import Waterfall from '@vant/waterfall';
import { CourseItem } from '@youzan/vis-ui';

import '@youzan/vis-ui/lib/course-item/index.css';

export default {

  name: 'all-course',

  directives: {
    WaterfallLower: Waterfall('lower'),
  },

  components: {
    'vis-page-container': PageContainer,
    CourseItem,
    'van-loading': Loading,
  },

  data() {
    return {
      fetched: false,
      list: [],
      noData: false,
      noMore: false,
      total: 0,
      current: 0,
      next: 1,
      size: 10,
      isWaterfallDisabled: true,
      // 是否在加载更多
      isLoading: false,
      kdtId: window._global.kdt_id,
    };
  },

  created() {
    document.title = '全部线下课';

    this.getAllCourse();
  },

  methods: {
    getAllCourse() {
      if (this.isWaterfallDisabled && this.fetched) return;

      this.isWaterfallDisabled = true;
      this.isLoading = true;
      const page = this.next;

      ajax({
        url: '/wscvis/edu/course-v2/findPageForWym.json',
        data: {
          pageNumber: this.next,
          pageSize: this.size,
        },
      })
        .then(res => {
          if (res.code === 0 && res.data) {
            this.list = this.list.concat((res.data.content || []).map(item => {
              const isVipDiscount = !!(item.buyStatus && item.buyStatus.isVipDiscount);
              const price = (isVipDiscount ? item.buyStatus.price : item.price) / 100 || 0;
              return {
                ...item,
                url: `https://h5.youzan.com/wscvis/edu/prod-detail?alias=${item.alias}&kdt_id=${item.kdtId}`,
                coverUrl: (item.pictureWrapDTO && item.pictureWrapDTO.url) || '',
                title: item.title,
                desc: item.sellPoint,
                tags: (item.tagList || []).map(tagObj => tagObj.tag),
                startDate: item.courseStartAt ? makeDateStr(item.courseStartAt) : '',
                endDate: item.courseEndAt ? makeDateStr(item.courseEndAt) : '',
                isVipDiscount,
                price,
                studentsCount: item.totalSoldNum || 0,
              };
            }));
            this.current = page;
            this.next = page + 1;
            if (res.data.total <= this.list.length) {
              this.noMore = true;
            }
            this.isWaterfallDisabled = this.noMore;
          } else {
            this.isWaterfallDisabled = true;
          }
          this.fetched = true;
          this.isLoading = false;
        })
        .catch(err => {
          this.fetched = true;
          this.isWaterfallDisabled = true;
          this.isLoading = false;
          console.warn(err.msg);
        });
    },
  },
};
</script>

<style lang="scss">
.all-course {
  padding: 0 0 20px;
  background: #fff;

  .van-loading {
    margin: 0 auto;
  }
}
</style>
