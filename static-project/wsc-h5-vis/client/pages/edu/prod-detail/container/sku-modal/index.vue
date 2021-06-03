<template>
  <van-sku
    ref="vanSku"
    v-model="value"
    class="edu-sku-modal"
    :sku="sku"
    :initial-sku="selectedSku"
    :goods="goods"
    :goods-id="goodsId"
    :close-on-click-overlay="closeOnClickOverlay"
    @sku-selected="onSkuSelected"
  >
    <template slot="sku-header">
      <div class="vis-sku-header">
        <div class="sku-img-box">
          <img-wrap
            :src="imgUrl"
            :fullfill="'!100x0.jpg'"
            :cover="false"
            class="sku-img"
          />
        </div>
        <div class="sku-content-box">
          <van-tag
            v-if="tagName"
            class="sku-tag theme-tag"
            round
          >
            {{ tagName }}
          </van-tag>
          <span class="sku-price" v-html="price">
            <!-- <van-tag
              v-if="isVip"
              plain
            >
              会员价
            </van-tag> -->
          </span>
          <span
            v-if="!hideStock || type === 5 || activityType === 'seckill'"
            class="sku-stock"
          >
            剩余{{ stock }}个名额
            <span
              v-if="type === 5 && (showLimit || selectedLimit)"
              v-theme.main
              class="sku-limit"
            >
              （每人限兑{{ limit || selectedLimit }}件）
            </span>
          </span>
        </div>
      </div>
    </template>
    <!-- 通过slot主动置空的形式，覆盖原来的DOM -->
    <template slot="sku-stepper">
      <div />
    </template>
    <template slot="sku-messages">
      <div />
    </template>
    <!-- 通过slot主动置空的形式，覆盖原来的DOM -->
    <!-- 地址列表和二次确认 开始 -->
    <template slot="extra-sku-group">
      <div class="vis-extra-box">
        <div v-if="!groupAlias && ladderList.length" class="van-sku-row van-hairline--bottom ladder-select">
          <div class="van-sku-row__title">
            拼团类型
          </div>
          <span
            v-for="ladder in ladderList"
            :key="ladder.scale"
            class="van-sku-row__item"
            :class="{ 'van-sku-row__item--active': ladder.scale === scale }"
            @click="selectLadder(ladder.scale, $event)"
          >
            <span class="van-sku-row__item-name">{{ ladder.text }}</span>
          </span>
        </div>
        <template v-if="isShowPromotion && +type !==2 && +type !== 5">
          <div class="promotion">
            <p class="promotion-title">
              赠品
            </p>
            <van-cell
              v-for="(pro, index) in promotionInfo"
              :key="index"
              :is-link="pro.presentGoodsList.length>0"
              class="promotion-detail"
              @click="showPresentPop(index)"
            >
              <span class="promotion-detail__desc">
                {{ pro.descriptions }}
              </span>
              <span
                v-if="pro.presentGoodsList.length>0"
                class="promotion-detail__more"
              >
                {{ pro.activityType === 'meetReduce' ? '查看赠品' : '' }}</span>
            </van-cell>
          </div>
        </template>
        <vis-sku-label
          v-if="isEduSingleStore && addressNum"
          :num="addressNum"
          :is-edu-single-store="isEduSingleStore"
          content="查看上课地点"
          @click="skuLabelClick"
        />
        <vis-sku-label
          v-if="!isEduSingleStore && campusName"
          :campus-name="campusName"
          :is-edu-single-store="isEduSingleStore"
          content="上课校区"
          @click="onChainSkuLabelClick"
        />
        <div v-if="serviceMessage && courseType === 0" class="vis-sku-label">
          <svg class="theme-color_svg sku-svg">
            <use xlink:href="#icon_done" />
          </svg>
          <span>{{ serviceMessage }}</span>
        </div>
        <div v-if="canShowTime" class="vis-sku-label">
          <svg class="theme-color_svg sku-svg">
            <use xlink:href="#icon_clock" />
          </svg>
          <span>{{ courseTime }}</span>
        </div>
      </div>
    </template>
    <!-- 地址列表和二次确认 结束 -->
    <template slot="sku-actions">
      <a
        :class="isPrimary ? ' vis-sku-actions-primary main-btn' : 'vice-btn'"
        class="vis-sku-actions"
        @click="onBuyClicked"
      >
        {{ buyButtonText }}
      </a>
    </template>
  </van-sku>
</template>

