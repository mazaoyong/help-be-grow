<template>
  <div class="activity-entry-empty">
    <no-course
      class="no-activity"
      desc="机构暂无活动 去看看其他课程"
    >
      <van-button
        text="进店逛逛"
        color="#fc4952"
        round
        @click="toHome"
      />
    </no-course>
  </div>
</template>

<script>

import NoCourse from '@/pages/edu/components/no-course/index.vue';
import { Button as VanButton } from 'vant';
import { redirect } from '@/common/utils/custom-safe-link';

export default {
  name: 'activity-entry-empty',

  components: {
    NoCourse,
    VanButton,
  },

  data() {
    return {
    };
  },
  methods: {
    toHome() {
      redirect({
        url: '/wscshop/showcase/homepage',
        query: {
          kdt_id: _global.kdtId,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  .activity-entry-empty{
    padding: 12px 16px;
      .no-activity {
      padding: 50px 0 0;

      .van-button {
        padding: 0 20px;
        height: 36px;
        line-height: 36px;
      }
    }
  }
</style>
