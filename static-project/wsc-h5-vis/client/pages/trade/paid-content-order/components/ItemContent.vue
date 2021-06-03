<template>
  <list-item
    :thumbnail-url="item.cover"
    :thumbnail-icon="thumbnailIcon"
    :title="item.title"
    :status-list="[publishAt]"
    :header-corner-text="`￥${price}`"
    :header-corner-tag="activityTag"
    :footer-corner-text="`x${count}`"
    :use-points="usePoints"
    :points-info="pointsPrice"
  />
</template>

<script>
import ListItem from 'components/list-item';
import MixinItem from './mixins/mixin-item';
import { format } from 'date-fns';

export default {
  name: 'item-content',

  components: {
    ListItem,
  },

  mixins: [MixinItem],

  props: {
    item: Object,
    price: String,
    activityTag: String,
    count: Number,
    pointsInfo: Object,
  },

  computed: {
    thumbnailIcon() {
      return [
        '',
        'https://img01.yzcdn.cn/weapp/paidcontent/doc.png',
        'https://img01.yzcdn.cn/weapp/paidcontent/music.png',
        'https://img01.yzcdn.cn/weapp/paidcontent/video.png',
      ][this.item.mediaType || 0];
    },
    publishAt() {
      return format(this.item.publishAt, 'YYYY-MM-DD');
    },
  },
};
</script>

<style lang="scss">
@import 'var';

.item__footer-corner__text.text-red {
  color: $c-red;
}
</style>
