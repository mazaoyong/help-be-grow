<template>
  <div class="package-list">
    <section
      v-for="(item, index) in packages"
      :key="index"
      class="package-list__section"
    >
      <p v-if="!isHideTip" class="main-goods__paid">
        你已拥有此活动课程，不可购买
      </p>
      <van-checkbox-group v-model="checkedList">
        <!-- 搭配套餐 -->
        <template v-if="mainGoods">
          <van-cell class="package-list__section-list main-goods" :border="false">
            <vis-icon
              slot="icon"
              class="package-list__section-list-icon"
              name="check"
              font-size="20px"
              color="#c8c9cc"
            />
            <goods-item
              slot="title"
              :package-index="0"
              :goods-index="-1"
              :activity-id="item.activity.activityId"
              :goods="mainGoods"
              :is-match-package="isMatchPackage"
              @showSku="onShowSku"
            />
          </van-cell>
        </template>

        <van-cell-group :border="false">
          <van-cell
            v-if="packages.length > 1"
            class="solid-package"
            :border="false"
            @click="togglePackage(index, item)"
          >
            <van-checkbox
              slot="icon"
              ref="packageCheckboxes"
              :name="item.activity.activityAlias"
              :checked-color="themeColor"
              :disabled="!item.isCanSelectSolidPackage"
            />
            <p
              slot="title"
              class="package-title"
            >
              <span class="package-tag theme-tag">
                固定套餐
              </span>
              <span>{{ item.activity.title }}</span>
            </p>
            <span class="package-save-price" :style="{color: themeColor}">共节省￥{{ item.savePrice }}</span>
          </van-cell>
          <van-cell
            v-for="(goods, gindex) in item.goodsList"
            :key="goods.id"
            class="package-list__section-list goods-list"
            :border="false"
            @click="toggleGoods(gindex, goods, item.activity, index)"
          >
            <van-checkbox
              v-if="isMatchPackage"
              slot="icon"
              ref="goodsCheckboxes"
              class="package-list__section-list-check"
              :checked-color="themeColor"
              :name="goods.id"
              :disabled="!goods.isCanSelectGood"
            />

            <goods-item
              slot="title"
              :package-index="index"
              :goods-index="gindex"
              :activity-id="item.activity.activityId"
              :goods="goods"
              :is-match-package="isMatchPackage"
              @showSku="onShowSku"
            />
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>
    </section>
  </div>
</template>

<script>
import { Checkbox, CheckboxGroup, CellGroup, Cell } from 'vant';
import { Icon } from '@youzan/vis-ui';
import Args from 'zan-utils/url/args';
import { mapState } from 'vuex';
import { themeColor } from 'common/constants';
import GoodsItem from './GoodsItem';

const globalTheme = window._global.globalTheme || '';

const icon = {
  normal: 'https://img01.yzcdn.cn/public_files/2019/04/01/d47a25ce53226982068cb7da815ca420.png',
  active: 'https://img01.yzcdn.cn/public_files/2019/04/01/bcd4aeddc000d5ae980eb1b0cd70eee2.png',
};

