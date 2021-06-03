<template>
  <div class="membership-list">
    <van-radio-group
      class="membership-list__content"
      :value="chosenCard"
      icon-size="20"
      :checked-color="$theme.colors.main"
    >
      <membership-list-cell
        v-for="(item, index) in cards"
        :key="item.id"
        type="normal"
        :card="item"
        :is-recommend="index === 0"
        @onClickCell="onClickCell"
        @onClose="onClose"
      />
    </van-radio-group>
    <div v-if="unavailableCards.length > 0" class="unavailable-membership-list">
      <div class="unavailable-membership-list__title">以下权益卡本店不可用</div>
      <van-radio-group class="membership-list__content" icon-size="20">
        <membership-list-cell
          v-for="item in unavailableCards"
          :key="item.id"
          type="disable"
          :card="item"
        />
      </van-radio-group>
    </div>
  </div>
</template>

<script>
import { RadioGroup } from 'vant';
import MembershipListCell from './cell.vue';

export default {
  name: 'membership-list',

  components: {
    'van-radio-group': RadioGroup,
    'membership-list-cell': MembershipListCell,
  },

  props: {
    // 会员优惠列表
    cards: {
      type: Array,
      default: () => [],
    },

    // 无效的会员优惠列表
    unavailableCards: {
      type: Array,
      default: () => [],
    },

    // 当前选中的会员优惠id
    chosenCard: {
      type: String,
      default: undefined,
    },
  },

  methods: {
    onClickCell(id) {
      this.$emit('select', id, this.onClose);
    },

    onClose() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
@import "mixins/index.scss";

.membership-list {
  padding: 12px;
  background-color: $background-color;

  .unavailable-membership-list {
    &__title {
      font-size: 14px;
      color: #969799;
      padding: 8px 0px 12px 0px;
    }
  }
}
</style>
