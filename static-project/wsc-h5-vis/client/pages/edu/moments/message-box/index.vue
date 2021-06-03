<template>
  <div class="moments-message-box">
    <van-list v-model="loading" :finished="true">
      <message-item
        v-for="(item, index) in messageList"
        :key="index"
        :item="item"
        :link="getLink(item)"
      />
      <div
        v-if="!finished && !loading"
        class="messages-more moments-message-item"
        @click="fetchMessage"
      >
        查看更早的消息...
      </div>
    </van-list>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { List } from 'vant';
import get from 'lodash/get';
import qs from 'qs';
import Item from '@/vis-shared/views/moments/message-box/message-item.vue';

export default {
  name: 'message-box',

  components: {
    'van-list': List,
    'message-item': Item,
  },

  data() {
    const query = qs.parse(location.search, { ignoreQueryPrefix: true });
    const unReadMessageNum = get(query, 'unReadMessageNum');
    return {
      loading: false,
      finished: false,
      unReadMessageNum,
    };
  },

  computed: {
    ...mapState('messages', ['messageList', 'pageNumber']),
  },

  mounted() {
    this.fetchMessage();
  },

  methods: {
    fetchMessage() {
      this.loading = true;
      this.$store.dispatch('messages/fetchMessageList', { unReadMessageNum: this.unReadMessageNum })
        .then(res => {
          const isFinished = get(res, 'message.total') <= this.messageList.length;
          this.finished = isFinished;
          if (!isFinished) {
            this.$store.dispatch('messages/increasePage');
          }
        })
        .catch(() => (this.error = true))
        .finally(() => (this.loading = false));
    },
    getLink(item) {
      const kdtId = item.kdt_id || _global.kdt_id;
      return `/wscvis/edu/moments/feeds/detail/${item.postId}?kdt_id=${kdtId}`;
    },
  },
};
</script>

<style lang="scss">
.moments-message-box {
  .messages-more {
    display: block;
    width: 100%;
    padding: 0;
    margin-left: 0;
    line-height: 56px;
    color: #969799;
    text-align: center;
    border-bottom: 1px;
    border-color: #EBEDF0;
    border-style: solid;
  }
}
</style>
