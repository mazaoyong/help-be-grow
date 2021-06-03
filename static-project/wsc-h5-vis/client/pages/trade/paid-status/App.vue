<template>
  <div
    class="paid-status"
    :class="{ 'paid-status--full': isFullMode }"
    :style="{
      height: isFullMode ? `${windowHeight}px` : '',
    }"
  >
    <!-- 支付状态层 -->
    <block-state />
    <template v-if="payState === PAY_STATE.PAID">
      <!-- 即时奖励层 -->
      <block-reward />
      <!-- 互动层 -->
      <block-action />
      <!-- 广告投放层：粉丝推广 -->
      <block-ad />
      <!-- 营销层：奖励、证书、买赠 -->
      <block-ump />
      <!-- 商品导购层：商品推荐 -->
      <block-recommend />
    </template>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import { Toast, Dialog } from 'vant';
import UA from 'zan-utils/browser/ua_browser';
import Args from '@youzan/utils/url/args';
import get from 'lodash/get';
import * as SafeLink from '@youzan/safe-link';
import BlockState from './components/BlockState';
import BlockReward from './components/BlockReward';
import BlockAction from './components/BlockAction';
import BlockUmp from './components/BlockUmp';
import BlockAd from './components/BlockAd';
import BlockRecommend from './components/BlockRecommend';
import { PAY_STATE } from './constants';
import {
  getPayStateInfo,
  hasTradeWithLessonAppointment,
} from './api';
import {
  logAppointmentConfirm,
  logAppointmentCancel,
} from './track';

