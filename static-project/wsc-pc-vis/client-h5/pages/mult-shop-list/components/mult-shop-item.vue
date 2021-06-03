<template>
  <div class="mult-shop-item" @click="onShopSelected">
    <div class="mult-shop-item--wrap">
      <div class="item-content">
        <span class="item-content__name">{{ multShopName }}</span>
        <span class="item-content__tag">
          {{ tagText }}
        </span>
      </div>
      <div v-if="isActive" class="item-choose">
        <van-icon name="success" color="#00b389" />
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from 'vant';

export default {
  name: 'mult-shop-item',
  components: {
    'van-icon': Icon,
  },
  props: {
    multShopName: {
      type: String,
      default: '大悦城店铺',
    },
    tagType: {
      type: Number,
      default: 1,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    kdtid: {
      type: Number,
      default: 0,
    },
    shopRole: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    tagText() {
      if (this.shopRole === 1) {
        return '总部';
      } else {
        if (this.tagType === 1) {
          return '直营';
        }
        if (this.tagType === 2) {
          return '加盟';
        }
        if (this.tagType === 3) {
          return '仓储';
        }
        if (this.tagType === 4) {
          return '联营';
        }
        if (this.tagType === 5) {
          return '合伙人';
        }
        return '';
      }
    },
  },
  methods: {
    onShopSelected() {
      this.$emit('selected-info', {
        kdtid: this.kdtid,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.mult-shop-item {
  padding: 0 15px;

  &--wrap {
    display: flex;
    padding: 14px 0;
    justify-content: space-between;
    border-bottom: 1px solid #ebedf0;
  }

  .item-content {
    &__name {
      max-width: 240px;
      display: inline-block;
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      vertical-align: middle;
    }

    &__tag {
      display: inline-block;
      padding: 0 5px;
      font-size: 12px;
      line-height: 17px;
      color: #00b389;
      border: 1px solid #00b389;
      border-radius: 2px;
      margin-left: 8px;
      vertical-align: middle;
    }
  }
}
</style>
