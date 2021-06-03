<template>
  <van-sku
    v-model="skuVisible"
    hide-stock
    :sku="sku"
    :initial-sku="initialSku"
    :goods="currentGoods"
    :goods-id="currentGoods.id"
    @sku-selected="onSkuSelected"
    @buy-clicked="onBuyClicked"
  >
    <template slot="sku-header">
      <div class="vis-sku-header">
        <div class="sku-img-box">
          <img-wrap
            :src="currentGoods.thumbUrl"
            :fullfill="'!100x0.jpg'"
            :cover="false"
            class="sku-img"
          />
        </div>
        <div class="price-content">
          <p class="price">
            <template v-if="isMatchPackage">
              <vis-price-label
                :price="skuPrices.activityPrice"
                font-size="16"
                :active-color="themeColor"
                :mini-symbol="false"
                :mini-decimals="false"
              />
            </template>
          </p>
          <p class="origin-price">
            价格<span :class="{'origin-price__del': isMatchPackage}">￥{{ skuPrices.originPrice }}</span>
          </p>
        </div>
      </div>
    </template>

    <div
      v-if="!currentGoods.hasMultiSkus"
      slot="sku-group"
    />
    <div slot="sku-stepper" />

    <div slot="sku-messages" />

    <!-- 地址列表和二次确认 开始 -->
    <template slot="extra-sku-group">
      <div class="vis-extra-box">
        <vis-sku-label
          v-if="addressNum"
          :num="addressNum"
          content="查看上课地点"
          @click="skuLabelClick"
        />
        <vis-service-info
          v-if="serviceMessage && currentGoods.courseType === 0"
          :message="serviceMessage"
          type="check"
        />
        <!-- <vis-service-info
          v-if="canShowTime"
          :message="courseTime"
          type="time"
        /> -->
      </div>
    </template>

    <template
      slot="sku-actions"
      slot-scope="props"
    >
      <van-button
        class="theme__button--main"
        type="primary"
        :style="{backgroundColor: themeColor, borderColor: themeColor}"
        @click="props.skuEventBus.$emit('sku:buy')"
      >
        确定
      </van-button>
    </template>
  </van-sku>
</template>

<script>
import { Sku, Button } from 'vant';
import { mapState, mapGetters } from 'vuex';
import { PriceLabel, ImgWrap } from '@youzan/vis-ui';
import get from 'lodash/get';
import { themeColor } from 'common/constants';
// import uploadImage from '@/shared/common-api/img-upload';
import { getCurrentActivityPrice, moneyToYuan } from '../common';
import { getUserPosition } from '../../../edu/utils';
import SkuLabel from '../../../edu/prod-detail/container/sku-modal/components/label';
import ServiceInfo from '../../../edu/prod-detail/container/service-info';
import * as SafeLink from '@youzan/safe-link';

const { _global } = window;

