<template>
  <div class="block-ump">
    <!-- 裂变优惠券 -->
    <div class="fission-coupon-wrap" @click="goFissionCouponDetail">
      <ump-fission-coupon
        v-if="fissionCouponInfo"
        class="fission-coupon_old"
        :num="fissionCouponInfo.quantity"
      />
    </div>
    <!-- 入学奖励 -->
    <ump-reward v-if="showReward" :reward-info="rewardInfo" />
    <!-- 买赠 -->
    <ump-present v-if="presentInfo && presentInfo.data && presentInfo.data.length" :present-info="presentInfo" />
    <!-- 证书 -->
    <vis-popup-close
      class="order-cert"
      :show-pop="showPop"
      @close-pop="onClosePop"
    >
      <vis-canvas-cert :cert-list="certList" />
    </vis-popup-close>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { get } from 'lodash';
import { CanvasCert, PopupClose } from '@youzan/vis-ui';
import { logUmpCertClose, logUmpCertRecognize } from '../track';
import UmpPresent from './UmpPresent';
import UmpReward from './UmpReward';
import UmpFissionCoupon from '@/domain/payment/components/ump-fission-coupon';
import Args from 'zan-utils/url/args';
import * as SafeLink from '@youzan/safe-link';

const orderNo = Args.get('orderNo');

export default {
  name: 'block-ump',

  components: {
    UmpPresent,
    UmpReward,
    UmpFissionCoupon,
    'vis-popup-close': PopupClose,
    'vis-canvas-cert': CanvasCert,
  },

  data() {
    return {
      // 证书
      showPop: false,
    };
  },

  computed: {
    ...mapState([
      'activities',
      'certInfo',
      'rewardInfo',
      'presentInfo',
      'fissionCouponInfo',
    ]),

    ...mapGetters([
      'showReward',
    ]),

    certList() {
      return this.certInfo && get(this.certInfo, 'data.content');
    },
  },

  created() {
    if (this.certList && this.certList.length) {
      this.showPop = true;
    }
  },

  mounted() {
    const certPopup = document.querySelector('.vis-popup--wrap');
    if (certPopup) {
      certPopup
        .addEventListener('contextmenu', () => {
          logUmpCertRecognize();
        });
    }
  },

  methods: {
    get,

    onClosePop() {
      logUmpCertClose();

      this.showPop = false;
      if (this.rewardPopFlag) {
        this.showRewardPop = true;
      }
    },
    goFissionCouponDetail() {
      const url = Args.add('/wscump/fission/share', {
        kdtId: window._global.kdt_id,
        orderNo,
        fissionId: this.fissionCouponInfo.id,
      });

      SafeLink.redirect({ url });
    },
  },
};
</script>

<style lang="scss">
.fission-coupon-wrap {
  margin: 0 auto;
}
.fission-coupon_old {
  margin: 12px;
}

.block-ump {
  .item {
    &__thumbnail-container {
      width: 112px;
      height: 64px;
    }

    &__detail {
      padding-left: 8px;
    }

    &__subtitle {
      margin-top: 4px;
      color: #646566;
    }
  }
}

.order-cert {

  .pop-info {
    width: 260px;
    color: #fff;
  }

  .cert-list__item {
    padding: 0;
  }

  .popup-reward {
    display: flex;
    flex-direction: column;
    padding: 25px 15px;
    height: 346px;
    width: 260px;
    box-sizing: border-box;
    border-radius: 8px;
    background-color: #fff;
    justify-content: space-between;
    align-items: center;
    h3 {
      font-size: 20px;
      line-height: 28px;
      font-weight: 500;
      color: #323233;
    }
    .van-button {
      height: 44px;
      line-height: 44px;
    }
  }
}
</style>]
