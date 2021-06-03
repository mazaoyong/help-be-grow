<template>
  <list-item
    :url="url"
    :thumbnail-url="item.cover"
    :thumbnail-icon="thumbnailIcon"
    :title="item.title"
    :subtitle="subtitle"
    :status-list="statusList"
  />
</template>

<script>
import format from 'date-fns/format';
import ListItem from 'components/list-item';
import { ACTIVITY_TYPE } from 'pct/constants';

export default {
  name: 'content-item',

  components: {
    ListItem,
  },

  props: {
    item: Object,
    progress: Object,
  },

  data() {
    return {
      kdtId: window._global.kdt_id,
    };
  },

  computed: {
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
      const list = [];
      if (this.isGift) {
        return [`领取时间：${format(item.subCreateTime, 'YYYY-MM-DD')}`];
      }

      const boughtDate = `购买时间：${format(item.subCreateTime, 'YYYY-MM-DD')}`;
      list.push(boughtDate);

      if (this.progress.percent) {
        list.push({
          text: +this.progress.percent === 100
            ? `已${this.typeSuffix}完` : `${this.progress.percent}%`,
          color: '#00bf00',
        });
      }

      return list;
    },

    subtitle() {
      if (this.isGift) return `${this.item.fromUserName || '匿名用户'}请你看`;
      return '';
    },

    url() {
      if (!this.item.alias) return 'javascript:;';
      // 连锁进店逻辑需要的url
      return this.item.contentDetailUrl;
    },

    thumbnailIcon() {
      return [
        '',
        'https://img01.yzcdn.cn/weapp/paidcontent/doc.png',
        'https://img01.yzcdn.cn/weapp/paidcontent/music.png',
        'https://img01.yzcdn.cn/weapp/paidcontent/video.png',
      ][this.item.mediaType || 0];
    },

    isGift() {
      return this.item.channelType === ACTIVITY_TYPE.PERSENT_GIFT ||
        this.item.channelType === ACTIVITY_TYPE.INVITE_FRIEND;
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
