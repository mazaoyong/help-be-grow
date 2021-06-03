<template>
  <div class="rank-list">
    <h2 class="header">
      快人一步，你是第{{ rank }}个抢到的
    </h2>
    <common-list class="list" :params="params" :request="request">
      <rank-item slot-scope="props" :data="props.item" :index="props.index" />
    </common-list>
    <p class="bottom">
      已领{{ receivedCount }}个，还剩<span>{{ unreceivedCount }}</span>个名额
    </p>
    <van-icon
      class="close"
      name="close"
      size="36px"
      @click="close"
    />
  </div>
</template>

<script>
import { Icon } from 'vant';
import { get } from '@youzan/utils/url/args';
import { CommonList } from '@youzan/vis-ui';
import RankItem from '../rank-item';
import { getShareRank } from './api';

export default {
  components: {
    'van-icon': Icon,
    CommonList,
    RankItem,
  },

  props: {
    alias: {
      type: String,
      required: true,
    },
    rank: {
      type: Number,
      required: true,
    },
    receivedCount: {
      type: Number,
      required: true,
    },
    unreceivedCount: {
      type: Number,
      required: true,
    },
  },

  computed: {
    params() {
      return {
        alias: this.alias,
        shareAlias: get('share_alias'),
        channelType: get('channel_type'),
        orderAlias: get('order_alias'),
      };
    },
  },

  methods: {
    request({ alias, shareAlias, channelType, orderAlias, page, pageSize }) {
      return getShareRank(alias, shareAlias, channelType, orderAlias, page, pageSize).then(res => {
        return {
          list: res.content,
          hasNext: page < res.totalPages,
        };
      });
    },

    close() {
      this.$emit('resolve');
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.rank-list {
  position: relative;
  width: 315px;
  height: 450px;
  border-radius: 4px;

  .header {
    height: 76px;
    line-height: 76px;
    color: $white;
    text-align: center;
    background: url(/wsc-h5-vis/course/detail/rank-list-bg.png) no-repeat center / cover;
  }

  .list {
    height: 328px;
    overflow: auto;
  }

  .bottom {
    font-size: 12px;
    line-height: 46px;
    color: $disabled-color;
    text-align: center;

    span {
      margin: 0 2px;
      color: red;
    }
  }

  .close {
    position: absolute;
    bottom: -52px;
    left: 50%;
    color: $white;
    transform: translateX(-50%);
  }
}
</style>

<style lang="scss"> // eslint-disable-line vue-scoped-css/require-scoped
.rank-list-pop {
  overflow: visible;
  border-radius: 4px;
}
</style>
