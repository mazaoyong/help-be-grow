<template>
  <van-goods-action class="submit-bar">
    <template v-if="isShowBuyBtn">
      <div class="price-section">
        <p class="package-price">
          <span>套餐价：</span>
          <!-- <vis-price-label :price="totalPrice" :active-color="themeColor" /> -->
          <span
            class="theme__color price"
            :style="{ color: themeColor }"
          >￥{{ fetchPrices.totalPrice }}</span>
        </p>
        <!-- <p class="save-price">
        为你节省￥{{ fetchPrices.savePrice }}
      </p> -->
        <p class="save-price">
          <span>为你节省</span>
          <vis-price-label
            :price="fetchPrices.savePrice"
            :active-color="'#969799'"
            :mini-symbol="false"
            :mini-decimals="false"
            :bold="false"
            no-split
            font-size="10"
          />
        </p>
      </div>
      <van-goods-action-big-btn
        :disabled="!isCanBuy"
        :style="{backgroundColor: themeColor}"
        :class="['submit-bar__btn', !isCanBuy ? 'submit-bar__btn-disabled' : '']"
        :text="this.purchaseButtonText"
        @click="onClickBuy"
      />
    </template>
    <template v-else>
      <div class="bottom-btn">
        <van-button
          class="btn"
          plain
          round
          @click="onNavigateToHome"
        >
          店铺主页
        </van-button>
        <van-button
          class="btn"
          plain
          round
          @click="onClickToPaid"
        >
          查看课程
        </van-button>
      </div>
    </template>
  </van-goods-action>
</template>

<script>
import { GoodsAction, GoodsActionButton, Button } from 'vant';
import { PriceLabel } from '@youzan/vis-ui';
import { themeColor } from 'common/constants';
import { mapGetters, mapState } from 'vuex';
import { navigateEnv } from 'common/utils/env';
import EduAPI from '../../../edu/api';
import * as SafeLink from '@youzan/safe-link';
import get from 'lodash/get';

const _global = window._global;
const globalTheme = _global.globalTheme || '';

export default {
  name: 'submit-bar',

  components: {
    'van-goods-action': GoodsAction,
    'van-goods-action-big-btn': GoodsActionButton,
    'van-button': Button,
    'vis-price-label': PriceLabel,
  },

  data() {
    return {
      themeColor: themeColor[globalTheme],
      homeUrl: `${_global.url.h5}/wscshop/showcase/homepage?kdt_id=${_global.kdt_id}`,
      paidCourseUrl: `${_global.url.h5}/wscvis/knowledge/index?page=mypay&kdt_id=${_global.kdt_id}`,
      purchaseButtonText: '',
    };
  },

  mounted() {
    this.getPurchaseBtnText();
  },

  computed: {
    ...mapGetters(['fetchPrices', 'isCanBuy']),
    ...mapState(['mainGoods', 'isMatchPackage']),

    isShowBuyBtn() {
      if (this.isMatchPackage) {
        const { owlType, isPaid } = this.mainGoods;
        if (owlType !== 10 && isPaid) {
          return false;
        }
      }
      return true;
    },
  },

  methods: {
    onClickBuy() {
      this.$store.dispatch('GO_BUY');
    },

    onClickToHome() {
      SafeLink.redirect({
        url: this.homeUrl,
        kdtId: window._global.kdt_id,
      });
    },

    onNavigateToHome() {
      navigateEnv();
    },

    onClickToPaid() {
      SafeLink.redirect({
        url: this.paidCourseUrl,
        kdtId: window._global.kdt_id,
      });
    },

    getbuttonCustomDescMap(customDescList) {
      let buttonCustomDescMap = {};
      customDescList.forEach(item => {
        if (item.coursePriceType === 'ZERO') {
          buttonCustomDescMap['ZERO'] = item.desc;
        } else if (item.coursePriceType === 'NON_ZERO') {
          buttonCustomDescMap['NON_ZERO'] = item.desc;
        };
      });
      return buttonCustomDescMap;
    },

    getPurchaseBtnText() { // 如果套餐中包含了课程，读取课程设置的非0元课程的文案
      const goodsList = this.$store.state.goodsList;
      let hasModule = false;
      goodsList.forEach(good => {
        if (good.hasOwnProperty('courseType')) {
          hasModule = true;
        }
      });
      if (hasModule) {
        EduAPI.getCourseSetting({ alias: this.alias || '' })
          .then(res => {
            if (res && res.data) {
              res.data.forEach(item => {
                const descList = get(item, 'courseBuyOperationSwitch.customDescList');
                if (descList && descList.length) {
                  let buttonText = this.getbuttonCustomDescMap(item.courseBuyOperationSwitch.customDescList);
                  if (Object.keys(buttonText).length !== 0) {
                    this.purchaseButtonText = buttonText['NON_ZERO'] || '立即购买';
                  } else {
                    this.purchaseButtonText = '立即购买';
                  }
                } else {
                  this.purchaseButtonText = '立即购买';
                }
              });
            };
          });
      } else {
        this.purchaseButtonText = '立即购买';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.submit-bar {
  background: #fff;

  &__btn {
    max-width: 120px;
    color: #fff;

    &-disabled {
      color: #c8c9cc;
      background-color: #ebedf0 !important;
    }
  }

  .bottom-btn {
    width: 100%;
    height: 44px;
    line-height: 44px;
    text-align: right;

    .btn {
      height: 32px;
      line-height: 1;
      margin-right: 8px;
      font-size: 12px;
      color: #323233;
    }
  }
}

.price-section {
  flex: 1;
  padding: 8px 7px 0;
  background: #fff;
  text-align: right;
  line-height: 20px;

  .vis-price-label__box {
    display: inline-block;
    margin: 0;
    padding: 0;
  }

  .package-price {
    font-size: 14px;
    color: #323233;

    .price {
      color: #f44;
    }
  }

  .save-price {
    font-size: 12px;
    color: #969799;

    .vis-price-label__item__active {
      font-size: 10px !important;
    }
  }
}
</style>