let pollingTimes = 0;
const pollingInterval = 500;
const orderNo = Args.get('orderNo');
const lessonNo = Args.get('lessonNo');
export default {
  name: 'paid-status',

  components: {
    BlockState,
    BlockReward,
    BlockAction,
    BlockUmp,
    BlockAd,
    BlockRecommend,
  },

  data() {
    return {
      PAY_STATE,
      windowHeight: window.innerHeight,
    };
  },

  computed: {
    ...mapState([
      'payState',
      'payStateText',
      'price',
      'tip',
      'orderItemList',
      'btnList',
      'paySuccessText',
    ]),

    ...mapGetters([
      'isFullMode',
    ]),

    needAppointment() {
      return lessonNo && lessonNo !== '-1';
    },
  },

  created() {
    // 如果订单被关闭，直接重定向到订单详情页
    if (this.payState === PAY_STATE.CLOSED) {
      SafeLink.redirect({
        url: `/wsctrade/order/detail?order_no=${orderNo}&kdt_id=${window._global.kdt_id}`,
        kdtId: window._global.kdt_id,
      });
    } else if (this.payState !== PAY_STATE.PAID) {
      // 如果没有获取到支付状态，则继续轮询查询支付状态
      this.getPayStatePolling();
    } else if (this.needAppointment) {
      // 支付成功，如果需要预约课程，则去预约课程
      this.getAppointmentState();
    }
  },

  async mounted() {
    // ios中，领取奖励或赠品后退后刷新页面
    if (UA.isIOS()) {
      window.onpageshow = (event) => {
        if (event.persisted) {
          window.location.reload();
        }
      };
    }
    this.getActivityInfo();
  },

  methods: {
    ...mapActions([
      'getPayRewardInfo',
      'getUmpInfo',
      'getIntroductionActivity',
      'getRecommendGiftActivity',
    ]),

    getActivityInfo() {
      // 获取转介绍活动
      this.getIntroductionActivity();
      // 获取推荐有奖活动信息
      this.getRecommendGiftActivity();
    },

    getPayStatePolling() {
      // 如果轮询次数超过10次就停止轮询
      if (pollingTimes >= 10) {
        this.$store.commit('UPDATE_PAY_STATE_TEXT', '出错了');
        this.$store.commit('UPDATE_TIP', '获取支付结果出错了，请刷新页面试试');

        SafeLink.redirect({
          url: `https://cashier.youzan.com/pay/wsctrade_pay?order_no=${orderNo}&kdt_id=${window._global.kdt_id}`,
          kdtId: window._global.kdt_id,
        });
        return;
      }
      pollingTimes++;

      // 获取订单状态
      if (orderNo !== '') {
        getPayStateInfo({ orderNo })
          .then((data) => {
            if (data.payStatus === PAY_STATE.PAID) {
              this.$store.commit('UPDATE_PAY_STATE', PAY_STATE.PAID);
              this.$store.commit('UPDATE_PAY_STATE_TEXT', this.paySuccessText);
              // 支付成功后，需要重新获取奖励和营销信息
              this.getPayRewardInfo();
              this.getUmpInfo()
                .finally(_ => {
                  if (this.needAppointment) {
                    this.getAppointmentState();
                  }
                });
              // 如果支付结果重新查询也需要重新获取活动信息
              this.getActivityInfo();
            } else {
              // 继续轮询查询
              const timer = setTimeout(() => {
                this.getPayStatePolling();
                clearTimeout(timer);
              }, pollingInterval);
            }
          })
          .catch(err => {
            // 继续轮询查询
            const timer = setTimeout(() => {
              this.getPayStatePolling();
              clearTimeout(timer);
            }, pollingInterval);
            console.error(err);
          });
      } else {
        Toast('没有找到这个订单');
      }
    },

    getAppointmentState() {
      // 如果轮询次数超过10次就停止轮询
      if (this.pullAoopintmentTimes >= 10) {
        console.warn('规定轮询次数间未正确取到订单支付状态');
        this.$store.commit('UPDATE_TIP', '未成功预约课程，请重新约课');
        return 0;
      }
      this.pullAoopintmentTimes += 1;
      // 获取订单状态
      hasTradeWithLessonAppointment({
        orderNo: orderNo,
        lessonNo: lessonNo,
      })
        .then((res) => {
          const data = res || {};
          const actionStatus = data.actionStatus;
          const errorCode = data.errorCode;

          // 预约失败
          if (actionStatus === -1) {
            if (errorCode > 0) {
              this.$store.commit('UPDATE_TIP', '你还未预约课程，可以随时约课');

              Dialog.confirm({
                title: '预约课程失败',
                message: data.msg,
                confirmButtonText: '重新约课',
                cancelButtonText: '稍后约课',
              })
                .then(() => {
                  logAppointmentConfirm();

                  const alias = get(this, 'orderItemList[0].alias', '');
                  const assetNo = get(this, 'orderItemList[0].course.assetNo', '');
                  const kdtId = window._global.kdt_id;
                  SafeLink.redirect({
                    url: `/wscvis/edu/appointment/list?kdt_id=${kdtId}&alias=${alias}&assetNo=${assetNo}&pageFrom=paidStatus`,
                    kdtId,
                  });
                })
                .catch(_ => {
                  logAppointmentCancel();
                });
            } else {
              this.$store.commit('UPDATE_TIP', data.msg);
            }
          } else if (actionStatus === 0) {
            // 加入延迟
            const timer = setTimeout(() => {
              this.getAppointmentState();
              clearTimeout(timer);
            }, pollingInterval);
          } else if (actionStatus === 1) {
            // 隐藏我要约课按钮
            this.$store.commit('UPDATE_BTN_LIST', this.btnList.slice(1));
          }
        })
        .catch(err => {
          this.$store.commit('UPDATE_TIP', '未成功预约课程，请重新约课');
          console.error(err);
        });
    },
  },
};
</script>

<style lang="scss">
.paid-status {
  position: relative;

  &--full {
    height: 100vh;
    background: #fff;

    .block-state {
      padding: 64px 0;
    }

    .block-action {
      position: absolute;
      bottom: 0;
      width: 100%;
    }
  }
}
</style>