export default {
  name: 'package-lists',

  components: {
    GoodsItem,
    'van-cell-group': CellGroup,
    'van-cell': Cell,
    'van-checkbox': Checkbox,
    'van-checkbox-group': CheckboxGroup,
    'vis-icon': Icon,
  },

  data() {
    return {
      icon,
      productAlias: Args.get('productAlias'),
      packageAlias: Args.get('packageAlias'),
      type: Args.get('type'),
      themeColor: themeColor[globalTheme],
    };
  },

  computed: {
    ...mapState([
      'isMatchPackage',
      'checkedList',
      'mainGoods',
      'packages',
      'isSeletedSku',
    ]),

    checkedList: {
      get() {
        return this.$store.state.checkedList;
      },
      set(newVal) {
        this.$store.commit('SET_CHECKED_LIST', newVal);
      },
    },

    isHideTip() {
      if (this.isMatchPackage) {
        const { owlType, isPaid } = this.mainGoods;
        if (owlType !== 10 && isPaid) {
          return false;
        }
      }
      return true;
    },
  },

  watch: {
    mainGoods: {
      immediate: true,
      handler(mainGoods) {
        if (mainGoods) {
          this.$store.commit('SET_CHECKED_LIST', [mainGoods.id]);
        }
      },
    },

    isSeletedSku(val) {
      const { goodsIndex, goods, activity } = this.$store.state.selectedGoodsData;
      if (val && goodsIndex !== -1) {
        this.selectGoods(goodsIndex, goods, activity);
      }
    },
  },

  created() {
    if (this.packages.length > 1) {
      let dafaultSelectedSolidPackage = this.packages.find((pk) => {
        return pk.isCanSelectSolidPackage === true;
      });
      this.$store.commit('SET_CHECKED_LIST', [dafaultSelectedSolidPackage.activity.activityAlias]);
      // this.packages[0].isCanSelectSolidPackage && this.$store.commit('SET_CHECKED_LIST', [this.packages[0].activity.activityAlias]);
    }
  },

  methods: {

    onShowSku(sku, packageIndex, goodsIndex) {
      this.$emit('showSkuPopup', sku, packageIndex, goodsIndex);
    },

    // 多套餐选择套餐
    togglePackage(index, item) {
      // 套餐不可选时直接return；
      if (!item.isCanSelectSolidPackage) {
        return;
      }
      const { activity = {}, goodsList } = item;
      const { activityAlias } = activity;

      this.$store.commit('SET_CHECKED_LIST', [activityAlias]);
      this.$store.commit('SET_CURRENT_ACTIVITY', activity);
      this.$store.commit('RESET_PAY_GOODS_LIST', []);

      if (this.checkedList.indexOf(activityAlias) > -1) {
        const btnPrices = {
          totalPrice: activity.price,
          savePrice: item.decrease,
        };

        this.$store.commit('SET_BTN_PRICES', btnPrices);
        this.$store.commit('GENERATE_PAY_GOODS_LIST', {
          currentActivity: activity,
          currentGoodsList: goodsList,
        });
      }
    },

    toggleGoods(index, goods, activity, packageIndex) {
      // 如果是固定套餐
      if (activity.type !== 1) {
        return;
      }

      if (!goods.isCanSelectGood) {
        return;
      }

      // 多规格唤起sku
      if (goods.hasMultiSkus && !goods.currentSkuId) {
        this.$store.dispatch('FETCH_GOODS_SKU', {
          activityId: activity.activityId,
          productAlias: goods.alias,
          packageIndex,
          goodsIndex: index,
        });

        return;
      }

      this.selectGoods(index, goods, activity);
    },

    selectGoods(goodsIndex, goods, activity, type = 0) {
      if (!type) {
        this.$refs.goodsCheckboxes[goodsIndex].toggle();
      }
      // toggle函数在vant 2.0是setTimeout异步函数
      setTimeout(() => {
        const { payGoodsList } = this.$store.state;
        if (this.checkedList.indexOf(goods.id) > -1) {
          const isChoosed = payGoodsList.some(v => v.goodsId === goods.id);
          !isChoosed && this.$store.commit('GENERATE_PAY_GOODS_LIST', {
            currentActivity: activity,
            currentGoodsList: [goods],
          });
          this.$store.commit('SET_IS_SELETED_SKU', false);
          return;
        }
        let delIndex = null;
        payGoodsList.forEach((v, index) => {
          if (v.goodsId === goods.id) {
            delIndex = index;
          }
        });
        const newPayGoodsList = payGoodsList.slice(0);
        newPayGoodsList.splice(delIndex, 1);

        this.$store.commit('RESET_PAY_GOODS_LIST', newPayGoodsList);
        this.$store.commit('SET_IS_SELETED_SKU', false);
      }, 10);
    },
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';

.package-list {
  margin: 12px;

  &__section {
    margin-bottom: 12px;
    border-radius: 4px;

    .van-cell-group {
      background-color: transparent;

      .solid-package {
        border-top-right-radius: 4px;
        border-top-left-radius: 4px;
        align-items: baseline;

        .van-cell__title {
          overflow: hidden;
          flex: 2;
        }
      }
    }

    .main-goods__paid {
      padding: 12px 16px;
      margin: -12px -12px 10px;
      font-size: 14px;
      line-height: 18px;
      color: #ed6a0c;
      background-color: #fffbe8;
    }

    &-list {
      &:first-child {
        border-top-right-radius: 4px;
        border-top-left-radius: 4px;
      }

      &:last-child {
        border-bottom-right-radius: 4px;
        border-bottom-left-radius: 4px;
      }

      &.goods-list {
        .van-checkbox {
          margin-top: 20px;
        }
      }

      &.main-goods {
        margin-bottom: 10px;
        border-radius: 4px;
      }

      &-icon {
        margin-top: 20px;
        margin-right: 12px;
      }

      &-check {
        margin-right: 12px;
      }
    }

    .package-tag {
      padding: 2px 4px;
      margin: 0 8px 0 12px;
      font-size: 10px;
      line-height: 14px;
      border-radius: 10px;
    }

    .package-title {
      /* max-width: 220px; */
      flex: 1;
      font-size: 11px;

      @include ellipsis;
    }

    .package-save-price {
      font-size: 11px;
    }
  }
}
</style>
