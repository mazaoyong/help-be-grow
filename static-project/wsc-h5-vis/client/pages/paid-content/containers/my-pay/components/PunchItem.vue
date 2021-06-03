<template>
  <list-item
    :url="url"
    :thumbnail-url="item.coverUrl"
    :title="item.name"
    :status-list="statusList"
    :thumbnail-tag="tagText"
    :thumbnail-tag-class="tagClass"
    :theme-color="themeColor"
  />
</template>

<script>
import ListItem from 'components/list-item';
import buildUrl from '@youzan/utils/url/buildUrl';

const PUNCH_STATUS = {
  NOT_START: 1,
  STARTED: 2,
  ENDED: 3,
};

export default {
  name: 'punch-item',

  components: {
    ListItem,
  },

  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  data() {
    return {
      kdtId: window._global.kdt_id,
      PUNCH_STATUS,
    };
  },

  computed: {
    url() {
      const { alias, startAt, endAt, proceedStatus, status, kdtId = this.kdt_id } = this.item;
      if (!alias || !status) return 'javascript:;';

      return buildUrl(`/wscvis/supv/punch/task?kdt_id=${kdtId}&alias=${alias}&start_date=${startAt}&end_date=${endAt}&proceedStatus=${proceedStatus}`, '', kdtId);
    },

    tagText() {
      const { status, proceedStatus } = this.item;

      return status === 0 ? '已删除' : {
        [PUNCH_STATUS.NOT_START]: '未开始',
        [PUNCH_STATUS.STARTED]: '进行中',
        [PUNCH_STATUS.ENDED]: '已结束',
      }[proceedStatus];
    },

    tagClass() {
      return this.item.proceedStatus === PUNCH_STATUS.STARTED ? 'punch-item__tag punch-item__tag--green' : 'punch-item__tag';
    },

    themeColor() {
      return this.item.proceedStatus === PUNCH_STATUS.STARTED ? this.$theme.colors.main || '#00b389' : '#c8c9cc';
    },

    /**
     * 打卡列表项，底部描述
     */
    statusList() {
      const { item } = this;

      const statusList = [];
      let daysDesc = '';
      let timesDesc = '';
      switch (item.proceedStatus) {
        case PUNCH_STATUS.NOT_START:
          daysDesc = `共计${item.totalDays || 0}天`;
          timesDesc = '暂未开始打卡';
          break;
        case PUNCH_STATUS.STARTED:
          daysDesc = `已进行${item.proceedingDays || 0}天`;
          timesDesc = `你已打卡${item.customerGciTimes || 0}次`;
          break;
        case PUNCH_STATUS.ENDED:
          daysDesc = `共计${item.totalDays || 0}天`;
          timesDesc = `你已打卡${item.customerGciTimes || 0}次`;
          break;
        default:
          break;
      }

      statusList.push(daysDesc);
      if (timesDesc) statusList.push(timesDesc);
      return statusList;
    },
  },
};
</script>

<style lang="scss">
.punch-item {

  &__tag {
    position: absolute;
    top: 5px;
    left: 5px;
    width: auto;
    height: auto;
    padding: 1px 4px;
    line-height: 14px;
    font-size: 10px;
    color: #fff;
    border-radius: 2px;
    background: #c8c9cc;
    transform: none;

    &--green {
      background: #00b389;
    }
  }
}
</style>
