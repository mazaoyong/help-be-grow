<template>
  <div class="present-list-item" :style="{ textAlign }">
    <div class="present-list-item__label">
      {{ title }}
    </div>

    <div
      class="present-list-item__desc van-ellipsis"
      :title="desc | formatDesc"
    >
      {{ desc | formatDesc }}
    </div>

    <div v-if="isShowGoodsList && goodsList.length > 0" class="goods-list">
      <div
        v-for="(item, index) in displayGoodsList"
        :key="index"
        class="goods-list__item"
      >
        <img-wrap
          class="goods-list__item-img"
          :width="'112px'"
          :height="'64px'"
          :src="item.imageUrl"
          :fullfill="'!220x220.2x.jpg'"
          :cover="false"
        />
        <p class="goods-list__item-detail">
          <span
            v-if="!item.hidePrice"
            v-theme.main
            class="goods-list-item__price"
          >
            {{ item.presentPrice | formatMoney }}
          </span>

          <span
            class="goods-list__item-sku van-ellipsis"
            :title="item.presentSkuDesc"
          >
            {{ item.presentSkuDesc }}
          </span>
        </p>
      </div>

      <div
        v-if="goodsList.length > 2"
        class="more-link"
        @click="onClickMoreGoods"
      >
        <vis-icon name="arrow-circle" size="16px" color="#c8c9cc" />
        <p class="more-link__text">
          查看更多
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ImgWrap, Icon } from '@youzan/vis-ui';

export default {
  name: 'present-list-item',

  components: {
    ImgWrap,
    'vis-icon': Icon,
  },

  filters: {
    formatDesc(list) {
      return list.join('；');
    },
  },

  props: {
    title: {
      type: String,
      default: '',
    },

    desc: {
      type: Array,
      default: () => [],
    },

    goodsList: {
      type: Array,
      default: () => [],
    },

    textAlign: {
      type: String,
      default: 'right',
    },

    isShowGoodsList: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    displayGoodsList() {
      return this.goodsList.slice(0, 2);
    },
  },

  methods: {
    onClickMoreGoods() {
      this.$emit('click-more-goods');
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.present-list-item {
  &:not(:last-child) {
    margin-bottom: 16px;
  }

  &__label {
    font-size: 14px;
    line-height: 24px;
    font-weight: 500;
    color: $main-text-color;
  }

  &__desc {
    font-size: 12px;
    line-height: 16px;
    margin-top: 4px;
    font-weight: normal;
    color: $disabled-color;
  }
}

.goods-list {
  padding: 8px;
  margin-top: 16px;
  border-radius: 4px;
  background-color: #f7f8fa;
  display: flex;

  &__item {
    margin-right: 8px;

    &:last-child {
      margin-right: 0;
    }

    &-detail {
      margin-top: 8px;
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      line-height: 18px;
      width: 112px;
    }

    &-sku {
      color: #646566;
    }

    &-img {
      border-radius: 4px;
    }
  }
}

.more-link {
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1 1 auto;

  &__text {
    padding-top: 4px;
    line-height: 16px;
    color: $disabled-color;
    @include mini-font;
  }
}
</style>
