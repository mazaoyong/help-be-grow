<template>
  <common-list
    v-if="hasContent"
    ref="list"
    :params="params"
    :request="request"
    loading-text="正在加载内容列表"
  >
    <div slot="empty" class="no-data-wrap">
      <no-data class="no-data-icon" :width="50" :height="50" />
      这个目录下还没有内容哦
    </div>
    <goods-card-lite
      slot-scope="props"
      v-theme="{
        main: {
          '.title .text': isLearning(props.item) ? 'color!important' : '',
        },
      }"
      :data-alias="props.item.alias"
      :alias="props.item.alias"
      :img="props.item.cover"
      :media-type="props.item.mediaType"
      :title="props.item.title"
      :title-tag="getTitleTag(props.item)"
      :button-text="getButtonText(props.item)"
      @click="click(props.item)"
    >
      <!-- 已学完。。。 -->
      <div>
        <span
          v-for="(text, index) in getDescList(props.item)"
          :key="index"
          class="desc-item"
        >
          {{ text }}
        </span>
      </div>
    </goods-card-lite>
  </common-list>
</template>

<script>
// import { Loading } from 'vant';
import { CommonList } from '@youzan/vis-ui';
import formatDate from '@youzan/utils/date/formatDate';
import { getLiveStatusDesc } from 'common/utils/live-status';
import GoodsCardLite from '@/components/goods-card-lite';
import {
  MEDIA_TYPE,
  // MEDIA_TYPE_SUFFIX,
  MEDIA_TYPE_FREE_BUTTON,
} from '@/constants/course/media-type';
import NoData from '@/pages/course/detail/components/no-data';
import secondsToColonTime from '@/pages/course/detail/utils/seconds-to-colon-time';
// import formatSalesNum from '@/pages/course/detail/utils/format-sales-num';

import { getContentAndLive } from '../api';
// import storeName from '../../name';

export default {
  name: 'content-list',
  // storeName,

  components: {
    // 'van-loading': Loading,
    CommonList,
    NoData,
    GoodsCardLite,
  },

  props: {
    chapterId: {
      type: Number,
      default: 0,
    },
    hasCustomChapters: {
      type: Boolean,
      default: false,
    },
    hasContent: {
      type: Boolean,
      default: false,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      page: 1,
      prevLoading: false,
      prevError: false,
    };
  },

  // state: ['lastPage', 'total'],
  rootState: ['goodsData', 'sortType', 'contentProgress', 'columnProgress'],

  computed: {
    params() {
      return {
        alias: this.goodsData.column.alias,
        page: this.page,
        sortType: this.sortType,
      };
    },
  },

  watch: {
    sortType() {
      this.$rootDispatch('updateColumnProgress', {
        lastPage: 1,
      });
      // this.$commit('lastPage', 1);
      this.page = 1;
    },
    visible() {
      if (this._checked) {
        return;
      }
      this.$refs.list.check();
      this._checked = true;
    },
  },

  mounted() {
  },

  created() {
    this._checked = false;
  },

  methods: {
    // 透传 van-list 中的 check 方法
    check() {
      this.$refs.list.check();
    },

    request({ alias, page, sortType }) {
      if (this.hasCustomChapters) {
        sortType = '';
      }
      return getContentAndLive(alias, page, sortType, this.chapterId).then(
        (res) => {
          this.$emit('setTotal', res.total);
          return {
            list:
              res.content &&
              res.content.map((item) => ({ ...item, pageNumber: page })),
            hasNext: page < res.totalPages,
          };
        },
      );
    },

    getTitleTag(item) {
      if (item.mediaType === MEDIA_TYPE.LIVE) {
        return getLiveStatusDesc(item.liveStatus, item.liveType);
      }
    },

    getDescList(item) {
      const list = [];
      // if (item.pageView) {
      //   const str = formatSalesNum(item.pageView);
      //   list.push(`${str}次${MEDIA_TYPE_SUFFIX[item.mediaType]}`);
      // }
      // if (
      //   item.mediaType === MEDIA_TYPE.VIDEO &&
      //   item.videoContentDTO &&
      //   item.videoContentDTO.videoDuration
      // ) {
      //   list.push(secondsToColonTime(item.videoContentDTO.videoDuration));
      // }
      // if (item.mediaType === MEDIA_TYPE.LIVE && item.liveStartAt) {
      //   list.unshift(formatDate(item.liveStartAt, 'YYYY-MM-DD HH:mm:ss'));
      // } else {
      //   list.unshift(formatDate(item.publishAt, 'YYYY-MM-DD'));
      // }
      // if (item.mediaType !== MEDIA_TYPE.LIVE && this.goodsData.isOwnAsset) {
      //   const progress = this.contentProgress[`c-${item.alias}`] || {};
      //   if (progress.percent) {
      //     list.push(
      //       progress.percent === 100 ? '已学完' : `${progress.percent || 0}%`,
      //     );
      //   }
      // }

      if (item.mediaType === MEDIA_TYPE.LIVE && item.liveStartAt) {
        list.unshift(formatDate(item.liveStartAt, 'YYYY-MM-DD HH:mm:ss'));
      }
      //
      // else {
      //   list.unshift(formatDate(item.publishAt, 'YYYY-MM-DD'));
      // }

      if (item.mediaType === MEDIA_TYPE.VIDEO) {
        list.push(`${secondsToColonTime(item?.videoContentDTO?.videoDuration)}`);
      }
      if (item.mediaType !== MEDIA_TYPE.LIVE) {
        const progress = this.contentProgress[`c-${item.alias}`] || {};
        if (progress.percent) {
          list.push(this.isDone ? '已学完' : `已学${progress.percent || 0}%`);
        } else {
          list.push('未开始');
        }
      }

      return list;
    },

    isLearning(item) {
      if (this.columnProgress.alias === item.alias) {
        const progress = this.contentProgress[`c-${item.alias}`] || {};
        if (progress.percent !== 100) {
          return true;
        }
      }
      return false;
    },

    getButtonText(item) {
      if (this.isLearning(item)) {
        return '继续学习';
      }
      if (!this.goodsData.isOwnAsset && item.isFree && item.mediaType) {
        return MEDIA_TYPE_FREE_BUTTON[item.mediaType];
      }
    },

    click(item) {
      this.$rootDispatch('updateColumnProgress', {
        lastPage: item.pageNumber,
        title: item.title,
        alias: item.alias,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "mixins/index.scss";

.no-data-wrap {
  padding: 88px 0;
  font-size: 12px;
  color: $disabled-color;
  text-align: center;

  .no-data-icon {
    display: block;
    margin: 0 auto 20px;
  }
}

.desc-item {
  position: relative;
  float: left;
  margin-right: 8px;

  &::after {
    @include border-retina(right, $disabled-color);

    top: 2px;
    height: 24px;
    margin: 0 4px;
  }

  &:last-child {
    margin-right: 0;

    &::after {
      border-right: 0 none;
    }
  }
}
</style>
