<template>
  <div class="punch-list">
    <vis-common-list
      :params="listParams"
      :request="getAllPunchListWrap"
      immediate-check
      @error="onListError"
    >
      <vis-punch-item
        slot-scope="props"
        :alias="props.item.alias"
        :title="props.item.name"
        :thumbnail="props.item.coverUrl"
        :status="props.item.proceedStatus"
        :total-days="props.item.totalDays"
        :start-days="props.item.proceedingDays"
        :punch-days="props.item.customerGciTimes"
        :bought="props.item.bought"
      />
    </vis-common-list>
  </div>
</template>

<script>
import { Toast } from 'vant';
import { CommonList as VisCommonList, PunchItem as VisPunchItem } from '@youzan/vis-ui';
import { getAllPunchList } from '../apis/list';

export default {
  name: 'punch-list',

  components: {
    VisCommonList,
    VisPunchItem,
  },

  computed: {
    listParams() {
      return {
        size: 10,
      };
    },
  },

  methods: {
    getAllPunchListWrap: (params) => {
      return getAllPunchList(params)
        .then(res => ({
          list: res.content,
          hasNext: params.page < res.totalPages,
        }));
    },

    onListError(errMsg) {
      Toast(errMsg || '获取打卡列表错误');
    },
  },
};
</script>

<style lang="scss" scoped>
.punch-list {
  padding: 0 15px;
  margin-top: 15px;

  ::v-deep .punch-item {
    margin-top: 10px;
    border-radius: 4px;
  }
}
</style>
