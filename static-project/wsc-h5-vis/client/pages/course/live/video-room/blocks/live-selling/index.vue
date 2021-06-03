<template>
  <div v-if="isMobile && isLiveSellingOpen" class="live-room-selling ump-btn-box">
    <div
      ref="cartAni"
      :style="{ backgroundImage: `url(${shopCartIconSrc})` }"
      class="sprite-img"
      @click="openCouponAndGoodsPopup"
    />
    <vis-popup
      v-model="showCouponGoodsList"
      v-theme="recommendListTheme"
      get-container="body"
      title="好物推荐"
      closeable
    >
      <!-- <template v-if="hasContent"> -->
      <div class="recommend-list">
        <section v-if="couponList.length" class="recommend-list__box">
          <h1>优惠券</h1>
          <section class="recommend-list__box-list">
            <cap-coupon
              v-for="coupon in couponList"
              :key="coupon.id"
              :coupon="coupon"
              :disabled="coupon.isReceived"
              display-type="flat"
            >
              <template slot="B">
                <cap-coupon-button
                  v-if="!coupon.isReceived"
                  :btn-icon="false"
                  :btn-text="coupon.btnText"
                  @click="receiveCoupon(coupon.id)"
                />
                <cap-coupon-stamp
                  v-else
                  visible
                  width="44px"
                  height="44px"
                  url="https://img01.yzcdn.cn/public_files/74ffe0d6e2ca9c9d995d4ee15c9a63c1.png"
                />
              </template>
            </cap-coupon>
          </section>
          <div v-if="showMyCouponNav" class="coupon-list__desc">
            <span>优惠券已领取到：我的 - 优惠券/码</span>
            <a :href="couponListLink">
              <span>点击查看</span>
              <van-icon name="arrow" />
            </a>
          </div>
        </section>
        <section v-if="goodsList.length" class="recommend-list__box">
          <h1>商品</h1>
          <section class="recommend-list__box-list">
            <van-list
              :value="fetchGoodsList"
              :offset="200"
              :immediate-check="false"
              :finished="thereIsNoGoods"
              @load="handleFetchMore"
            >
              <goods-card
                v-for="goods in goodsList"
                :key="goods.id"
                v-bind="goods"
                @click="logLiveSellingPV(goods)"
              >
                <vis-current-price
                  :price="[goods.price]"
                  :mini-symbol="false"
                  :mini-decimals="false"
                />
              </goods-card>
            </van-list>
          </section>
        </section>
      </div>
      <!-- </template>
      <no-recommend v-else /> -->
    </vis-popup>
  </div>
</template>
<script>
import { List, Icon } from 'vant';
import { Popup, PriceLabel } from '@youzan/vis-ui';
import { Coupon } from '@youzan/captain';
import GoodsCard from '@/components/goods-card';

// import NoRecommend from '../../components/no-recommend';
import recommendListTheme from './theme';

// const STATIC_SHOP_CART =
//   'https://img01.yzcdn.cn/public_files/d23ed31d66fe44806b604ce09e5ac991.png';
const ANI_SHOP_CART =
  'https://b.yzcdn.cn/public_files/b9fc494271a343e67d9305ca804c04f5.png';
