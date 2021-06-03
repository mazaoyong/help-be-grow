<template>
  <list-item
    :url="url"
    :thumbnail-url="item.cover"
    :thumbnail-icon="thumbnailIcon"
    :title="item.title"
    :title-tag="liveStatusText"
    :title-tag-class="liveStatusClass"
    :status-list="statusList"
  />
</template>

<script>
import format from 'date-fns/format';
import ListItem from 'components/list-item';
import { getLiveStatusDesc } from 'common/utils/live-status';

export default {
  name: 'live-item',

  components: {
    ListItem,
  },

  props: {
    item: Object,
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
      return [`购买时间：${format(this.item.subCreateTime, 'YYYY-MM-DD')}`];
    },

    url() {
      if (!this.item.alias) return 'javascript:;';
      return this.item.liveDetailUrl;
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
