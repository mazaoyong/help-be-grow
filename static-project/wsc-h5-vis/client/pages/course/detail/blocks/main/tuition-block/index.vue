<template>
  <info-cell-group
    v-if="show"
    v-tab="tab"
    class="tution-block"
  >
    <info-cell
      v-log="['tution_fix_click', '点击攒学费固定入口']"
      title="活动"
      is-link
      @click="handleClick"
    >
      <div class="info">
        <mini-font-tag
          :color="mainColor"
          :background-color="backgroundColor"
          class="tag"
          height="14px"
          text="攒学费"
        />
        <span>限时领
          <span v-theme:color.main>{{ formattedmaxTuition }}</span>
          元学费，可抵扣课程费用
        </span>
      </div>
    </info-cell>
  </info-cell-group>
</template>

<script>
import { fns } from '@youzan/vue-theme-plugin';
import MiniFontTag from '@/components/mini-font-tag';
import { InfoCell, InfoCellGroup } from '@/pages/course/detail/components/info-cell';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import { redirect } from '@/common/utils/custom-safe-link';
import format from '@youzan/utils/money/format';

export default {
  components: {
    MiniFontTag,
    InfoCell,
    InfoCellGroup,
  },

  rootState: ['goodsData', 'activityTypes', 'activityData', 'env', 'priorActivityType'],
  rootGetters: ['isColumn', 'isOnlineCourse', 'maxTuition'],

  computed: {
    show() {
      if (this.isOnlineCourse && this.env.isIOSWeapp) {
        return false;
      }
      if (this.isOnlineCourse && this.goodsData.isOwnAsset) {
        return false;
      }
      return this.activityTypes.includes(ACTIVITY_TYPE.TUITION) &&
        this.priorActivityType === ACTIVITY_TYPE.TUITION;
    },

    tab() {
      if (this.isColumn) {
        return {
          index: 1,
          title: '专栏介绍',
        };
      }
      return null;
    },

    mainColor() {
      return this.$theme.colors.main;
    },

    backgroundColor() {
      return fns.hexToRgba(this.mainColor, 0.1);
    },

    formattedmaxTuition() {
      if (!this.maxTuition) {
        return 0;
      }
      return +format(this.maxTuition, true, false);
    },
  },

  methods: {
    handleClick() {
      const { activityAlias = '' } = this.activityData || {};
      redirect({
        url: `wscvis/ump/tuition/${activityAlias}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.tution-block {
  margin-bottom: 8px;

  .info {
    @include ellipsis;

    .tag {
      padding: 0 2px;
      margin-right: 8px;
    }
  }
}
</style>
