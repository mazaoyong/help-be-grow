<template>
  <div :id="`content-${contentProgressAlias}`" @click="recordProgress">
    <list-item
      class="item-live"
      :url="url"
      :thumbnail-url="item.cover"
      thumbnail-icon-tag="直播"
      :is-learning="contentProgressAlias === item.alias && !isLearnEnd"
      :title="item.title"
      :title-tag="liveStatusText"
      :title-tag-class="liveStatusClass"
      :status-list="statusList"
      :footer-corner-text="freeText"
      footer-corner-text-class="text-red"
      :show-footer-corner-lock="false"
      @click="recordProgress"
    />
  </div>
</template>

<script>
// import { Toast } from 'vant';
import ListItem from 'pct/components/list-item';
import { getLiveStatusDesc } from 'common/utils/live-status';
import { getMediaSuffix, formatSalesNum } from 'common/utils/hide-info';
import buildUrl from '@youzan/utils/url/buildUrl';

export default {
  name: 'item-live',

  components: {
    ListItem,
  },

  props: {
    item: Object,
    isOwned: Boolean,
    contentProgressAlias: String,
    isLearnEnd: Boolean,
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

    freeText() {
      return !this.isOwned && this.item.isFree ? '免费试看' : '';
    },

    url() {
      if (!this.item.alias) return 'javascript:;';
      return buildUrl(`/wscvis/knowledge/index?kdt_id=${window._global.kdt_id}&p=livedetail&alias=${this.item.alias}`, '', this.kdtId);
    },

    statusList() {
      const list = [this.item.liveStartAt];
      const pageView = `${formatSalesNum(this.item.pageView)}${getMediaSuffix(this.item.mediaType)}`;
      if (!this.isPaid && this.item.pageView) {
        list.push(pageView);
      }
      return list;
    },
  },

  methods: {
    recordProgress() {
      this.$emit('record-page', { ...this.item, url: this.url });
    },
    // onCheckLock() {
    //   if (this.item.alias && (!this.isOwned && !this.item.isFree)) Toast('购买专栏后可查看');
    // },
  },
};
</script>

<style lang="scss">
@import 'var';

.item-live {
  .item__footer-corner__text.text-red {
    display: block;
    padding: 5px 8px;
    font-size: 11px;
    color: $c-red;
    border-radius: 11px;
  }

  .item__title-tag {
    border-radius: 99px;
  }

  .item__status-list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .item__status {
    line-height: 16px;
  }

  // 目前只有两个，最后一个是浏览量
  .item__status:last-child {
    padding-left: 0;
  }
}

.item__title-tag.bg-green {
  background: #00b389;
}

.item__title-tag.bg-red {
  background: #f44;
}
</style>
