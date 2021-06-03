<template>
  <div class="reward-list">
    <common-list :params="params" :request="getRewardList">
      <div class="reward-list-item" slot-scope="props">
        <div class="reward-list-item-name">{{ props.item.copywriting }}</div>
        <div class="reward-list-item-time">{{ props.item.rewardTime | formatDate }}</div>
      </div>
      <div slot="empty" class="reward-list-empty">
        <van-empty description="暂无记录，赶紧去邀请好友吧" :image="emptyImg" />
      </div>
    </common-list>
  </div>
</template>

<script>
import { Empty } from 'vant';
import { CommonList } from '@youzan/vis-ui';
import formatDate from '@youzan/utils/date/formatDate';

import { getRewardByPage } from '../../../apis/old-student';
import { LIST_EMPTY_IMG } from '../../../constants';

const pageSize = 10;

export default {
  name: 'reward-list',
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      pageNumber: 1,
    };
  },
  computed: {
    emptyImg() {
      return LIST_EMPTY_IMG;
    },
    params() {
      return {
        activityType: 'invite_reward',
        page: this.pageNumber,
      };
    },
  },
  filters: {
    formatDate(rewardTime) {
      return formatDate(rewardTime, 'YYYY-MM-DD HH:mm');
    },
  },
  components: {
    CommonList,
    'van-empty': Empty,
  },
  methods: {
    getRewardList({ page, activityType }) {
      return getRewardByPage({
        activityType,
        pageSize,
        pageNumber: page,
      }).then((res) => {
        return {
          list: res.content,
          hasNext: res.content.length === pageSize,
        };
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.reward-list {
  padding: 0 16px;

  &-item {
    display: flex;
    flex-flow: column wrap;
    justify-content: center;
    height: 68px;

    &-name {
      font-size: 14px;
      line-height: 20px;
      color: #323233;
      font-weight: 500;
    }

    &-time {
      margin-top: 4px;
      font-size: 10px;
      line-height: 15px;
      color: #d0d0d0;
    }
  }

  &-empty {
    min-height: 320px;
  }
}
</style>
