<template>
  <div class="reward-item">
    <div class="reward-item-icon" v-if="type !== 5">
      <img :src="icon" />
    </div>
    <div class="reward-item-list">
      <template v-if="type !== 1">
        <div class="item" v-for="(item, index) in list" :key="index">
          <template v-if="type !== 5">
            {{ item.awardCopywriting }}{{ item.awardAmount > 1 ? ` x ${item.awardAmount}` : '' }}
          </template>
          <template v-else>
            {{ item.awardCopywriting }}
          </template>
        </div>
      </template>
      <template v-else>
        <div class="item">{{ pointCount }} 个{{ pointName }}</div>
      </template>
    </div>
    <div class="reward-item-operate" v-if="canReceive" @click="handleClick">
      {{ '查看' }}
    </div>
  </div>
</template>

<script>
import { REWARD_TYPE_ICON } from '../../constants';

export default {
  name: 'reward-item',
  data() {
    return {};
  },
  props: {
    type: {
      type: Number,
      required: true,
    },
    list: {
      type: Array,
      default: () => [],
    },
    pointCount: {
      type: Number,
      default: 0,
    },
    canReceive: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    icon() {
      return REWARD_TYPE_ICON[this.type];
    },
    pointName() {
      return _global.visPointsName || '积分';
    },
  },
  methods: {
    handleClick(item) {
      this.$emit('operate', this.type);
    },
  },
};
</script>

<style lang="scss" scoped>
.reward-item {
  margin-bottom: 8px;
  padding: 0px 8px;
  display: inline-flex;
  width: 100%;
  box-sizing: border-box;
  align-items: center;
  background: #fef7ef;
  border-radius: 8px;

  &-icon {
    width: 44px;
    height: 44px;
    margin-right: 4px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  &-list {
    flex: 1;

    .item {
      margin-bottom: 16px;
      font-size: 14px;
      line-height: 20px;
      color: #323233;

      &:last-child {
        margin-bottom: 0;
        padding-bottom: 12px;
      }

      &:first-child {
        padding-top: 12px;
      }
    }
  }

  &-operate {
    margin-left: 10px;
    height: 24px;
    text-align: center;
    padding: 0 10px;
    border: 1px solid #ff5100;
    color: #ff5100;
    font-size: 14px;
    border-radius: 16px;
    line-height: 24px;
  }
}
</style>
