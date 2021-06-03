<template>
  <div class="promotion-wrap">
    <vis-label
      class="promotion-wrap__label van-hairline--top"
      show-arrow
      left-content="促销"
      @click="onShowPromotionPop"
    >
      <span
        v-for="(promotion, $index) in promotionInfo"
        slot="right-content"
        :key="$index"
        class="promotion-wrap__right-content"
      >
        <span class="promotion-wrap__tag theme-tag">{{ promotion.tags }}</span>
        <span class="promotion-wrap__tip">{{ promotion.descriptions }}</span>
      </span>
    </vis-label>

    <van-popup
      v-model="isShowPromotionPop"
      position="bottom"
      round
    >
      <promotion-pop
        :promotion-format-info="promotionInfo"
        class="promotion-pop"
        @showPresentList="onShowPresentList"
        @closePromotionPop="onClosePromotionPop"
      />
    </van-popup>

    <present-pop
      v-model="isShowPresentList"
      :present-good-list="presentGoodList"
      :is-can-redirect="true"
    />
  </div>
</template>

<script>
import { Popup } from 'vant';
// import format from 'zan-utils/money/format';

import PromotionPop from './components/PromotionPop';
import { LabelVanIcon } from '../../pages/edu/components/label';
import PresentPop from './components/PresentPop';

// const global = window._global;

export default {
  name: 'promotion-wrap',

  components: {
    'van-popup': Popup,
    PromotionPop,
    PresentPop,
    'vis-label': LabelVanIcon,
  },

  props: {
    promotionInfo: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },

  data() {
    return {
      tags: [],
      descriptions: [],
      promotionFormatInfo: [],
      isShowPromotionPop: false,
      presentGoodList: [],
      isShowPresentList: false,
    };
  },

  methods: {
    onShowPromotionPop() {
      this.isShowPresentList = false;
      this.isShowPromotionPop = true;
    },

    onClosePromotionPop() {
      this.isShowPresentList = false;
      this.isShowPromotionPop = false;
    },

    onShowPresentList(index = 0) {
      // 目前多个sku送的赠品都一样，故赠品列表默认去第一个
      this.presentGoodList = this.promotionInfo[index].presentGoodsList;
      if (this.presentGoodList.length > 0) {
        this.isShowPromotionPop = false;
        this.isShowPresentList = true;
      }
    },
  },
};
</script>

<style lang="scss">
  @import 'mixins/index.scss';
  @import "var";

  .promotion-wrap {
    position: relative;
    vertical-align: middle;
    line-height: 18px;
    padding-left: 15px;
    background-color: $c-white;
    /* word-break: break-all; */

    &__label {
      .label-van-label-right {
        display: inline-block;
        padding-right: 30px;

        @include multi-ellipsis(1);
      }
    }

    &__text {
      font-size: 13px;
      color: #666;
      margin-right: 15px;
    }

    &__tag {
      font-size: 12px;
      color: #00b389;
      background-color: #e5f7f3;
      padding: 3px 5px;
      margin-right: 5px;
      border-radius: 9px;
      line-height: 12px;
      display: inline-block;
      flex: 0 0 auto;
      transform: scale(.83);
      transform-origin: left;
    }

    &__tip {
      color: $c-black;
      font-size: 13px;
    }

    &__arrow {
      font-weight: bold;
      color: $c-gray-dark;
      position: absolute;
      top: 18px;
      right: 10px;
      width: 6px;
      height: 12px;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAYCAMAAAD57OxYAAAAPFBMVEUAAACZmZmlpaWampqZmZmampqampqampqampqbm5ubm5ucnJyZmZmfn5+bm5uZmZmampqampqbm5uZmZnmDXU5AAAAE3RSTlMA8Qjo3dHCn4lPPi8jGA+ysXRhTrGNsAAAAFxJREFUGNNl0EcOwCAMRNEUekv5979r2Bgr4BVPQrbH27/Cq+8H4oCHPQmOqysPOTiLqFkwVVQN2CYqJ7hDlHe4BVvq8kMRCCv0mzZYW+tQXUcXnSNoOI09H2StDz/YBU9Q8POZAAAAAElFTkSuQmCC) 6px 12px no-repeat;
      background-position: center;
      background-size: contain;
      transition: .1s linear;
    }

    &__arrow_down {
      transform: rotate(90deg);
    }

    &__right-content {
      display: flex;
      @include multi-ellipsis(1);
    }
  }
</style>
