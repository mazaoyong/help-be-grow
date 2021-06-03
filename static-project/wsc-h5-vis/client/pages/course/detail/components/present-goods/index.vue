<template>
  <div class="present-goods">
    <a
      v-for="(goods, index) in list"
      :key="index"
      :href="goods.url"
      class="goods-item"
    >
      <img-wrap
        class="cover"
        width="110px"
        height="62px"
        fullfill="!small.jpg"
        :src="goods.imageUrl"
        :cover="false"
      />
      <div class="info">
        <p class="title">
          {{ goods.title }}
        </p>
        <p class="desc">
          {{ goods.presentSkuDesc }}
        </p>
        <p v-theme:color.main class="price">
          ￥{{ format(goods.presentPrice) }}
        </p>
      </div>
      <div class="number">
        x{{ goods.num }}
      </div>
    </a>
  </div>
</template>

<script>
import format from '@youzan/utils/money/format';
import { ImgWrap } from '@youzan/vis-ui';

export default {
  components: {
    ImgWrap,
  },

  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },

  methods: {
    format(money) {
      return format(money);
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.present-goods {
  padding: 0 12px;

  .goods-item {
    display: flex;
    justify-content: space-between;
    padding: 12px;
    margin-bottom: 12px;
    background-color: $background-color;
    border-radius: 4px;

    .cover {
      flex-shrink: 0;
      margin-right: 8px;
      border-radius: 2px;
    }

    .info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 100%;
      overflow: hidden;
      font-size: 12px;
      line-height: 16px;

      .title {
        @include ellipsis;

        color: $main-text-color;
      }

      .desc {
        margin-top: 8px;
        color: $disabled-color;
      }

      .price {
        font-size: 14px;
        font-weight: bold;
      }
    }

    .number {
      display: flex;
      align-items: center;
      font-size: 12px;
      color: $disabled-color;
    }
  }
}
</style>
