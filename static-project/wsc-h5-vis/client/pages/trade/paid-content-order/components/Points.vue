<template>
  <div class="paid-content__points-wrap">
    <div class="paid-content__points-item">
      <span class="paid-content__points-label">{{ pointsName }}</span>
      <span class="paid-content__points-value">
        <span class="points-tip">
          <span>共{{ userPoints }}{{ pointsName }}，本单抵扣</span><span>{{ pointsPrice }}{{ pointsName }}</span>
        </span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'points',

  props: {
    // 积分价格
    pointsPrice: {
      type: Number,
      default: 0,
    },
    // 剩余积分
    userPoints: {
      type: Number,
      default: window._global.userPoints || 0,
    },
  },

  inject: ['pointsName'],
};
</script>

<style lang="scss">
@import "var";

.paid-content__points-wrap {
  padding: 10px 16px;
  background-color: #fff;
  margin-top: 1px;

  .paid-content__points-item {
    font-size: 14px;
    line-height: 25px;
    overflow: hidden;

    .paid-content__points-label {
      color: $c-black;
    }

    .paid-content__points-value {
      float: right;
      // color: $c-gray-darker;
      color: #969799;
      padding-right: 15px;

      .points-tip {
        display: inline-block;
        max-width: calc(100vw - 130px);
        text-align: right;

        & > span {
          display: inline-block;
          white-space: nowrap;
        }
      }

      &.total-value {
        color: $c-red-light;
      }
    }
  }
}
</style>
