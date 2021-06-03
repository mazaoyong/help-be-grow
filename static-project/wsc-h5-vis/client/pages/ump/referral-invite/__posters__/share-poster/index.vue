<template>
  <div
    class="recommend-gift-normal"
    :style="{backgroundImage: `url(${backgroundUrl})`}"
  >
    <div class="recommend-gift-normal__title">
      <div v-if="drawInfo.commissionPrice" class="max-profit-title">
        买课{{ highest }}立减￥<span>{{ format(drawInfo.decreasePrice, true, false) }}</span>
      </div>
      <div v-if="!currentPrice" class="free-title">
        <img src="https://img01.yzcdn.cn/upload_files/2020/12/09/FmkqQHNRr5Z815dKGBD-dPovq_5r.png">
      </div>
    </div>
    <div class="recommend-gift-normal__panel">
      <div class="main__user">
        <img class="user__avatar" :src="drawInfo.userAvatar" alt="">
        <div class="user__info">
          <p class="user__info-name">
            {{ drawInfo.userName }}
          </p>
          <p class="user__info-desc">
            “这节课太好了，邀你一起加入学习”
          </p>
        </div>
      </div>

      <div class="main__img">
        <img class="main__img-real" :src="drawInfo.imageUrl" alt="">
      </div>

      <p class="main__title">
        {{ drawInfo.goodsName }}
      </p>

      <div class="main__price-container">
        <div class="main__price">
          <div v-if="currentPrice" class="main-price__current">
            <span class="current-price__symbol">￥</span>
            <span class="current-price__front">{{ formatCurrentPrice[0] }}</span>
            <span v-if="formatCurrentPrice[1]" class="current-price__dot">.</span>
            <span class="current-price__end">{{ formatCurrentPrice[1] }}</span>
            <span v-if="drawInfo.multiSku" class="current-price__text">起</span>
          </div>
          <div v-else class="main-price__current">
            免费
          </div>
          <div
            v-if="currentPrice < originPrice"
            class="main-price__origin"
          >
            <span class="origin-price__symbol">￥</span>
            <span class="origin-price__num">{{ format(originPrice,true,false) }}</span>
            <span v-if=" drawInfo.multiSku" class="origin-price__text">起</span>
          </div>
        </div>

        <div v-if="drawInfo.soldNum" class="main__sold">
          {{ formatSalesNum }}人已学
        </div>
      </div>
    </div>
    <div class="recommend-gift-normal__panel">
      <div class="main__footer">
        <div class="footer__left">
          <p class="tips__gray">
            快来和我一起去上课吧
          </p>
          <p class="tips__red">
            长按二维码立即报名课程
            <img src="https://img01.yzcdn.cn/upload_files/2020/12/11/FvwQdtRcFeMBeYethynOVzjN75dK.png" :style="{marginLeft: '7px'}">
          </p>
        </div>
        <img class="footer__urls" :src="drawInfo.qrUrl" alt="">
      </div>
    </div>
  </div>
</template>

<script>
// import Icon from '@youzan/vis-ui/es/icon';
import format from '@youzan/utils/money/format';
// import { getDisplayPrice } from '@/domain/recommend-gift/utils';
import { CommissionRewardType } from '@/constants/ump/recommend-gift';

export default {
  // components: {
  //   'vis-icon': Icon,
  // },
  props: {
    drawInfo: {
      type: Object,
      default: () => ({
        realPayPrice: 0,
        originPrice: 0,
        qrUrl: '',
      }),
    },
  },
  computed: {
    currentPrice() {
      const { commissionPrice, multiSku, minRealPayPrice,
        realPayPrice, originalPrice, minOriginalPrice } = this.drawInfo;
      if (commissionPrice) {
        if (multiSku) {
          return minRealPayPrice;
        } else {
          return realPayPrice;
        }
      } else {
        if (multiSku) {
          return minOriginalPrice;
        } else {
          return originalPrice;
        }
      }
    },
    originPrice() {
      const { multiSku, originalPrice, minOriginalPrice } = this.drawInfo;
      if (multiSku) {
        return minOriginalPrice;
      } else {
        return originalPrice;
      }
    },
    formatCurrentPrice() {
      return this.getPriceList(this.currentPrice);
    },
    backgroundUrl() {
      // 免费且没有佣金（仅阶梯奖励）
      if (this.currentPrice !== 0 && !this.drawInfo.commissionPrice) {
        return 'https://img01.yzcdn.cn/upload_files/2020/11/19/FiOlPYKpOIAPsTGU-k4Dx4Gn-YQ2.png';
      } else {
        return 'https://img01.yzcdn.cn/upload_files/2020/11/19/Fr525cjgDdbsygk4hnktExYS6fbt.png';
      }
    },
    formatSalesNum() {
      const salesNum = this.drawInfo.soldNum;
      if (salesNum > 9999) {
        if (salesNum % 10000 === 0) {
          return `${salesNum / 10000}w`;
        } else {
          const tmpNum = (salesNum / 10000).toString().split('.');
          return `${tmpNum[0]}.${tmpNum[1].slice(0, 1)}w`;
        }
      }
      return salesNum;
    },
    highest() {
      const { commissionRewardType, multiSku } = this.drawInfo;
      return commissionRewardType === CommissionRewardType.FIXED_RATIO && // 固定佣金比例
        multiSku
        ? '最高'
        : '';
    },
  },
  methods: {
    format,
    getPriceList(price) {
      const priceWithDot = format(price, true, false);
      if (priceWithDot) {
        return priceWithDot.split('.');
      } else {
        return [];
      }
    },
  },
};
</script>