const { CurrentPrice } = PriceLabel;
const { CouponButton, CouponStamp } = Coupon;
export default {
  name: 'live-room-selling',

  rootState: ['liveSellingData'],
  rootGetters: [
    'isMobile',
    'showMyCouponNav',
    'liveRoomId',
    'isLiveSellingOpen',
    'goodsPageInfo',
    'goodsFetchState',
  ],

  components: {
    'van-list': List,
    'van-icon': Icon,
    'vis-popup': Popup,
    'cap-coupon': Coupon,
    'cap-coupon-stamp': CouponStamp,
    'cap-coupon-button': CouponButton,
    'goods-card': GoodsCard,
    // 'no-recommend': NoRecommend,
    'vis-current-price': CurrentPrice,
  },

  data() {
    return {
      recommendListTheme,
      showCouponGoodsList: false,
    };
  },

  computed: {
    couponListLink() {
      return `/wscump/coupon/collection?kdt_id=${_global.kdt_id}`;
    },
    // 同action，因为接口性能问题，不做根据是否有商品的动效切换
    // hasContent() {
    //   const { couponList, goodsList } = this.liveSellingData;
    //   return couponList.length > 0 || goodsList.length > 0;
    // },
    shopCartIconSrc() {
      // return this.hasContent ? ANI_SHOP_CART : STATIC_SHOP_CART;
      return ANI_SHOP_CART;
    },
    couponList() {
      return this.liveSellingData.couponList;
    },
    goodsList() {
      return this.liveSellingData.goodsList.filter((goods) => !goods.isDelete);
    },
    thereIsNoGoods() {
      return this.goodsPageInfo.total === this.liveSellingData.goodsList.length;
    },
    fetchGoodsList() {
      return this.goodsFetchState === 'pending' || false;
    },
  },

  methods: {
    openCouponAndGoodsPopup() {
      this.showCouponGoodsList = true;
      this.$rootDispatch('getLiveCouponList');
      this.$rootDispatch('getLiveGoodsList', 1);
    },
    logLiveSellingPV(goodsData) {
      this.$track.collect('goodsId', goodsData.id);
      this.$track.collect('alias', goodsData.alias);
      this.$track.collect('owlType', goodsData.owlType);
      this.$track.collect('liveRoomId', this.liveRoomId);
      this.$track.runTask('statisticPV');
    },
    handleFetchMore() {
      this.$rootDispatch('getLiveGoodsList');
    },
    receiveCoupon(couponId) {
      this.$rootDispatch('postReceiveCoupon', couponId);
    },
  },
};
</script>
<style lang="scss">
@import "mixins/index.scss";

// 原图每一张的大小
$imgSize: 44px;

@mixin getImgPosition($index) {
  background-position-y: -($index * $imgSize);
}

.live-room-selling {
  .static-img,
  .sprite-img {
    width: 44px !important;
    height: 44px !important;
    background-repeat: no-repeat;
    background-size: 44px auto;
  }

  .static-img {
    background-position: 7px;
    background-size: 30px auto;
  }

  .sprite-img {
    animation: cartAni 10s steps(1) infinite;
  }
}

.recommend-list {
  padding: 11px 16px 0;

  &__box {
    margin-bottom: 16px;

    h1 {
      margin-bottom: 12px;
      font-size: 13px;
      font-weight: bold;
    }
  }

  .pl-price-container {
    font-size: 14px;
    font-weight: bold;
  }

  .coupon-list__desc {
    display: flex;
    flex: 1;
    justify-content: center;
    font-size: 12px;

    a {
      display: inline-flex;
      margin-left: 8px;
      color: #1989fa;
    }
  }
}

.goods-card.small {
  padding: 12px 0 12px 118px !important;
}

.goods-card__btn {
  color: #fff !important;
}

// 覆盖vant-close-btn
.van-popup__close-icon--top-right {
  top: 11px;
}

.vis-standard-popup__title {
  font-weight: bold;
}

@keyframes cartAni {
  0% {
    @include getImgPosition(0);
  }
  // .1s
  1% {
    @include getImgPosition(1);
  }
  // .27s
  2.7% {
    @include getImgPosition(2);
  }
  // .3s
  3% {
    @include getImgPosition(3);
  }
  // .4s
  4% {
    @include getImgPosition(4);
  }

  5% {
    @include getImgPosition(5);
  }

  6.3% {
    @include getImgPosition(6);
  }

  7% {
    @include getImgPosition(7);
  }

  7.3% {
    @include getImgPosition(8);
  }

  8% {
    @include getImgPosition(9);
  }

  8.7% {
    @include getImgPosition(10);
  }

  10% {
    @include getImgPosition(3);
  }
}
</style>
