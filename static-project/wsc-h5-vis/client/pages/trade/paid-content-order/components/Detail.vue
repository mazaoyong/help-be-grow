<template>
  <div class="paid-order__wrap">
    <p class="paid-order__desc">
      {{ text }}
    </p>
    <component
      :is="`item-${type}`"
      :item="detail"
      :price="price"
      :points-info="pointsInfo"
      :activity-tag="activityTag"
      :count="count"
    />
  </div>
</template>

<script>
import ItemContent from './ItemContent';
import ItemColumn from './ItemColumn';
import ItemLive from './ItemLive';
import ItemPunch from './ItemPunch';

export default {
  name: 'detail',

  components: {
    ItemContent,
    ItemColumn,
    ItemLive,
    ItemPunch,
  },

  props: {
    type: String,
    detail: Object,
    activityTag: String,
    count: Number,
    pointsInfo: {
      type: Object,
      default: null,
    },
  },

  computed: {
    price() {
      const price = this.type === 'punch' ? this.detail.participatePrice : this.detail.price;
      return isNaN(price / 100)
        ? '0.00'
        : (price / 100).toFixed(2);
    },

    text() {
      const typeEnum = {
        'column': '购买专栏',
        'content': '购买内容',
        'live': '购买直播',
        'punch': '购买打卡',
      };
      return typeEnum[this.type];
    },

    wrapStyle() {
      const marginBottom = this.type === 'column' ? '70px' : '45px';
      return { marginBottom };
    },
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';
@import "var";

$box-shadow-color: #e5e5e5;
$c-gray-border: #e0e0e0;

.paid-order {
  &__wrap {
    position: relative;
    padding: 29px 0 0;
    background-color: $c-white;

    .item {
      background: #fafafa;
    }
  }
  &__price {
    margin-bottom: 30px;
    line-height: 40px;
    font-size: 28px;
    color: $c-black;
    text-align: center;
    > i {
      font-size: 18px;
      font-style: normal;
    }
  }
  &__title {
    margin-bottom: 20px;
    font-size: 16px;
    color: $c-gray-darker;
  }
  &__cover {
    margin: 0 auto;
    position: relative;
  }
  &__desc {
    margin-bottom: 11px;
    padding-left: 15px;
    font-size: 14px;
    color: $c-darker;
  }
  &__content-cover {
    width: 80px;
    height: 60px;
    border-radius: 3px;
  }
  &__column-cover {
    width: 67.5px;
    height: 90px;
  }
  &__img {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    max-width: 100%;
    max-height: 100%;
    border-radius: 3px;
  }
}

.paid-content__column--pay,
.paid-content__content--pay {
  position: initial;
  background: #fafafa;
  margin: 0 -15px;
  z-index: 1;
}

.paid-content__column--pay {
  /* bottom: -35px; */

  .paid-content__column-price {
    color: $c-black;
  }
}

.paid-content__content--pay {

  .paid-content__content-price {
    color: $c-black;
  }
}
</style>
