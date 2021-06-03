<template>
  <list-item
    class="item-content"
    :url="url"
    :thumbnail-url="coverUrl"
    :thumbnail-icon-tag="thumbnailIconTag"
    :title="item.title"
    :status-list="statusList"
    :footer-corner-text="freeText"
    footer-corner-text-class="text-red"
  />
</template>

<script>
import ListItem from 'pct/components/list-item';
import { secondsToColonTimeStr } from 'pct/utils';
import format from 'date-fns/format';
import buildUrl from '@youzan/utils/url/buildUrl';

export default {
  name: 'item-free-content',

  components: {
    ListItem,
  },

  props: {
    item: Object,
  },

  data() {
    return {
      kdtId: window._global.kdt_id,
      coverUrl: this.item.picture.url || '',
    };
  },

  computed: {
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

      // 直播逻辑 push直播开始时间
      if (item.mediaType === 4) {
        list.push(format(item.liveBeginTime, 'YYYY-MM-DD HH:mm:ss'));
      }

      // pageView字段未支持
      // const pageView = `${item.pageView}${getMediaSuffix(item.mediaType)}`;
      // if (item.pageView) list.push(pageView);

      if (item.mediaType === 3 && item.videoDuration) {
        const timeStr = secondsToColonTimeStr(item.videoDuration);
        list.push(timeStr);
      }

      return list;
    },

    // 价格文字
    freeText() {
      return `免费试${this.typeSuffix}`;
    },

    url() {
      if (+this.item.mediaType === 4) {
        return buildUrl(`/wscvis/knowledge/index?kdt_id=${window._global.kdt_id}&p=livedetail&alias=${this.item.alias}`, '', this.kdtId);
      }
      return buildUrl(`/wscvis/knowledge/index?kdt_id=${window._global.kdt_id}&p=contentshow&alias=${this.item.alias}`, '', this.kdtId);
    },

    thumbnailIconTag() {
      return [
        '',
        '图文',
        '音频',
        '视频',
        '直播',
      ][this.item.mediaType || 0];
    },
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';
@import 'var';

.item-content {

  .item-row {
    align-items: center;

    .item__title {
      white-space: normal;
      word-break: break-all;

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
