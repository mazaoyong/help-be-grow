<template>
  <table class="table-list">
    <tr
      v-for="item in list"
      :key="item.name"
      :class="[item.className, item.hidden ? 'table-list-item--hidden' : '']"
      class="table-list-item"
    >
      <td
        v-if="item.name"
        :style="{ width: `${nameWidth}px` }"
        class="table-list-item__name"
      >
        {{ item.name }}
      </td>
      <td
        v-else-if="item.icon"
        class="table-list-item__icon"
      >
        <van-icon :name="item.icon" />
      </td>
      <td
        class="table-list-item__value"
      >
        {{ item.value }}
      </td>
    </tr>
  </table>
</template>

<script>
import { Icon } from 'vant';

export default {
  name: 'table-list',

  components: {
    'van-icon': Icon,
  },

  props: {
    list: {
      type: Array,
      default: () => [],
    },
    nameWidth: {
      type: Number,
      default: 66,
    },
  },
};
</script>

<style lang="scss">
.table-list {

  &-item {
    line-height: 18px;
    font-size: 13px;

    &--hidden {
      display: none;
    }

    &__name {
      padding-top: 8px;
      width: 66px;
      vertical-align: top;
      white-space: nowrap;
      color: #969799;
    }

    &__value {
      padding-top: 8px;
      color: #323233;
    }

    &__icon {
      padding-top: 8px;
      width: 16px;
      text-align: center;
      vertical-align: top;

      .van-icon {
        vertical-align: -2px;
        color: #00b389;
      }
    }
  }
}
</style>
