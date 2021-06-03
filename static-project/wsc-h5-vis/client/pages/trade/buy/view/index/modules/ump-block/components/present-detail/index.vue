<template>
  <popup
    class="present-detail__popup"
    :value="value"
    :buttons="buttons"
    v-on="proxyListeners"
  >
    <div slot="title" class="present-detail__title">
      <div
        v-if="isShowGoodsList"
        class="present-detail__button--back"
        @click="onClickToJump(STAGE_KEYS.PRESENT_LIST)"
      >
        <van-icon name="arrow-left" color="#c8c9cc" size="16" />
        <span>返回</span>
      </div>
      <span>{{ title }}</span>
    </div>

    <div
      v-if="active === STAGE_KEYS.PRESENT_LIST"
      class="present-detail__content"
    >
      <div class="present-detail__list">
        <present-list-item
          v-for="item in presentList"
          :key="item.title"
          text-align="left"
          :is-show-goods-list="true"
          v-bind="item"
          @click-more-goods="onClickToJump(STAGE_KEYS.GOODS_LIST)"
        />
      </div>
    </div>

    <template v-if="active === STAGE_KEYS.GOODS_LIST">
      <goods-card
        v-for="(item, index) in goodsList"
        :key="index"
        :title="item.title"
        :img="item.imageUrl"
      >
        <div class="goods-card__content">
          <span class="goods-card__sku">{{ item.presentSkuDesc }}</span>
          <span class="goods-card__num">x{{ item.num }}</span>
        </div>
      </goods-card>
    </template>
  </popup>
</template>

<script>
import { Icon } from 'vant';
import { Popup } from '@youzan/vis-ui';
import PresentListItem from '../present-list-item';
import GoodsCard from '@/components/goods-card';

const STAGE_KEYS = {
  PRESENT_LIST: 0,
  GOODS_LIST: 1,
};

export default {
  name: 'present-detail',

  components: {
    Popup,
    'van-icon': Icon,
    PresentListItem,
    GoodsCard,
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },

    proxyListeners: {
      type: Object,
      default: () => ({}),
    },

    presentList: {
      type: Array,
      default: () => [],
    },

    goodsList: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      active: STAGE_KEYS.PRESENT_LIST,
      buttons: [
        {
          text: '知道了',
          color: this.$theme.colors.main,
          onClick: this.onClickClose,
        },
      ],
    };
  },

  computed: {
    STAGE_KEYS() {
      return STAGE_KEYS;
    },

    isShowGoodsList() {
      return this.active === this.STAGE_KEYS.GOODS_LIST;
    },

    title() {
      return this.isShowGoodsList ? '课程大礼包' : '赠品';
    },
  },

  methods: {
    onClickClose() {
      this.$emit('close');
    },

    onClickToJump(stage) {
      this.active = stage;
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.present-detail {
  &__title {
    position: relative;
    padding: 0 16px;
  }

  &__button--back {
    position: absolute;
    color: $disabled-color;
    font-weight: normal;
    display: flex;
    align-items: center;
    font-size: 14px;
  }

  &__content {
    padding: 24px;
    padding-top: 20px;
  }
}

.goods-card__content {
  display: flex;
  justify-content: space-between;
}
</style>

<style lang="scss">
.present-detail__popup {
  .goods-card .info-wrap .title {
    font-size: 12px;
    font-weight: normal;
  }
}
</style>