<style>
* {
  padding: 0;
  margin: 0;
}

.max-profit-title {
  font-size: 20px;
  font-weight: bold;
  line-height: 44px;
  color: #fff;
  text-align: center;
  text-shadow: 0 2px 0 #e97501;
}

.max-profit-title span {
  font-size: 32px;
  font-weight: bold;
}

.free-title {
  width: 170px;
  margin: 0 auto;
}

.free-title img {
  width: 100%;
}

.recommend-gift-normal {
  position: relative;
  width: 300px;
  min-height: 435px;
  padding: 12px;
  overflow: hidden;
  background-repeat: no-repeat;

  /* background-image: url(https://img01.yzcdn.cn/upload_files/2020/11/19/Fr525cjgDdbsygk4hnktExYS6fbt.png); */
  background-size: cover;
  border-radius: 6px;
  box-sizing: border-box;
}

.recommend-gift-normal__price {
  display: flex;
  margin-top: 4px;
  font-family: Helvetica;
  font-weight: bold;
  color: #ffeb51;
  text-shadow: 0 1px 6px rgba(10, 134, 78, .64);
  align-items: flex-end;
  justify-content: center;
}

.price__symbol {
  font-size: 15px;
}

.price__front {
  margin-bottom: -3px;
  font-family: Helvetica;
  font-size: 30px;
}

.price__end {
  font-family: Helvetica;
  font-size: 16px;
}

.price__text {
  margin-left: 4px;
  font-size: 16px;
}

.recommend-gift-normal__panel {
  position: relative;
  width: 276px;
  padding: 12px;
  background-color: #fff;
  border-radius: 6px;
  box-sizing: border-box;
}

.recommend-gift-normal__panel + .recommend-gift-normal__panel {
  margin-top: 6px;
}

.main__user {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.user__avatar {
  width: 36px;
  height: 36px;
  margin-right: 8px;
  border-radius: 50%;
}

.user__info-name {
  margin: 0;
  font-size: 14px;
  font-weight: bold;
  line-height: 20px;
  color: #646566;
}

.user__info-desc {
  margin: 0;
  font-size: 12px;
  line-height: 17px;
  color: #969799;
}

.main__img {
  position: relative;
  width: 252px;
  height: 142px;
  overflow: hidden;
  border-radius: 6px;
}

.main__img-real {
  object-fit: contain;
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
}

.main__title {
  display: -webkit-box;
  margin-top: 12px;
  overflow: hidden;
  font-size: 14px;
  font-weight: bold;
  line-height: 18px;
  color: #323233;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.main__price-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.main__price {
  display: flex;
  margin-top: 8px;
  align-items: flex-end;
}

.main-price__current {
  font-weight: bold;
  color: #ff5100;
}

.current-price__symbol {
  font-size: 13px;
}

.current-price__front {
  font-family: Helvetica;
  font-size: 18px;
}

.current-price__dot {
  margin: 0 -5px;
}

.current-price__end {
  font-family: Helvetica;
  font-size: 13px;
}

.current-price__text {
  margin-left: 4px;
  margin-left: -2px;
  font-size: 13px;
}

.main-price__origin {
  margin-left: 8px;
  font-size: 12px;
  color: #969799;
  text-decoration: line-through;
}

.current-price__symbol {
  margin-right: -5px;
}

.origin-price__num {
  font-family: Helvetica;
}

.origin-price__symbol {
  margin-right: -4px;
}

.current-price__end {
}

.main__sold {
  font-size: 12px;
  font-weight: bold;
  line-height: 16px;
  color: #646566;
}

.main__footer {
  top: 304px;
  left: 12px;
  display: flex;
  width: 252px;
  justify-content: space-between;
  align-items: center;
}

.footer__urls {
  width: 54px;
  height: 54px;
}

.tips__gray {
  font-size: 12px;
  color: #a0a1a3;
}

.tips__red {
  display: flex;
  height: 20px;
  padding: 0 4px 0 8px;
  margin-top: 6px;
  font-size: 12px;
  line-height: 20px;
  color: #fff;
  background: #ff5100;
  border-radius: 10px;
  align-items: center;
}

.tips__red img {
  width: 12px;
  height: 12px;
}
</style>