<script>
import Vue from 'vue';
import { Sku, Toast, Tag, Cell } from 'vant';
import { ImgWrap } from '@youzan/vis-ui';
import format from '@youzan/utils/money/format';
import { getUserPosition } from '../../../utils';
import SkuLabel from './components/label';
import { COURSE_SELL_TYPE } from '../../../constant.js';
import { isEduSingleStore } from '@youzan/utils-shop';
import { navigateEnv } from '../../../../../common/utils/env';
import * as SafeLink from '@youzan/safe-link';

Vue.use(Toast);

export default {
  name: 'sku-modal',

  components: {
    'van-sku': Sku,
    'vis-sku-label': SkuLabel,
    'van-tag': Tag,
    'img-wrap': ImgWrap,
    'van-cell': Cell,
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    kdtId: {
      type: [Number, String],
      default: 0,
    },
    imgUrl: {
      type: String,
      default: '',
    },
    price: {
      type: String,
      default: '免费',
    },
    isVip: {
      type: Boolean,
      default: false,
    },
    stock: {
      type: String,
      default: '',
    },
    showLimit: {
      type: Boolean,
      default: false,
    },
    limit: {
      type: Number,
      default: 0,
    },
    storeIds: {
      type: Array,
      default: () => {
        return [];
      },
    },
    servicePledge: {
      type: Number,
      default: 1,
    },
    serviceMessage: {
      type: String,
      default: '',
    },
    goodsId: {
      type: String,
      default: '',
    },
    closeOnClickOverlay: {
      type: Boolean,
      default: true,
    },
    status: {
      type: Number,
      default: 1,
    },
    sku: {
      type: Object,
      default: () => {
        return {};
      },
    },
    selectedSku: {
      type: Object,
      default: () => {
        return {};
      },
    },
    goods: {
      type: Object,
      default: () => {
        return {};
      },
    },
    type: {
      type: Number,
      default: -1,
    },

    courseType: {
      type: Number,
      default: -1,
    },

    courseActivityType: {
      type: String,
      default: '',
    },

    courseTime: {
      type: String,
      default: '',
    },

    courseSellType: {
      type: Number,
      default: -1,
    },

    campusName: {
      type: String,
      default: '',
    },

    shopDetailInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },

    promotionInfo: {
      type: Array,
      default: () => {
        return [];
      },
    },

    activityType: {
      type: String,
      default: '',
    },

    hideStock: {
      type: Number,
      default: 0,
    },

    ladderPrice: {
      type: Object,
      default: () => ({}),
    },

    groupAlias: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      isEduSingleStore,
      originPrice: '',
      addressNum: 0,
      cache: {},
      isShowPromotion: false,
      pointsName: _global.visPointsName || '积分',
      selectedLimit: 0, // 积分活动，已选sku的最多可兑换数量
      selectedUsed: 0, // 积分活动，已选sku的已兑换数量
      selectedSkuComb: null,
      scale: null,
    };
  },

  computed: {
    isPrimary() {
      return this.status === 1;
    },
    buyButtonText() {
      let buyButtonText = '查看其他课程';
      if (this.status === 1) {
        if (this.type === 1) {
          buyButtonText = '下一步';
        } else if (this.type === 2) {
          buyButtonText = '邀请好友助力';
        } else if (this.type === 5) {
          buyButtonText = `${this.pointsName}兑换`;
        } else {
          if (String(this.price) === '免费') {
            buyButtonText = '免费报名';
          } else {
            buyButtonText = '立即报名';
          }
        }
      }
      return buyButtonText;
    },
    tagName() {
      // 积分商城不显示sku价格标签
      if (this.type === 5) {
        return '';
      }
      if (this.type === 4) {
        return '秒杀价';
      }
      switch (this.courseActivityType) {
        case 'vip':
          return '会员价';
        case 'groupon':
          return this.type === 1 ? '拼团价' : '';
        default:
          return '';
      }
    },
    canShowTime() {
      return this.courseTime && this.courseSellType !== COURSE_SELL_TYPE.DIY;
    },

    ladderList() {
      if (this.type === 1) {
        return Object.keys(this.ladderPrice).map(ladder => {
          if (this.selectedSkuComb) {
            let price = 0;
            this.ladderPrice[ladder].forEach(sku => {
              if (+sku.skuId === +this.selectedSkuComb.id) {
                price = sku.skuPrice;
              }
            });
            return {
              scale: ladder,
              text: `￥${format(price, true, false)}/${ladder}人团`,
            };
          }
          let minPrice = this.ladderPrice[ladder][0].skuPrice;
          let maxPrice = 0;
          this.ladderPrice[ladder].forEach(sku => {
            if (sku.skuPrice > maxPrice) {
              maxPrice = sku.skuPrice;
            }
            if (sku.skuPrice < minPrice) {
              minPrice = sku.skuPrice;
            }
          });
          if (minPrice === maxPrice) {
            return {
              scale: ladder,
              text: `￥${format(minPrice, true, false)}/${ladder}人团`,
            };
          }
          return {
            scale: ladder,
            text: `￥${format(minPrice, true, false)}起/${ladder}人团`,
          };
        });
      }
      return [];
    },
  },

  mounted() {
    this.$nextTick(() => {
      this.originPrice = this.price || '';
      this.addressNum = this.storeIds.length || 0;
      this.isShowPromotion = !this.skuId && this.promotionInfo.length > 0;
    });
  },

  methods: {
    skuLabelClick() {
      // 点击地址的时候，先获取用户的位置
      const storeIds = JSON.stringify(this.storeIds) || '[]';
      getUserPosition()
        .then(res => {
          // 跳转到地址列表页
          const latitude = res.latitude || 0;
          const longitude = res.longitude || 0;
          SafeLink.redirect({
            url: `/wscvis/edu/address-list?latitude=${latitude}&longitude=${longitude}&storeIds=${storeIds}&kdt_id=${this.kdtId}`,
            kdtId: this.kdtId,
          });
        })
        .catch(err => { // 用户拒绝授权或获取用户地址失败，则不传当前的地址信息
          console.log(err.message);
          SafeLink.redirect({
            url: `/wscvis/edu/address-list?storeIds=${storeIds}&kdt_id=${this.kdtId}`,
            kdtId: this.kdtId,
          });
        });
    },

    onChainSkuLabelClick() {
      const shopDetailInfo = this.shopDetailInfo;
      SafeLink.redirect({
        url: `/wscvis/edu/map?kdt_id=${window._global.kdt_id}&longitude=${shopDetailInfo.longitude}
          &latitude=${shopDetailInfo.latitude}&province=${shopDetailInfo.province}&city=${shopDetailInfo.city}
          &district=${shopDetailInfo.district}&address=${shopDetailInfo.address}`,
        kdtId: window._global.kdt_id,
      });
    },

    selectLadder(scale, event) {
      this.scale = scale;
      this.$bus.$emit('updateScale', scale);
      this.updateLadderPrice();
    },

    updateLadderPrice() {
      if (this.type === 1 && Object.keys(this.ladderPrice).length) {
        if (this.scale) {
          this.ladderPrice[this.scale].forEach(sku => {
            if (+sku.skuId === +this.selectedSkuComb.id) {
              this.price = `￥${format(sku.skuPrice)}`;
            }
          });
        } else {
          const price = [];
          Object.keys(this.ladderPrice).forEach(ladder => {
            this.ladderPrice[ladder].forEach(sku => {
              if (+this.selectedSkuComb.id === +sku.skuId) {
                price.push(+sku.skuPrice);
              }
            });
          });
          this.price = `￥${format(Math.min(...price))} - ${format(Math.max(...price))}`;
        }
      }
    },

    onSkuSelected(item) {
      const vanSku = this.$refs.vanSku;
      this.selectedSkuComb = item.selectedSkuComb;
      this.$bus.$emit('updateScale', null);
      this.scale = null;
      if (vanSku) {
        this.$bus.$emit('updateSelectedSku', vanSku.selectedSku, this.type);
      }
      if (item.selectedSkuComb) {
        this.stock = item.selectedSkuComb.stock_num || 0;
        if (item.selectedSkuComb && item.selectedSkuComb.price !== 0) {
          if (this.type === 5) {
            this.price = item.selectedSkuComb.price;
            this.selectedLimit = item.selectedSkuComb.limit;
            this.selectedUsed = item.selectedSkuComb.used;
          } else {
            this.price = `¥${parseFloat(item.selectedSkuComb.price / 100).toFixed(2)}` || '免费';
          }
        } else {
          this.price = '免费';
        }
        this.updateLadderPrice();
        // 更新选中的skuId
        this.skuId = item.selectedSkuComb.id || 0;
        this.$bus.$emit('updateSkuId', this.skuId, this.type, item.selectedSkuComb.price);
        // 更新选中的sku具体信息
        const sku = JSON.parse(item.selectedSkuComb.sku) || [];
        let skuInfo = '';
        sku.map((item, index) => {
          skuInfo += index === 0 ? `${item.v}` : `, ${item.v}`;
        });
        this.$bus.$emit('updateSkuInfo', {
          skuInfo,
          price: this.price,
          stock: this.stock,
          pointsPrice: item.selectedSkuComb.points_price,
        }, this.type);
      } else {
        this.skuId = null;
        this.price = this.originPrice;
        this.$bus.$emit('updateSkuId', this.skuId, this.type);
        this.$bus.$emit('updateSkuInfo', {
          skuInfo: '',
          price: '',
        }, this.type);
      }

      this.handleIsShowPromotion(this.skuId, this.type);
    },
    onBuyClicked() {
      if (this.status !== 1) { // 如果课程不是进行中
        this.onGoShop();
        return;
      }

      const vanSku = this.$refs.vanSku;
      if (vanSku) {
        const selectedSkuComb = vanSku.getSkuData().selectedSkuComb || {};
        this.skuId = this.skuId ? this.skuId : selectedSkuComb.id;
        this.$bus.$emit('updateSkuId', this.skuId, this.type, selectedSkuComb.price);
        if (this.skuId) {
          if (this.type === 1 && !this.groupAlias && Object.keys(this.ladderPrice).length && !this.scale) {
            this.$toast('请选择拼团类型');
          } else {
            this.$bus.$emit('toPay', this.type, true, this.groupAlias);
          }
        } else {
          this.$toast('请选择规格');
        }
        return;
      }

      this.$toast('无法获取sku, 请重试');
    },

    onGoShop() {
      navigateEnv();
    },

    handleIsShowPromotion(skuId = null, type = -1) {
      if (type !== 2) {
        let isShowPromotion = false;
        if (skuId) {
          this.promotionInfo.forEach(item => {
            isShowPromotion = item.skuId.indexOf(skuId) > -1;
          });
          this.isShowPromotion = isShowPromotion;
        } else {
          this.isShowPromotion = this.promotionInfo.length > 0;
        }
      }
    },

    showPresentPop(index) {
      const presentGoodList = this.promotionInfo[index].presentGoodsList;
      presentGoodList.length > 0 && this.$bus.$emit('showSkuPromotionPop', presentGoodList);
    },
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';
.edu-sku-modal {
  min-height: 50%;
  max-height: 80%;
  .sku-svg {
    width: 12px;
    height: 12px;
    margin-right: 4px;
    margin-top: -2px;
  }

  .vis-sku-label {
    font-size: 13px;
    color: #666;
    display: flex;
    align-items: center;
  }

  .van-icon-cross {
    font-size: 22px;
  }

  .vis-sku-header,
  .van-sku-group-container,
  .vis-extra-box {
    margin: 0 16px;
  }

  .ladder-select {
    padding-top: 12px;
  }
}

.vis-sku-header {
  box-sizing: border-box;
  position: relative;
  height: 89px;
  border-bottom: 1px solid #f2f2f2;
  .sku-img-box {
    position: absolute;
    top: 15px;
    left: 0;
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
  .sku-content-box {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: flex-start;
    top: 15px;
    left: 123px;
    right: 22px;
    height: 64px;
  }
  .sku-tag {
    transform: scale(.84);
    transform-origin: left;
  }
  .sku-price {
    line-height: 20px;
    font-size: 16px;
    font-weight: 500;
    color: #f44;
    overflow: hidden;
    word-break: keep-all;
    .van-tag {
      display: inline-block;
      height: 12px;
      line-height: 12px;
      vertical-align: top;
      color: #f44;
      font-weight: normal;
    }

    span {
      color: #c8c9cc;
    }
  }
  .sku-stock {
    line-height: 16px;
    font-size: 12px;
    color: #969799;
    overflow: hidden;
  }
}
.vis-extra-box {
  position: relative;
  margin-left: 15px;

  .promotion {
    padding: 10px 0;
    font-size: 14px;
    color: #111;

    .promotion-title {
      line-height: 20px;
    }

    .promotion-detail {
      padding-left: 0;
      font-size: 13px;
      color: #323233;

      .van-cell__value--alone {
        display: flex;
        justify-content: space-between;
      }

      &__desc {
        @include multi-ellipsis(1);
      }

      &__more {
        min-width: 60px;
        text-align: right;
        color: #666;
      }

      .van-cell__right-icon {
        font-size: 12px;
      }
    }
  }
}
.vis-sku-actions {
  display: block;
  box-sizing: border-box;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  color: #fff;
  text-align: center;
  background-color: #ff976a;
  border-radius: 20px;
  margin: 5px 16px;
  &-primary {
    /* background-image: linear-gradient(45deg, #e33 0%, #f44 100%); */
    background-color: #f44;
  }
}
.van-icon_certificate {
  display: flex;
  align-items: center;
  margin-right: 4px;
}
</style>
