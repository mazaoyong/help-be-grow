<template>
  <div
    v-if="contentData.nextOwlInfo && contentData.nextOwlInfo.alias"
    class="image-text next-content"
  >
    <van-cell
      :url="columnUrl"
      :border="false"
      is-link
      title="下一篇"
      value="查看全部"
    />
    <list-item
      :thumbnail-url="item.cover"
      :title="item.title"
      :subtitle="item.summary"
      :url="nextUrl"
    />
  </div>
</template>

<script>
import { Cell } from 'vant';
import ListItem from 'pct/components/list-item';
import buildUrl from '@youzan/utils/url/buildUrl';
import * as SafeLink from '@youzan/safe-link';
import { debounce } from 'lodash';
import { MEDIA_TYPE } from 'pct/constants';

// 辅助图文展示类型：1：无辅助图文  2：购买前显示完整图文 3：购买前仅显示图文简介，购买后显示图文详情
const SHOW_TYPE = {
  NONE: 1,
  ENTIRE: 2,
  PREVIEW: 3,
};

export default {
  name: 'only-image-text',

  components: {
    ListItem,
    'van-cell': Cell,
  },

  props: {
    contentData: {
      type: Object,
      default() {
        return {};
      },
    },
    columnData: [Object, Array],
    columnTitle: {
      type: String,
      default: '',
    },
    isOwned: Boolean,

    // 辅助图文展示类型：1：无辅助图文  2：购买前显示完整图文 3：购买前仅显示图文简介，购买后显示图文详情
    showType: {
      type: Number,
      value: 3,
    },

    progress: {
      type: Object,
      default() {
        return {};
      },
    },

    sortType: {
      type: String,
      default: 'desc',
    },

    columnAlias: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      SHOW_TYPE,

      // couponList: [], // 详情页领券入口标签列表，暂时未使用
      styleToTop: 0,
      styleHeight: 0,
      mask: 'mask',
      bodyScrollToTop: 0,

      // 下一篇跳转
      item: this.contentData.nextOwlInfo || {},
      kdtId: window._global.kdt_id,

      fakeText: `<p style="text-align:center">此图文为付费内容，购买后即可查看</p>
        <p style="text-align:center">此图文为付费内容，购买后即可查看</p>
        <p style="text-align:center">此图文为付费内容，购买后即可查看</p>
        <p style="text-align:center">此图文为付费内容，购买后即可查看</p>
        <p style="text-align:center">此图文为付费内容，购买后即可查看</p>
        <p style="text-align:center">此图文为付费内容，购买后即可查看</p>`,

      scrollListener: null,
    };
  },

  computed: {
    /* 复合状态 */

    hasNext() {
      return !!(
        this.contentData.nextOwlInfo && this.contentData.nextOwlInfo.alias
      );
    },

    showNext() {
      return this.isOwned && this.hasNext();
    },

    // 是否为免费商品
    isFreeGoods() {
      return +this.contentData.sellerType === 2
        ? +this.contentData.columnDetail.price === 0
        : +this.contentData.price === 0;
    },

    contentTip() {
      if (+this.contentData.sellerType === 2) {
        return this.isFreeGoods
          ? '请先领取专栏后再观看'
          : '此图文为付费内容，订购专栏即可查看';
      }
      return this.isFreeGoods
        ? '请先领取后再观看'
        : '此图文为付费内容，购买后即可查看';
    },

    nextUrl() {
      if (!this.item.alias) return 'javascript:;';

      // 判断是否是直播类型
      if (this.item.mediaType === MEDIA_TYPE.LIVE) {
        return buildUrl(
          `/wscvis/knowledge/index?kdt_id=${window._global.kdt_id}&p=livedetail&alias=${this.item.alias}`,
          '',
          this.kdtId
        );
      }
      return buildUrl(
        `/wscvis/knowledge/index?kdt_id=${window._global.kdt_id}&p=contentshow&alias=${this.item.alias}&sort_type=${this.sortType}`,
        '',
        this.kdtId
      );
    },

    columnUrl() {
      return SafeLink.getSafeUrl({
        url: `/wscvis/knowledge/index?p=columnshow&alias=${this.columnAlias}`,
        kdtId: window._global.kdt_id,
      });
    },
  },

  mounted() {
    if (this.isOwned) {
      // 用于移除
      this.logProgress();
      this.scrollListener = debounce(() => this.logProgress(), 400);
      window.addEventListener('scroll', this.scrollListener);

      // 恢复进度
      if (this.progress && this.progress.latest) {
        const latestProgress = this.progress.latest;
        const richContent = document.querySelector('#rich-content');
        if (!richContent) return;
        const rect = richContent.getBoundingClientRect();

        window.scrollTo(
          0,
          latestProgress.current + rect.top - window.innerHeight
        );
      }
    }
  },

  beforeDestroy() {
    window.removeEventListener('scroll', this.scrollListener);
  },

  methods: {
    logProgress() {
      const richContent = document.querySelector('#rich-content');
      if (!richContent) return;

      const rect = richContent.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      let log = {};
      if (rect.top >= windowHeight) {
        log = {
          total: rect.height,
          current: 0,
        };
      } else if (rect.bottom <= windowHeight) {
        log = {
          total: rect.height,
          current: rect.height,
        };
      } else {
        log = {
          total: rect.height,
          current: windowHeight - rect.top,
        };
      }

      this.$emit('log-progress', log);
    },
  },
};
</script>

<style lang="scss" module>
.next-content {
  background: #fff;
  margin-top: 10px;

  :global {
    .van-cell__title {
      font-weight: 500;
    }

    .van-cell__value {
      font-size: 12px;
    }

    .van-cell {
      .van-icon-arrow {
        font-size: 18px;
      }
    }
    .item {
      padding: 12px 15px 16px;
    }
  }
}
</style>
