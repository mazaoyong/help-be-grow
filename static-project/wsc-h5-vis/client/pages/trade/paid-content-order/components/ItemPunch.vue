<template>
  <list-item
    :thumbnail-url="item.coverUrl"
    :title="item.name"
    :header-corner-text="`￥${price}`"
    :title-tag="status.tagText"
    :title-tag-class="status.tagClass"
    :status-list="[status.daysDesc]"
    :header-corner-tag="activityTag"
  />
</template>

<script>
import ListItem from 'components/list-item';

export default {
  name: 'item-punch',

  components: {
    ListItem,
  },

  props: {
    item: Object,
    price: String,
    activityTag: String,
    count: Number,
  },

  computed: {
    status() {
      const { proceedStatus, totalDays, proceedingDays } = this.item;
      let tagText = '';
      let daysDesc = '';
      let tagClass = 'bg';
      switch (proceedStatus) {
        case 1:
          tagText = '未开始';
          daysDesc = `共计${totalDays || 0}天`;
          break;
        case 2:
          tagText = '进行中';
          daysDesc = `已进行${proceedingDays || 0}天`;
          tagClass = 'bg-green';
          break;
        case 3:
          tagText = '已结束';
          daysDesc = `共计${totalDays || 0}天`;
          break;
        default:
          break;
      }

      return { tagText, daysDesc, tagClass };
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'var';

.item__footer-corner__text.text-red {
  color: $c-red;
}

.item__title-tag .bg-green {
  background-color: #00b389;
}

.item__title-tag .bg {
  background-color: #c8c9cc;
}
</style>
