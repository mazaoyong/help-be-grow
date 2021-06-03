<template>
  <info-cell-group v-if="show" class="sku-block">
    <info-cell v-if="timeStr" title="时间">
      {{ timeStr }}
    </info-cell>
    <info-cell
      v-if="choose.show"
      v-log="['click_sku', '打开sku弹窗']"
      :title="choose.title"
      is-link
      @click="handleChoose"
    >
      <div class="desc">
        {{ choose.content }}
      </div>
    </info-cell>
    <info-cell v-if="service.show">
      <div class="service">
        <vis-icon
          v-theme:fill.main
          class="service-icon"
          size="16px"
          :name="service.icon"
        />
        <span class="service-message">{{ service.message }}</span>
      </div>
    </info-cell>
  </info-cell-group>
</template>

<script>
import { Icon } from '@youzan/vis-ui';
import { InfoCell, InfoCellGroup } from '@/pages/course/detail/components/info-cell';

export default {
  components: {
    'vis-icon': Icon,
    InfoCell,
    InfoCellGroup,
  },

  rootGetters: ['timeStr', 'choose', 'service'],

  computed: {
    show() {
      return this.timeStr || this.choose.show || this.service.show;
    },
  },

  methods: {
    handleChoose() {
      const action = this.choose.action;
      action && this.$rootDispatch(action);
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.sku-block {
  margin-bottom: 8px;

  .desc {
    @include ellipsis;
  }

  .service {
    margin-left: 42px;
  }

  .service-icon {
    display: inline-block;
    margin-right: 4px;
    vertical-align: sub;
  }

  .service-message {
    display: inline-block;
    font-size: 12px;
    line-height: 24px;
    color: $disabled-color;
  }
}
</style>
