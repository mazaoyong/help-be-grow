<template>
  <div class="detail-wrap">
    <div class="detail-wrap__devide">
      <div v-theme.main="'background-color'" class="detail-wrap__devide-left" />
      <div class="detail-wrap__devide-line" />
      <div v-theme.main="'background-color'" class="detail-wrap__devide-right" />
    </div>
    <div class="detail-wrap__text">
      <p v-if="overTip" class="overtip">
        {{ overTip }}
      </p>
      <div v-if="mainTip" class="maintip">
        <span class="text" v-html="mainTip" />
        <template v-if="showMainMaxDiscount">
          <vis-price-current
            active-color="#333"
            :price="[maxDiscountPrice]"
            :font-size="28"
            bold
          />
        </template>
      </div>

      <p v-if="smallTip" class="smalltip">
        {{ smallTip }}
        <template v-if="showSmallMaxDiscount">
          <vis-price-current
            active-color="#333"
            :price="[maxDiscountPrice]"
            :font-size="18"
            bold
          />
        </template>
      </p>
      <div v-if="showCountDown" class="count-down">
        <cap-countdown
          :time-separator="['天',':', ':', '']"
          :hide-zero-day="true"
          :end="grouponEndAt"
          @countdown-ended="onCountdownEnded"
        />
      </div>

      <!-- 底部按钮 -->
      <div class="detail-wrap__button">
        <van-button
          v-for="(item, index) in buttons"
          :key="index"
          v-theme:background.main="item.type==='mainBtn'"
          :class="[item.type === 'mainBtn' ? 'main-btn' : 'text-btn']"
          round
          @click="onClickEvent(item.action)"
        >
          <span :class="['text', !item.price ? 'bold' : '']">
            {{ item.text }}
          </span>
          <template v-if="item.price">
            <vis-price-current :active-color="item.type==='mainBtn' ? '#fff' : '#666'" :price="item.price" />
          </template>
          <span v-if="item.suffix" class="text">
            {{ item.suffix }}
          </span>
        </van-button>
      </div>
    </div>

    <!-- 海报弹框 -->
    <vis-popup
      class="poster-pop"
      :show-pop="showPosterPop"
      @close-pop="onClosePosterPop"
    >
      <img class="poster" :src="poster">
    </vis-popup>
  </div>
</template>

<script>
import { get } from 'lodash';
import { mapState } from 'vuex';
import { Button, Dialog } from 'vant';
import { Countdown } from '@youzan/captain';
import { PriceLabel, PopupClose } from '@youzan/vis-ui';
import { makePointLog, makeSharePointer } from '../../../log';

const { CurrentPrice } = PriceLabel;

export default {
  name: 'detail',

  components: {
    'cap-countdown': Countdown,
    'van-button': Button,
    'vis-price-current': CurrentPrice,
    'vis-popup': PopupClose,
  },

  data() {
    return {
      vice: this.$theme.colors.vice, // 主色
    };
  },

  computed: {
    ...mapState([
      'overTip',
      'mainTip',
      'smallTip',
      'showCountDown',
      'buttons',
      'showMainMaxDiscount',
      'showSmallMaxDiscount',
      'maxDiscountPrice',
      'grouponEndAt',
      'showPosterPop',
      'poster',
    ]),
  },

  methods: {
    onClickEvent(action) {
      const { activityId, activityType: umpType, groupType } = get(_global, 'grouponDetail.groupInfo', {});
      const hasBookedOrder = get(_global, 'hasBookedOrder', false);

      switch (action) {
        case 'newGroup':
          try {
            makePointLog('click', 'new_group', '直接购买', 'eduGroupon', {});
          } catch {}
          this.$store.dispatch('toProductDetail');
          break;
        case 'joinGroup':
          if (groupType === 1 && hasBookedOrder) {
            Dialog.confirm({
              title: '',
              message: '你已经是老客户了，无法享受新客拼团价。推荐立即开新团，享受开团优惠',
              cancelButtonText: '暂不开团',
              confirmButtonText: '开新团',
            }).then(() => {
              this.$store.dispatch('toProductDetail');
            });
            return;
          }
          this.$store.dispatch('toGroup');
          try {
            makePointLog('click', 'join_group', '用户参团', 'eduGroupon', {});
          } catch {}
          break;
        case 'originPay':
          try {
            makePointLog('click', 'origin_buy', '直接购买', 'eduGroupon', {});
          } catch {}
          this.$store.dispatch('toProductDetail');
          break;
        case 'guideShare':
          this.$store.dispatch('toGuideShare');
          try {
            makeSharePointer({ activityId, umpType });
            makePointLog('click', 'share_link', '邀请好友拼团', 'eduGroupon', {});
          } catch {}
          break;
        case 'makeCard':
          this.$store.dispatch('toMakeCard');
          try {
            makeSharePointer({ activityId, umpType });
            makePointLog('click', 'share_card', '生成海报', 'eduGroupon', {});
          } catch {}
          break;
        case 'toHome':
          try {
            makePointLog('click', 'to_home', '进店逛逛', 'eduGroupon', {});
          } catch {}
          this.$store.dispatch('toHome');
          break;
        case 'toPct':
          try {
            makePointLog('click', 'check_course', '查看课程', 'eduGroupon', {});
          } catch {}
          this.$store.dispatch('toPct');
          break;
        case 'selfGroup':
          try {
            makePointLog('click', 'to_self_group', '查看我的团', 'eduGroupon', {});
          } catch {}
          this.$store.dispatch('toSelfGroup');
          break;
        default:
          break;
      }
    },

    onCountdownEnded() {
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    },

    onClosePosterPop() {
      this.$store.dispatch('onClosePosterPop');
    },
  },
};
</script>

