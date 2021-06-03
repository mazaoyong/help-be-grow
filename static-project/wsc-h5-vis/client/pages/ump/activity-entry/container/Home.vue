<template>
  <div class="activity-entry">
    <template v-for="item in activities">
      <activity-item
        :key="item.path"
        v-bind="item"
        @click="handleClick(item)"
      />
    </template>
  </div>
</template>

<script>
import ActivityItem from '../components/item';
import { ACTIVITIES_LIST, ACTIVITIES_MAP } from '../config';

import * as apis from '../api';
import { ActivityType } from '../types';
import { Toast } from 'vant';

export default {
  name: 'activity-entry',

  components: {
    ActivityItem,
  },

  data() {
    return {
      activities: ACTIVITIES_LIST.filter((item) => !item.hidden),
    };
  },

  methods: {
    handleClick(item) {
      const activityInfo = ACTIVITIES_MAP[item.path];
      const { direct, type = ActivityType.TUITION, navigate, name } = activityInfo;
      if (direct) {
        navigate();
        return;
      }
      apis.getOnGoingActivities(type).then(data => {
        if (data.length === 0) {
          Toast(`当前店铺没有进行中的${name}活动`);
          return;
        }
        /** 注意，此时只针对攒续费活动，若有活动由多个，需要在此增加逻辑 */
        const [activity] = data;
        navigate(activity);
      }).catch(() => {
        Toast('请求错误，请刷新页面');
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  .activity-entry {
    padding: 12px 16px;
  }
</style>