export default {
  components: {
    'van-sku': Sku,
    'van-button': Button,
    'vis-price-label': PriceLabel,
    'vis-sku-label': SkuLabel,
    'vis-service-info': ServiceInfo,
    'img-wrap': ImgWrap,
  },

  data() {
    return {
      show: false,
      url: _global.url,
      selectedSku: {},
      themeColor: themeColor[_global.globalTheme],
    };
  },

  computed: {
    ...mapState([
      'isMatchPackage',
      'checkedList',
      'payGoodsList',
      'currentGoods',
      'skuPrices',
      'sku',
    ]),
    ...mapGetters([
      'initialSku',
    ]),

    skuVisible: {
      get() {
        return this.$store.state.skuVisible;
      },
      set(newVal) {
        this.$store.commit('TOGGLE_SKU_POPUP', newVal);
      },
    },

    addressNum() {
      const storeIds = get(this.currentGoods, 'addressList') || [];
      return storeIds.length || 0;
    },

    serviceMessage() {
      const servicePledge = get(this.currentGoods, 'servicePledge') || 0;
      if (servicePledge === 1) {
        return '该课程购买成功后，不需预约到店即可体验';
      } else if (servicePledge === 2) {
        return '该课程购买成功后，需要等待商家确认';
      }
      return '';
    },
  },

  methods: {
    // 选择规格
    onSkuSelected(e) {
      this.selectedSku = e.selectedSku;
      if (e.selectedSkuComb && e.selectedSkuComb.id) {
        const skuPrices = getCurrentActivityPrice(this.currentGoods.skus, e.selectedSkuComb.id);

        this.$store.commit('SET_SKU_PRICES', skuPrices);
      }
    },

    // 重置已选的sku
    resetSelectedSku() {
      const selectedSku = {};

      this.sku.tree.forEach(item => {
        selectedSku[item.k_s] = '';
      });
      this.sku.tree.forEach(item => {
        const key = item.k_s;
        const valueId = item.v[0].id;
        if (
          item.v.length === 1 &&
          Sku.skuHelper.isSkuChoosable(this.sku.list, this.selectedSku, { key, valueId })
        ) {
          this.selectedSku[key] = valueId;
        }
      });
    },

    skuLabelClick() {
      // 点击地址的时候，先获取用户的位置
      const storeIds = JSON.stringify(this.currentGoods.addressList) || '[]';
      getUserPosition()
        .then(res => {
          // 跳转到地址列表页
          const latitude = res.latitude || 0;
          const longitude = res.longitude || 0;
          SafeLink.redirect({
            url: `/wscvis/edu/address-list?latitude=${latitude}&longitude=${longitude}&storeIds=${storeIds}&kdt_id=${_global.kdt_id}`,
            kdtId: window._global.kdt_id,
          });
        })
        .catch(err => { // 用户拒绝授权或获取用户地址失败，则不传当前的地址信息
          console.log(err.message);
          SafeLink.redirect({
            url: `/wscvis/edu/address-list?storeIds=${storeIds}&kdt_id=${_global.kdt_id}`,
            kdtId: window._global.kdt_id,
          });
        });
    },

    onBuyClicked(e) {
      const {
        packages, packageIndex, goodsIndex, isMatchPackage, mainGoods,
      } = this.$store.state;
      const {
        selectedSkuComb, selectedNum, goodsId,
      } = e;
      let selectedSkuValues = [];

      this.resetSelectedSku();

      // 获取选中的规格
      if (Object.keys(this.selectedSku).length) {
        const skuValues = Sku.skuHelper.getSelectedSkuValues(this.sku.tree, this.selectedSku);
        selectedSkuValues = skuValues.map(v => v.name);
      }

      const currentPackage = packages[packageIndex];
      const currentActivity = currentPackage.activity;
      const currentGoods = goodsIndex > -1 ? currentPackage.goodsList[goodsIndex] : mainGoods;
      const isChoosed = this.payGoodsList.some(v => v.goodsId === currentGoods.id);

      /* if (isMatchPackage && selectedNum) {
        currentGoods.num = selectedNum;
        currentGoods.desc = getDesc(currentGoods.hasMultiSkus, isMatchPackage, selectedNum);
      } */

      if (selectedSkuComb) {
        currentGoods.currentSkuId = selectedSkuComb.id;
        currentGoods.price = selectedSkuComb.price;
        currentGoods.originPrice = moneyToYuan(selectedSkuComb.price);

        if (isMatchPackage) {
          const skuPrices = getCurrentActivityPrice(currentGoods.skus, selectedSkuComb.id);
          Object.assign(currentGoods, skuPrices);
        }
      }

      if (selectedSkuValues && selectedSkuValues.length) {
        currentGoods.desc = selectedSkuValues.join('，');
      }

      // 若选中且还没生成下单数据
      if (!isChoosed) {
        this.$store.commit('GENERATE_PAY_GOODS_LIST', {
          currentActivity,
          currentGoodsList: [currentGoods],
        });
      }

      const newPayGoodsList = this.payGoodsList.map(v => {
        if (v.goodsId === goodsId && v.activityId === currentActivity.activityId) {
          v.collocationPrice = currentGoods.collocationPrice;
          selectedSkuComb && (v.skuId = selectedSkuComb.id);
          selectedSkuComb && (v.price = selectedSkuComb.price);
          isMatchPackage && (v.num = selectedNum);
        }
        return v;
      });

      if (goodsIndex > -1) {
        packages[packageIndex].goodsList[goodsIndex] = currentGoods;
        this.$store.commit('RESET_PACKAGES', packages);
      } else {
        this.$store.commit('RESET_MAINGOODS', currentGoods);
      }

      this.$store.commit('RESET_PAY_GOODS_LIST', newPayGoodsList);
      this.$store.commit('TOGGLE_SKU_POPUP', false);

      // 搭配套餐需要选中该商品
      if (isMatchPackage && goodsIndex > -1 && this.checkedList.indexOf(currentGoods.id) === -1) {
        this.$store.commit('SELETED_SKU', {
          goodsIndex,
          packageIndex,
          goods: currentGoods,
          activity: packages[packageIndex].activity,
        });
      }
      this.selectedSku = {};
    },
  },

};
</script>

<style lang="scss">
@import 'mixins/index.scss';

.vis-sku-header {
  box-sizing: border-box;
  position: relative;
  height: 89px;
  border-bottom: 1px solid #f2f2f2;
  .sku-img-box {
    position: absolute;
    top: 15px;
    left: 15px;
    width: 114px;
    height: 64px;
    border-radius: 3px;
    background-color: #f8f8f8;
    .sku-img {
      position: absolute;
      margin: auto;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      max-width: 114px;
      max-height: 64px;
    }
  }

  .price-content {
    position: absolute;
    left: 140px;
    top: 20px;
    font-size: 12px;

    .price {
      height: 21px;

      .vis-price-label__box {
        margin: 0;
        padding: 0;
      }
    }
  }

  .sku-close {
    position: absolute;
    right: 15px;
    top: 15px;
  }
}

.activity-price {
  display: inline-block;
  margin-top: 5px;
  font-size: 16px;
}

.origin-price {
  margin-top: 10px;
  color: #666;
}

.origin-price__del {
  text-decoration: line-through;
}

.vis-extra-box {
  padding: 0 15px;
}
</style>
