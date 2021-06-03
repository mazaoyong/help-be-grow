<template>
  <list-item
    :url="url"
    :thumbnail-url="item.cover"
    :thumbnail-icon="thumbnailIcon"
    :need-log="true"
    :lazy-log-params="lazyLogParams"
    :price="price"
    :title="item.title"
    :title-tag="liveStatusText"
    :title-tag-class="liveStatusClass"
    :subtitle="item.summary"
    :status-list="statusList"
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
import makeRandomString from 'zan-utils/string/makeRandomString';
import ListItem from 'components/list-item';
import { format as formatDate } from 'date-fns';
import { getSuffix, ENUM_MEDIA_TYPE } from 'common/utils/hide-info';
import { getLiveStatusDesc } from 'common/utils/live-status';
import buildUrl from '@youzan/utils/url/buildUrl';

export default {
  name: 'live-item',

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
      baseUrl: 'https://h5.youzan.com/v2',
      thumbnailIcon: 'https://img01.yzcdn.cn/public_files/2018/04/08/icon_live.png',
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

    liveStatusText() {
      return getLiveStatusDesc(this.item.liveStatus, this.item.liveType);
    },

    liveStatusClass() {
      return [
        '',
        'bg-green',
        'bg-red',
        '',
        'bg-red',
        'bg-green',
      ][this.item.liveStatus];
    },

    url() {
      if (!this.item.alias) return 'javascript:;';
      return buildUrl(`/wscvis/knowledge/index?kdt_id=${window._global.kdt_id}&p=livedetail&alias=${this.item.alias}`, '', this.kdtId);
    },

    lazyLogParams() {
      const { item } = this;

      return JSON.stringify({
        goods_id: item.goodsId || item.id,
        item_id: item.goodsId || item.id,
        item_type: 'paid_live',
        banner_id: this.getBannerId(),
      });
    },

    statusList() {
      const statusList = [];
      const date = formatDate(this.item.liveStartAt, 'MM-DD HH:mm');
      statusList.push(date);
      if (this.item.pageView) {
        statusList.push(`${this.item.pageView > 10000 ? parseInt(this.item.pageView / 10000, 0) + 'w+' : this.item.pageView}${getSuffix(ENUM_MEDIA_TYPE.LIVE)}`);
      }
      return statusList;
    },
  },

  methods: {
    getBannerId(index = 0) {
      const { logId = 0, logType = '' } = get(window, '_global.spm', {});
      const loggerSpm = `${logType}.${logId}`;
      const loggerName = 'paid_live';
      const componentIndex = 0;
      const pageRandomNumber = makeRandomString(8);

      return `${loggerSpm}~${loggerName}.${componentIndex + 1}~${index}~${pageRandomNumber}`;
    },
  },
};
</script>

<style lang="scss">
.item__title-tag {
  border-radius: 16px;
}

.item__title-tag.bg-green {
  background: #00b389;
}

.item__title-tag.bg-red {
  background: #f44;
}
</style>
