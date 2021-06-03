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
        @clickItem="clickItem"
      />
    </div>
  </van-list>
</template>

<script>
import { List } from 'vant';
import { mapState } from 'vuex';
import TimelineHeader from './views/timeline-header';
import TimelineList from '@/vis-shared/views/moments/timeline';
import api from './api';

export default {
  name: 'timeline',
  components: {
    'van-list': List,
    'timeline-header': TimelineHeader,
    'timeline-list': TimelineList,
  },

  data() {
    return {
      error: false,
      isLastPage: false,
      fetchingData: true,
    };
  },

  computed: mapState(['feedList', 'pageNumber', 'totalPages']),

  mounted() {
    this.$store.dispatch('fetchFeedList').finally(() => (this.fetchingData = false));
  },

  methods: {
    getPosts() {
      api.findPostsForStaff({

      }).then(res => {
        console.log('res', res);
        this.list = res.content;
      }).catch(e => {
        console.log('45: error', e);
      });
    },

    clickItem(feed) {
      window.location.href = `/v4/vis/h5/edu/moments/feeds/detail/${feed.postId}`;
    },

    handleFecthNextPage() {
      const canFetch = this.pageNumber < this.totalPages;

      if (canFetch) {
        this.$store.dispatch('fetchFeedList', { pageNumber: this.pageNumber + 1 })
          .then(this.$store.dispatch('increasePageNumber'))
          .catch(_ => (this.error = true))
          .finally(() => (this.fetchingData = false));
      } else {
        // 获取下一页，如果下一页没有内容就说明是最后一页
        this.$store.dispatch('fetchFeedList', { pageNumber: this.pageNumber + 1 })
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
