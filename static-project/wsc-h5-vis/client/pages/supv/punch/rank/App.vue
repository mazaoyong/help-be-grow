<template>
  <div class="punch-rank">
    <van-tabs v-model="activeTabIndex">
      <van-tab
        v-for="tab in tabs"
        :key="tab.name"
        :title="tab.title"
      >
        <component :is="tab.name" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { Tabs, Tab } from 'vant';
import { redirectToIntroduction } from '../utils';
import BlockCalendar from './blocks/BlockCalendar';
import BlockRank from './blocks/BlockRank';

const global = window._global;
const platform = global.platform || '';

export default {
  name: 'punch-rank',

  components: {
    'van-tabs': Tabs,
    'van-tab': Tab,
    BlockCalendar,
    BlockRank,
  },

  data() {
    return {
      tabs: [
        { name: 'block-rank', title: '排行榜' },
        { name: 'block-calendar', title: '打卡日历' },
      ],
      activeTabIndex: 0,
    };
  },

  created() {
    if (platform !== 'weixin') {
      redirectToIntroduction();
    }
  },
};
</script>

<style lang="scss" scoped>
.punch-rank {
  ::v-deep .van-tabs__wrap {
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, .1);
  }

  ::v-deep .van-tabs__line {
    width: 56px !important;
    margin-bottom: 5px;
    background-color: #00b389;
  }

  ::v-deep .van-tab--active {
    .van-tab__text {
      color: #00b389;
    }
  }

  ::v-deep .van-tab__text {
    font-weight: 400;
  }
}
</style>
