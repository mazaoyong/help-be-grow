<template>
  <div class="promotion--bg">
    <!-- <div v-if="showTopLine" class="promotion-line" /> -->
    <div
      ref="pr-banner"
      class="promotion-banner"
      :class=" isMultyLine && !showMultyLine ? 'pr-info-ellipsis':'' "
      :style="{ 'padding-right': isMultyLine ? '20px' : '10px' }"
      @click="showMultyLine = !showMultyLine">
      <span class="promotion-banner__text">
         促销
      </span>
      <span
        v-for="(tag, index) in tags"
        :key="'tag-' + index"
        class="promotion-banner__tag">
        {{ tag }}
      </span>
      <span
        v-for="(des, index) in descriptions"
        :key="'des-' + index"
        class="promotion-banner__tip"
      >{{ des }}
      </span>
      <span
        v-if="isMultyLine"
        class="promotion-banner__arrow"
        :class=" showMultyLine ? 'promotion-banner__arrow_down':'' "
      />
    </div>
  </div>
</template>

<script>
import format from 'zan-utils/money/format';

const global = window._global;

export default {
  name: 'present-section',

  props: {
    meetReduce: {
      type: Object,
      default: () => {
        return {};
      },
    },
    showTopLine: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      isMultyLine: false,
      showMultyLine: false,
      tags: [],
      descriptions: [],
    };
  },

  created() {
    const activityData = this.meetReduce.activityData;
    const pointsName = global.visPointsName || '积分';
    activityData.forEach((item) => {
      this.tags.push('买赠');
      const pointStr = item.score ? `赠${item.score}${pointsName}` : '';
      let promotionStr = '';
      if (item.couponId) {
        const promotionValue = item.couponValue ? format(item.couponValue, true) : 0;
        const promotionDiscout = (item.couponDiscount / 10).toFixed(1);
        promotionStr = item.couponNum ? `赠${item.couponNum}张` : '';
        if (promotionValue) {
          promotionStr += `${promotionValue}元`;
        } else {
          promotionStr += `${promotionDiscout}折`;
        }
        promotionStr += `${item.couponTitle}`;
      }

      if (pointStr && promotionStr) {
        this.descriptions.push(`${pointStr},${promotionStr}`);
      } else {
        return this.descriptions.push(pointStr || promotionStr);
      }
    });
  },

  mounted() {
    const prInfoElement = this.$refs['pr-banner'];
    if (prInfoElement && prInfoElement.offsetHeight > 50) {
      this.isMultyLine = true;
      this.showMultyLine = false;
    }
  },
};
</script>

<style lang="scss">
  @import 'mixins/index.scss';
  @import "var";

  .promotion--bg {
    margin-top: 10px;
    background-color: #fff;
  }

  .promotion-line {
    border-top: 1px solid #f2f2f2;
    margin-left: 15px;
  }

  .promotion-banner {
    position: relative;
    vertical-align: middle;
    padding: 13px 16px;
    line-height: 18px;
    background-color: $c-white;
    word-break: break-all;

    @include ellipsis;

    &__text {
      font-size: 13px;
      color: #969799;
      margin-right: 16px;
    }

    &__tag {
      font-size: 12px;
      color: #f44;
      background-color: #fff;
      border: 1px solid #f44;
      padding: 3px 5px;
      margin-right: 8px;
      border-radius: 9px;
      line-height: 12px;
      display: inline-block;
      transform: scale(.83);
    }

    &__tip {
      color: #323233;
      font-size: 12px;
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

    &.pr-info-ellipsis {
      @include multi-ellipsis(1);
    }
  }
</style>
