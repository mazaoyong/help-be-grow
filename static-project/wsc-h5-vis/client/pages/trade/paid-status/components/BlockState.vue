<template>
  <div class="block-state">
    <div class="block-state__state">
      {{ payStateText }}
    </div>
    <div class="block-state__price">
      <vis-current-price
        :price="price"
        :bold="false"
        :font-size="40"
        :mini-decimals="false"
        active-color="#323233"
      />
    </div>
    <version-wrapper name="appointText">
      <div v-if="tip" class="block-state__tip">
        {{ tip }}
      </div>
    </version-wrapper>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { PriceLabel } from '@youzan/vis-ui';
import { VersionWrapper } from '@/vis-shared/configs/version/components';

export default {
  name: 'block-state',

  components: {
    'vis-current-price': PriceLabel.CurrentPrice,
    VersionWrapper,
  },

  computed: {
    ...mapState([
      'payStateText',
      'price',
      'tip',
    ]),
  },
};
</script>

<style lang="scss">
.block-state {
  padding: 36px 0 12px;
  text-align: center;
  color: #323233;
  background: #fff;

  &__state {
    height: 22px;
    line-height: 22px;
    font-size: 16px;
    font-weight: 500;
  }

  &__price {
    margin-top: 16px;
    height: 40px;
    line-height: 40px;
    font-weight: 500;

    .vis-price-label__item__active {
      vertical-align: top;

      .vis-price-label__item {
        line-height: 1;

        .vis-price-symbol {
          font-size: 16px;
          font-weight: 800;
        }

        .vis-price-content {
          margin-left: 2px;
          font-family: Avenir;
          font-size: 32px;
          font-weight: 800;
        }
      }
    }
  }

  &__tip {
    margin-top: 12px;
    height: 16px;
    line-height: 16px;
    font-size: 13px;
    color: #646566;
  }
}
</style>
