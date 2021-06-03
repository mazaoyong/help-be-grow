<template>
  <van-cell
    center
    :clickable="type !== 'disable'"
    :label="card.desc"
    :border="false"
    :class="
      type !== 'disable'
        ? 'membership-list-cell'
        : 'membership-list-cell disable-cell'
    "
    label-class="membership-list-cell-label"
    @click="type !== 'disable' ? clickHandle(card.id) : () => {}"
  >
    <div slot="title" class="membership-list-cell-title">
      <span>{{ card.name }}</span>
      <mini-font-tag
        v-if="isRecommend"
        :background-color="$theme.colors.main"
        class="membership-list-cell-tag"
        text="推荐"
        height="14px"
      />
    </div>
    <van-radio
      slot="right-icon"
      class="membership-list-cell-radio"
      :disabled="type === 'disable'"
      :name="card.id"
    />
  </van-cell>
</template>

<script>
import { Cell, Radio } from 'vant';
import MiniFontTag from 'components/mini-font-tag';

export default {
  name: 'membership-list-cell',

  components: {
    'van-cell': Cell,
    'van-radio': Radio,
    MiniFontTag,
  },

  props: {
    // 卡片内容
    card: {
      type: Object,
      default: () => {},
    },

    // 卡片类型
    type: {
      type: String,
      default: 'normal',
    },

    // 是否推荐
    isRecommend: {
      type: Boolean,
      default: false,
    },

    // 当前选中的会员优惠id
    chosenCard: {
      type: String,
      default: undefined,
    },
  },

  methods: {
    clickHandle(id) {
      this.$emit('onClickCell', id);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "mixins/index.scss";

.membership-list-cell {
  margin-bottom: 12px;
  border-radius: 4px;
  padding: 12px;

  &-tag {
    margin-left: 8px;
    padding: 0 2px;
  }

  &-label {
    color: $disabled-color;
    font-size: 14px;
    line-height: 20px;
    margin-top: 8px;
  }

  &-title {
    font-weight: 700;
    font-size: 16px;
    display: flex;
    align-items: center;
  }

  &-radio {
    padding: 0 0 0 8px;
  }
}

.disable-cell {
  color: $disabled-color;
}
</style>
