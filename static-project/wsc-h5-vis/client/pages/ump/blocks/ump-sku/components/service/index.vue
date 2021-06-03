<template>
  <van-cell
    v-if="service.show"
    class="service"
    :border="false"
  >
    <template slot="title">
      <vis-icon
        v-theme:fill.main
        class="service-icon"
        size="16px"
        :name="service.icon"
      />
      <span class="service-message">{{ service.message }}</span>
    </template>
  </van-cell>
</template>

<script>
import { Cell } from 'vant';
import { Icon } from '@youzan/vis-ui';
import { mapGetters } from 'vuex';

export default {
  components: {
    'van-cell': Cell,
    'vis-icon': Icon,
  },

  computed: {
    ...mapGetters(['service']),
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.service {
  padding-left: 0;

  .service-icon {
    display: inline-block;
    margin-right: 4px;
    vertical-align: sub;
  }

  .service-message {
    display: inline-block;
    font-size: 13px;
    line-height: 24px;
    color: $vice-text-color;
  }
}
</style>
