<template>
  <info-block
    v-if="list.length"
    v-tab="tab"
    class="column-free-block"
    :title="`免费内容(${columnFreeContentCount})`"
  >
    <span slot="title-right" class="sort" @click="sort">
      <vis-icon
        class="sort-icon"
        size="14px"
        :name="sortType === 'desc' ? 'reverseorder' : 'positivesequence'"
      />
      {{ sortType === 'desc' ? '倒序' : '正序' }}
    </span>
    <van-loading v-if="loading" class="loading" />
    <goods-card
      v-for="item in list"
      v-else
      :key="item.alias"
      :alias="item.alias"
      :img="item.picture.url"
      :media-type="item.mediaType"
      :title="item.title"
      :button-text="getButtonText(item)"
    >
      {{ getContent(item) }}
    </goods-card>
  </info-block>
</template>

<script>
import { Loading } from 'vant';
import { Icon } from '@youzan/vis-ui';
import formatDate from '@youzan/utils/date/formatDate';
import GoodsCard from '@/components/goods-card';
import { MEDIA_TYPE } from '@/constants/course/media-type';
import rootStore from '@/pages/course/detail/store';
import InfoBlock from '@/pages/course/detail/components/info-block';
import secondsToColonTime from '@/pages/course/detail/utils/seconds-to-colon-time';
import storeName from './name';
import store from './store';

rootStore.registerModule(storeName, store);

export default {
  storeName,

  components: {
    'van-loading': Loading,
    'vis-icon': Icon,
    InfoBlock,
    GoodsCard,
  },

  state: ['loading', 'list', 'sortType'],
  rootState: ['columnFreeContentCount'],
  rootGetters: ['isColumn'],

  computed: {
    tab() {
      if (this.isColumn) {
        return {
          index: 1,
          title: '专栏介绍',
        };
      }
      return null;
    },
  },

  mounted() {
    this.$dispatch('fetchList');
  },

  methods: {
    sort() {
      this.$dispatch('toggleSortType');
      this.$dispatch('fetchList');
    },

    getButtonText(item) {
      if (item.mediaType) {
        const buttonTextMap = {
          [MEDIA_TYPE.IMAGE_TEXT]: '免费试读',
          [MEDIA_TYPE.AUDIO]: '免费试听',
          [MEDIA_TYPE.VIDEO]: '免费试看',
          [MEDIA_TYPE.LIVE]: '免费试看',
        };
        return buttonTextMap[item.mediaType];
      }
      return '';
    },

    getContent(item) {
      if (item.mediaType === MEDIA_TYPE.VIDEO && item.videoDuration) {
        return secondsToColonTime(item.videoDuration);
      }
      if (item.mediaType === MEDIA_TYPE.LIVE && item.liveBeginTime) {
        return formatDate(item.liveBeginTime, 'YYYY-MM-DD HH:mm:ss');
      }
      return '';
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.column-free-block {
  margin-bottom: 8px;
  line-height: 14px;

  .sort {
    font-size: 12px;
    color: $vice-text-color;
  }

  .sort-icon {
    display: inline-block;
    vertical-align: text-top;
  }

  .loading {
    padding: 20px 0;
    text-align: center;
  }
}
</style>
