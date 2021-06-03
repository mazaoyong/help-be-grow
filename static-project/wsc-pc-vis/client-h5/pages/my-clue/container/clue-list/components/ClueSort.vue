<template>
  <div class="clue-sort-wrap">
    <van-collapse
      v-model="activeName"
      class="clue-sort-wrap__panel"
      border="false">
      <van-collapse-item
        class="clue-sort-wrap__panel-item"
        name="clueSort"
        :title="selectedOption">
        <div
          class="clue-sort-wrap__panel-item-content"
          v-for="(item, index) in sortOptions"
          :key="index"
          @click="onChangeSortType(item)">
          {{ item.label }}
        </div>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
import { Collapse, CollapseItem } from 'vant';
export default {
  name: 'clue-sort',

  components: {
    'van-collapse': Collapse,
    'van-collapse-item': CollapseItem,
  },

  data() {
    return {
      sortOptions: [
        {
          type: 'recordUpdatedAt',
          label: '动态更新时间倒序',
          direction: 'DESC',
        },
        {
          type: 'recordUpdatedAt',
          label: '动态更新时间正序',
          direction: 'ASC',
        },
        {
          type: 'revisitTime',
          label: '回访时间正序',
          direction: 'ASC',
        },
        {
          type: 'revisitTime',
          label: '回访时间倒序',
          direction: 'DESC',
        },
        {
          type: 'createdAt',
          label: '创建时间',
          direction: 'ASC',
        },
      ],
      activeName: [],
      selectedOption: '动态更新时间倒序',
      isBorder: false,
    };
  },

  methods: {
    onChangeSortType(item) {
      this.selectedOption = item.label;
      this.activeName = [];
    },
  },
};
</script>

<style lang="postcss">
.clue-sort-wrap {
  &__panel {
    &:after {
      border-width: 0;
    }

    &-item {
      .van-cell {
        padding-left: 0;
        padding-right: 0;
        color: #00b389;

        &:not(:last-child)::after {
          border: none;
        }

        &__title {
          flex: none;
        }

        &__right-icon {
          color: #00b389;
        }
      }
    }
  }
}
</style>
