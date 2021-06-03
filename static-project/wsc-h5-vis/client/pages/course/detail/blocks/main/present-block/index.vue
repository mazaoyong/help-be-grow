<template>
  <div v-if="list.length" v-tab="tab" class="present-block">
    <goods-card
      v-for="item in showList"
      :key="item.alias"
      :alias="item.alias"
      :img="item.imageUrl"
      :title="item.title"
      :owl-type="item.owlType"
      :media-type="item.mediaType"
      title-tag="赠品"
    >
      <span>{{ getDesc(item) }}</span>
    </goods-card>
    <div v-if="list.length > 3 && fold" class="more" @click="handleClick">
      展开全部
    </div>
  </div>
</template>

<script>
import { OWL_TYPE } from '@/constants/course/owl-type';
import GoodsCard from '@/components/goods-card';
import secondsToColonTimeStr from '@/pages/course/detail/utils/seconds-to-colon-time';
import { findPresentByCondition } from './api';

export default {
  components: {
    GoodsCard,
  },

  data() {
    return {
      list: [],
      fold: true,
    };
  },

  rootState: ['goodsData', 'user'],
  rootGetters: ['isColumn'],

  computed: {
    tab() {
      if (this.isColumn) {
        return {
          index: 2,
          title: '专栏目录',
        };
      }
      return null;
    },

    showList() {
      if (this.fold) {
        return this.list.slice(0, 3);
      }
      return this.list;
    },
  },

  created() {
    this.init();
  },

  methods: {
    init() {
      if (this.user.hasLogin) {
        findPresentByCondition(this.goodsData.alias)
          .then(res => {
            if (Array.isArray(res)) {
              this.list = res.filter(item => (item.owlType !== OWL_TYPE.COURSE && item.presentType === 1));
            }
          });
      }
    },

    getDesc(item) {
      let desc = [];
      if (item.subscriptionsCount) {
        desc.push(`${item.subscriptionsCount}人已学`);
      }
      if (item.videoDuration) {
        desc.push(secondsToColonTimeStr(item.videoDuration));
      }
      return desc.join(' | ');
    },

    handleClick() {
      this.fold = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.present-block {
  margin-bottom: 8px;
  background-color: $white;

  .more {
    font-size: 12px;
    line-height: 44px;
    color: $disabled-color;
    text-align: center;
  }
}
</style>
