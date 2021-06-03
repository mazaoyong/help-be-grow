<template>
  <list-item
    :url="url"
    :thumbnail-url="item.cover"
    :need-log="true"
    :lazy-log-params="lazyLogParams"
    :title="item.title"
    :subtitle="subtitle"
    :status-list="statusList"
    :price="price"
    :footer-corner-tag="footerCornerTag"
    :footer-corner-text="footerCornerText"
    :footer-cornericon="isPaid"
    :footer-corner-text-class="footerCornerTextClass"
    :footer-margin-top-class="statusMarginTopClass"
    :is-price-line-through-visible="isPriceLineThroughVisible"
  />
</template>

<script>
import get from 'lodash/get';
import makeDateStr from '@youzan/utils/date/makeDateStr';
import makeRandomString from 'zan-utils/string/makeRandomString';
import ListItem from 'components/list-item';
import buildUrl from '@youzan/utils/url/buildUrl';

export default {
  name: 'column-item',

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

    url() {
      return buildUrl(`/wscvis/knowledge/index?kdt_id=${window._global.kdt_id}&p=columnshow&alias=${this.item.alias}`, '', this.kdtId);
    },

    statusList() {
      const list = [];
      const periodInfo = this.item.isUpdate ? `已更新${this.item.contentsCount}期` : `共${this.item.contentsCount}期`;
      if (this.item.contentsCount) list.push(periodInfo);
      const subscriptionsCount = `
      ${this.item.subscriptionsCount >= 10000 ? parseInt(this.item.subscriptionsCount / 10000, 0) + 'w+' : this.item.subscriptionsCount}人已购`;
      if (this.item.subscriptionsCount) list.push(subscriptionsCount);

      return list;
    },

    subtitle() {
      const { lastUpdatedInfo = {} } = this.item;

      return lastUpdatedInfo && lastUpdatedInfo.lastUpdatedTitle
        ? `${makeDateStr(lastUpdatedInfo.publishAt, 'MM-DD')}更新：${lastUpdatedInfo.lastUpdatedTitle}`
        : this.item.summary;
    },

    // 右下角价格标签文字
    footerCornerTag() {
      return get(this.buyStatusDTO, 'priceTag', '');
    },

    price() {
      return get(this.buyStatusDTO, 'price', 0);
    },

    // 价格
    footerCornerText() {
      const priceText = get(this.buyStatusDTO, 'priceText', '');
      return priceText || (this.price ? `¥ ${(this.price / 100).toFixed(2)}` : '');
    },

    footerCornerTextClass() {
      if (this.isPaid) return 'text-black';
      return 'text-red';
    },

    lazyLogParams() {
      const { item } = this;

      return JSON.stringify({
        goods_id: item.goodsId || item.id,
        item_id: item.goodsId || item.id,
        item_type: 'paid_column',
        banner_id: this.getBannerId(),
      });
    },
  },

  methods: {
    getBannerId(index = 0) {
      const { logId = 0, logType = '' } = get(window, '_global.spm', {});
      const loggerSpm = `${logType}.${logId}`;
      const loggerName = 'paid_column';
      const componentIndex = 0;
      const pageRandomNumber = makeRandomString(8);

      return `${loggerSpm}~${loggerName}.${componentIndex + 1}~${index}~${pageRandomNumber}`;
    },
  },
};
</script>
