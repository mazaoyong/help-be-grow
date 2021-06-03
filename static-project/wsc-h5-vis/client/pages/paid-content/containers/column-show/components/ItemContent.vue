<template>
  <div :id="`content-${item.alias}`" @click="recordProgress">
    <list-item
      class="item-content"
      :url="url"
      :thumbnail-url="item.cover"
      :thumbnail-icon-tag="thumbnailIconTag"
      :is-learning="contentProgressAlias === item.alias && !isLearnEnd"
      :need-log="true"
      :lazy-log-params="lazyLogParams"
      :title="item.title"
      :status-list="statusList"
      :footer-corner-text="freeText"
      footer-corner-text-class="text-red"
      :show-footer-corner-lock="false"
    />
  </div>
</template>

<script>
import get from 'lodash/get';
import makeRandomString from 'zan-utils/string/makeRandomString';
import ListItem from 'pct/components/list-item';
import { secondsToColonTimeStr } from 'pct/utils';
import { getMediaSuffix, formatSalesNum } from 'common/utils/hide-info';
// import { Toast } from 'vant';

export default {
  name: 'item-content',

  components: {
    ListItem,
  },

  props: {
    item: Object,
    isOwned: Boolean,
    contentProgressAlias: String,
    progress: {
      type: Object,
      default() { return {}; },
    },
    sortType: {
      type: String,
      default: 'desc',
    },
    isLearnEnd: Boolean,
  },

  data() {
    return {
      kdtId: window._global.kdt_id,
      baseUrl: 'https://h5.youzan.com/v2',
    };
  },

  computed: {
    typeName() {
      return [
        '',
        'imgtext',
        'audio',
        'video',
      ][+this.item.mediaType];
    },

    typeSuffix() {
      return [
        '',
        '读',
        '听',
        '看',
        '看',
      ][+this.item.mediaType];
    },

    statusList() {
      const { item = {} } = this;
      const list = [];

      const pageView = `${formatSalesNum(item.pageView)}${getMediaSuffix(this.item.mediaType)}`;
      if (item.pageView) list.push(pageView);

      if (item.mediaType === 3 && item.videoDuration) {
        const timeStr = secondsToColonTimeStr(item.videoDuration);
        list.push(timeStr);
      }

      if (this.isOwned && this.progress.percent) {
        list.push({
          text: +this.progress.percent === 100
            ? `已学完` : `${this.progress.percent}%`,
          // color: '#00bf00',
        });
      }

      return list;
    },

    // 价格文字
    freeText() {
      return !this.isOwned && this.item.isFree ? `免费试${this.typeSuffix}` : '';
    },

    subtitle() {
      return this.item.publishAt;
    },

    url() {
      if (!this.item.alias) return 'javascript:;';
      // 锁逻辑（产品设计待完善）
      // if (!this.item.alias || (!this.isOwned && !this.item.isFree && this.item.sellerType === 2)) return 'javascript:;';
      return `${this.baseUrl}/ump/paidcontent?page=contentshow&alias=${this.item.alias}&kdt_id=${this.kdtId}&sort_type=${this.sortType}`;
    },

    thumbnailIconTag() {
      return [
        '',
        '图文',
        '音频',
        '视频',
      ][this.item.mediaType || 0];
    },

    lazyLogParams() {
      const { item } = this;

      return JSON.stringify({
        goods_id: item.goodsId || item.id,
        item_id: item.goodsId || item.id,
        item_type: 'paid_content',
        banner_id: this.getBannerId(),
      });
    },
  },

  // methods: {
  //   onCheckLock() {
  //     if (this.item.alias && (!this.isOwned && !this.item.isFree)) Toast({ message: '购买专栏后可查看', duration: 1500 });
  //   },
  // },

  methods: {
    recordProgress() {
      this.$emit('record-page', { ...this.item, url: this.url });
    },
    getBannerId(index = 0) {
      const { logId = 0, logType = '' } = get(window, '_global.spm', {});
      const loggerSpm = `${logType}.${logId}`;
      const loggerName = 'paid_content';
      const componentIndex = 0;
      const pageRandomNumber = makeRandomString(8);

      return `${loggerSpm}~${loggerName}.${componentIndex + 1}~${index}~${pageRandomNumber}`;
    },
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';
@import 'var';

.item-content {

  .last-learning {
    color: #00b389;
  }

  .item-row {
    align-items: center;

    .item__title {
      white-space: normal;

      @include multi-ellipsis(2);
    }
  }

  .item__footer-corner__text.text-red {
    display: block;
    padding: 5px 8px;
    border-radius: 11px;
    font-size: 11px;
    background-color: rgba(0, 179, 137, .1);
  }
}
</style>
