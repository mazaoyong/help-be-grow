<template>
  <!-- 分享弹窗 -->
  <div class="multi-share-pop">
    <van-actionsheet v-model="show" :description="title" cancel-text="取消">
      <slot name="header" />
      <div v-if="shareOptions.length" class="multi-share-pop__list">
        <div
          v-for="(item, index) in shareOptions"
          :key="index"
          class="multi-share-pop__item"
          @click="onShareClick(item)"
        >
          <img class="multi-share-pop__item-icon" :src="item.icon" :alt="item.text" />
          <div class="multi-share-pop__item-text">
            {{ item.text }}
          </div>
        </div>
      </div>
      <slot name="footer" />
    </van-actionsheet>
  </div>
</template>
<script>
import { ActionSheet } from 'vant';

export default {
  name: 'multi-share-pop',

  components: {
    'van-actionsheet': ActionSheet,
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },

    title: {
      type: String,
      default: '邀请好友得奖励',
    },

    shareOptions: {
      type: Array,
      default() {
        return [];
      },
    },
  },

  computed: {
    show: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },

  methods: {
    onShareClick(item) {
      this.$emit(item.type);
      this.show = false;
    },
  },
};
</script>
<style lang="scss">
@import 'mixins/index.scss';
.multi-share-pop {
  &__list {
    display: flex;
    margin: 16px 24px 8px 24px;
    align-items: center;
    justify-self: start;
    flex-wrap: wrap;
  }

  &__item {
    margin: 0 32px 8px 0;
    text-align: center;

    img {
      width: 48px;
      height: 48px;
    }

    &-text {
      margin-top: 8px;
      font-size: 12px;
      color: #646566;
    }

    &:last-child {
      margin-right: 0;
    }
  }

  .van-action-sheet__description {
    font-size: 16px;
    color: #39393a;
  }
}
</style>
