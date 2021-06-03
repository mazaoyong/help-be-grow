<template>
  <list-item
    class="live-item__extend vip-list-item"
    :class="{ 'vip-live-item-free': freeText }"
    :url="url"
    :thumbnail-url="item.cover"
    :thumbnail-icon-tag="thumbnailTag"
    :thumbnail-icon-class="thumbnailIconClass"
    :need-log="true"
    :log-id="item.goodsId || item.id"
    :title="item.title"
    :subtitle="subtitle"
    :status-list="statusList"
    :footer-corner-text="freeText"
    footer-corner-text-class="text-red theme-btn"
  />
</template>

<script>
import { format } from 'date-fns';
import ListItem from 'pct/components/list-item';
import { getMediaSuffix, ENUM_MEDIA_TYPE, formatSalesNum } from 'common/utils/hide-info';
import buildUrl from '@youzan/utils/url/buildUrl';

export default {
  name: 'live-item',

  components: {
    ListItem,
  },

  props: {
    item: Object,
    isPaid: Boolean,
  },

  data() {
    return {
      kdtId: window._global.kdt_id,
    };
  },

  computed: {
    statusList() {
      const { item = {} } = this;

      const list = [`直播时间：${format(item.liveStartAt, 'YYYY-MM-DD HH:mm:ss')}`];
      return list;
    },

    url() {
      if (!this.item.alias) return 'javascript:;';
      return buildUrl(`/wscvis/knowledge/index?kdt_id=${window._global.kdt_id}&p=livedetail&alias=${this.item.alias}`, '', this.kdtId);
    },

    thumbnailTag() {
      const { item } = this;
      const liveStatusArr = ['', '未开始', '进行中', '已结束'];
      return liveStatusArr[item.liveStatus];
    },

    // 进行中的直播tag跟随主题色变化
    thumbnailIconClass() {
      const { item } = this;
      return item.liveStatus === 2 ? 'theme-tag' : '';
    },

    subtitle() {
      const { item } = this;
      const subtitleArr = [];
      if (item.pageView) {
        subtitleArr.push(`${formatSalesNum(item.pageView)}${getMediaSuffix(ENUM_MEDIA_TYPE.LIVE)}`);
      }
      if (item.columnTitle) {
        subtitleArr.push(item.columnTitle);
      }
      return subtitleArr.join(' | ');
    },
    // 价格文字
    freeText() {
      return !this.isPaid && this.item.isFree ? '免费试听' : '';
    },
  },
};
</script>

<style lang="scss">
@import 'var';

.item__footer-corner__text.text-red {
  color: $c-red;
}

.live-item__extend {
  .item__status {
    padding: 0;
  }
}

// 显示免费试听的时候定制一个样式
.vip-live-item-free {
  .item__status-list {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .item__status {
    line-height: 16px;
  }

  @media screen and (max-width: 390px) {
    .item__detail {
      height: 80px;
    }
  }
}
</style>
