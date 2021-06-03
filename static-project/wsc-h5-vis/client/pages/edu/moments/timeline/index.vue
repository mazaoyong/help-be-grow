<template>
  <van-list
    v-model="fetchingData"
    class="moments-timeline"
    finished-text="没有更多了"
    :error.sync="error"
    :finished="isLastPage"
    @load="handleFecthNextPage"
  >
    <timeline-header />
    <div class="moments-timeline__content">
      <timeline-list
        :list="feedList"
        :delete-img="deleteImg"
        @clickItem="clickItem"
      />
    </div>
    <!-- 转介绍推广 -->
    <introduce-promotion :share-url="introduceShareUrl" />
  </van-list>
</template>

<script>
import { List } from 'vant';
import { mapState } from 'vuex';
import Args from 'zan-utils/url/args';
import * as SafeLink from '@youzan/safe-link';
import constants from './constants';
import TimelineHeader from './views/timeline-header';
import TimelineList from '@/vis-shared/views/moments/timeline';
import IntroducePromotion from '@/components/introduce-promotion';

export default {
  name: 'timeline',
  components: {
    'van-list': List,
    'timeline-header': TimelineHeader,
    'timeline-list': TimelineList,
    IntroducePromotion,
  },

  data() {
    return {
      error: false,
      isLastPage: false,
      fetchingData: true,
      // 转介绍分享链接
      introduceShareUrl: Args.add(location.href, { from: 'moments_feeds' }),
    };
  },

  computed: {
    ...mapState(['feedList', 'pageNumber', 'totalPages']),
    deleteImg() {
      return constants.STATIC_ASSETS.deleteImg;
    },
  },

  mounted() {
    this.$store
      .dispatch('fetchFeedList')
      .finally(() => (this.fetchingData = false));
  },

  methods: {
    clickItem(feed) {
      SafeLink.redirect({
        url: `/wscvis/edu/moments/feeds/detail/${feed.postId}?kdt_id=${feed.kdtId}`,
        kdtId: feed.kdtId,
      });
    },

    handleFecthNextPage() {
      const canFetch = this.pageNumber < this.totalPages;

      if (canFetch) {
        this.$store
          .dispatch('fetchFeedList', { pageNumber: this.pageNumber + 1 })
          .then(this.$store.dispatch('increasePageNumber'))
          .catch(_ => (this.error = true))
          .finally(() => (this.fetchingData = false));
      } else {
        // 获取下一页，如果下一页没有内容就说明是最后一页
        this.$store
          .dispatch('fetchFeedList', { pageNumber: this.pageNumber + 1 })
          .then(list => {
            if (!list.length) {
              this.isLastPage = true;
            }
          })
          .catch(_ => (this.error = true))
          .finally(() => (this.fetchingData = false));
      }
    },
  },
};
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}
.moments-timeline {
  overflow: hidden;
  margin: 0;
  display: flex;
  flex-direction: column;

  &__content {
    display: flex;
    flex-direction: column;
  }
}
</style>