<style lang="scss">
@import "var";
@import 'mixins/index.scss';

.detail-wrap {
  position: relative;
  background-color: $c-white;
  margin-top: -1px;
  padding: 25px 35px;
  text-align: center;
  border-radius: 6px;

  &__devide {
    position: absolute;
    width: 100%;
    height: 1px;
    top: 0;
    left: 0;

    &-line {
      height: 1px;
      margin: 0 20px;
      background-image: linear-gradient(to right, #ccc 0%, #ccc 50%, transparent 50%);
      background-size: 8px 1px;
      background-repeat: repeat-x;
    }

    &-left,
    &-right {
      width: 8px;
      height: 16px;
      position: absolute;
      top: -8px;
    }

    &-left {
      left: 0;
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
    }

    &-right {
      right: 0;
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
    }
  }

  &__text {
    margin-bottom: 18px;

    .overtip {
      line-height: 18px;
      margin-bottom: 10px;
      font-size: 14px;
      color: $c-gray-darker;
    }

    .maintip {
      line-height: 22px;
      font-size: 18px;
      font-weight: 500;
      color: $c-black;
      vertical-align: middle;

      .text {
        margin-right: -8px;

        em {
          margin: 0 2px;
          font-size: 28px;
          line-height: 32px;
        }
      }

      &-going {
        .num {
          line-height: 28px;
          padding: 0 1px;
          font-size: 28px;
          font-weight: 600;
          vertical-align: middle;
        }
        .unit {
          font-weight: 600;
        }
      }

      &-other {
        margin-top: 20px;
      }
    }

    .smalltip {
      margin-top: 10px;
      line-height: 18px;
      font-size: 14px;
      color: $c-gray-darker;
    }

    .count-down {
      margin-top: 30px;

      .cap-countdown--black {
        .cap-countdown__day,
        .cap-countdown__hour,
        .cap-countdown__minute,
        .cap-countdown__second {
          width: 40px;
          height: 44px;
          line-height: 44px;
          font-weight: 500;
          font-size: 17px;
        }

       .cap-countdown__time-text {
          font-size: 24px;
          color: #454649 !important;
          font-weight: 500;
        }
      }

    }
  }

  &__button {
    margin-top: 40px;

    .van-button--round {
      display: block;
      width: 100%;
      border: none;

      &::after {
        border: none !important;
      }

      &.main-btn {
        .price {
          font-size: 22px;
        }

        .bold {
          font-size: 16px;
          font-weight: 500;;
        }
      }

      &.text-btn {
        width: auto;
        height: initial;
        margin: 0 auto;
        line-height: initial;
        margin-top: 15px;
        font-size: 13px;
        color: $c-gray-darker;
      }
    }
  }
  .poster-pop {
    width: 300px;

    .poster {
      width: 100%;
      border-radius: 8px;
    }
  }
}
</style>
