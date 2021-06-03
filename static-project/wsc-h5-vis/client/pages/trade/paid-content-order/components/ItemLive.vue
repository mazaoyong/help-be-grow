<template>
  <list-item
    :thumbnail-url="item.cover"
    :thumbnail-icon="thumbnailIcon"
    :title="item.title"
    :title-tag="liveStatusText"
    :title-tag-class="liveStatusClass"
    :status-list="[liveStartAt]"
    :header-corner-text="`￥${price}`"
    :header-corner-tag="activityTag"
    footer-corner-text="x1"
    :use-points="usePoints"
    :points-info="pointsPrice"
  />
</template>

<script>
import ListItem from 'components/list-item';
import MixinItem from './mixins/mixin-item';
import { format } from 'date-fns';

export default {
  name: 'item-live',

  components: {
    ListItem,
  },

  mixins: [MixinItem],

  props: {
    item: Object,
    price: String,
    activityTag: String,
  },

  data() {
    return {
      thumbnailIcon: 'https://img01.yzcdn.cn/public_files/2018/04/08/icon_live.png',
    };
  },

  computed: {
    liveStatusText() {
      return [
        '已删除',
        '未开始',
        '直播中',
        '回看',
        '回放中',
      ][this.item.liveStatus];
    },

    liveStatusClass() {
      return [
        '',
        'bg-green',
        'bg-red',
        '',
      ][this.item.liveStatus];
    },

    liveStartAt() {
      return format(this.item.liveStartAt, 'YYYY-MM-DD HH:mm:ss');
    },
  },
};
</script>

<style lang="scss">
@import 'var';

.item__footer-corner__text.text-red {
  color: $c-red;
}

.item__title-tag.bg-green {
  background: #4b0;
}

.item__title-tag.bg-red {
  background: #f44;
}
</style>
