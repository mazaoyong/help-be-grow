<template>
  <list-item
    :url="url"
    :thumbnail-url="item.cover"
    thumbnail-icon-tag="直播"
    :title="item.title"
    :title-tag="liveStatusText"
    :title-tag-class="liveStatusClass"
    :footer-corner-text="footerCornerText"
    :footer-corner-text-class="footerCornerTextClass"
  >
    <recommend-item-price slot="footer-left" :price="priceText" />
  </list-item>
</template>

<script>
import ListItem from 'pct/components/list-item';
import RecommendItemPrice from './goods-recommends/RecommendItemPrice';
import buildUrl from '@youzan/utils/url/buildUrl';
import { getLiveStatusDesc } from 'common/utils/live-status';

export default {
  name: 'item-live',

  components: {
    ListItem,
    RecommendItemPrice,
  },

  props: {
    item: Object,
    isRecommends: Boolean,
  },

  data() {
    return {
      kdtId: window._global.kdt_id,
      thumbnailIcon: 'https://img01.yzcdn.cn/public_files/2018/04/08/icon_live.png',
    };
  },

  computed: {
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

    statusList() {
      if (this.isRecommends) return [this.item.liveStartAt];

      const list = [];
      const suffix = ['', '读', '听', '看', '看'];
      if (this.item.sales) list.push(this.item.sales + '人已' + suffix[this.item.mediaType]);
      return list;
    },

    priceText() {
      if (this.isRecommends) return `${(this.item.price / 100).toFixed(2)}`;
      return '';
    },

    url() {
      if (!this.item.alias) return 'javascript:;';
      return buildUrl(`/wscvis/knowledge/index?kdt_id=${window._global.kdt_id}&p=livedetail&alias=${this.item.alias}`, '', this.kdtId);
    },

    footerCornerText() {
      if (this.isRecommends) {
        return '去购买';
      }
      return '';
    },
    footerCornerTextClass() {
      if (this.isRecommends) {
        return 'theme-btn theme_plain';
      }
      return '';
    },
  },
};
</script>

<style lang="scss">
@import 'var';

.item__footer-corner__text.text-red {
  color: $c-red;
}

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
