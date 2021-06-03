<template>
  <list-item
    :url="url"
    :need-log="true"
    :title="item.title"
    :subtitle="subtitle"
    :status-list="statusList"
    :page-view="item.pageView"
    :thumbnail-url="item.cover"
    :thumbnail-icon="thumbnailIcon"
    :lazy-log-params="lazyLogParams"
    :price="price"
    :footer-corner-tag="priceTag"
    :footer-corner-text="priceText"
    :footer-cornericon="isPaid"
    :footer-corner-text-class="priceTextClass"
    :footer-margin-top-class="statusMarginTopClass"
    :is-price-line-through-visible="isPriceLineThroughVisible"
  />
</template>

<script>
import get from 'lodash/get';
import makeDateStr from '@youzan/utils/date/makeDateStr';
import makeRandomString from 'zan-utils/string/makeRandomString';
import ListItem from 'components/list-item';
import { getMediaSuffix } from 'common/utils/hide-info';
import buildUrl from '@youzan/utils/url/buildUrl';

export default {
  name: 'content-item',

  components: {
    ListItem,
  },

  props: {
    item: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },

  data() {
    return {
      kdtId: window._global.kdt_id,
    };
  },

  computed: {
    buyStatusDTO() {
      return this.item.buyStatusDTO || {};
    },
    inColumn() {
      return !!this.item.columnAlias;
    },
    isPaid() {
      return get(this.item.buyStatus, 'isBought', 0);
    },
    isPriceLineThroughVisible() {
      return get(this.item.buyStatus, 'isFreeForVip', 0);
    },

    statusMarginTopClass() {
      if (!this.isPriceLineThroughVisible) return '';

      return 'margin-top';
    },

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

      const list = [
        typeof item.publishAt === 'string'
          ? item.publishAt : (`${makeDateStr(item.publishAt, 'MM-DD')}` || ''),
      ];
      const pageView = `${item.pageView > 10000 ? parseInt(item.pageView / 10000, 0) + 'w+' : item.pageView}${getMediaSuffix(this.item.mediaType)}`;
      if (!this.isPaid && item.pageView) list.push(pageView);

      return list;
    },

    price() {
      return get(this.buyStatusDTO, 'price', 0);
    },

    // 价格标签
    priceTag() {
      return get(this.buyStatusDTO, 'priceTag', '');
    },

    priceText() {
      const priceText = get(this.buyStatusDTO, 'priceText', '');
      return priceText || (this.price ? `¥ ${(this.price / 100).toFixed(2)}` : '');
    },

    priceTextClass() {
      if (this.isPaid) return 'text-black';
      return 'text-red';
    },

    subtitle() {
      return this.inColumn ? this.item.columnTitle : this.item.summary;
    },

    url() {
      if (!this.item.alias) return 'javascript:;';
      return buildUrl(`/wscvis/knowledge/index?kdt_id=${window._global.kdt_id}&p=contentshow&alias=${this.item.alias}`, '', this.kdtId);
    },

    thumbnailIcon() {
      return [
        '',
        'https://img01.yzcdn.cn/weapp/paidcontent/doc.png',
        'https://img01.yzcdn.cn/weapp/paidcontent/music.png',
        'https://img01.yzcdn.cn/weapp/paidcontent/video.png',
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

  methods: {
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
