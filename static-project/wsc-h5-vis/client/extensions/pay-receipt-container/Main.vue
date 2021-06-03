<template>
  <div>
    <div v-if="payState !== 20" class="loading-area">
      <van-loading />
    </div>
    <div
      v-if="showExtra"
      class="extra-area"
      :style="extraStyle"
      @click="goOriginResult"
    >
      <div class="extra-tip">
        查看更多优惠 <van-icon name="arrow" />
      </div>
    </div>
  </div>
</template>

<script>
import { isEmpty, get } from 'lodash';
import { Icon, Dialog, Loading } from 'vant';

import * as customSafeLink from '@/common/utils/custom-safe-link';
import RecommenAPI from '@/domain/recommend-gift/api';
import { isGetHighestPhase } from '@/domain/recommend-gift/utils';
import Args from '@youzan/utils/url/args';

import { getPayStatePolling, getAppointmentStatePolling, AppointmentStatus } from './services';
import { PAY_STATE } from './constants';
import { PayStateText } from './utils';
import * as PayStatusAPI from './api';

const kdtId = _global.kdtId || _global.kdt_id;

export default {
  components: {
    'van-icon': Icon,
    'van-loading': Loading,
  },
  data() {
    return {
      // 支付状态
      payState: PAY_STATE.WAIT_PAY,
      // 活动信息
      activitiesInfo: [],
      // 订单信息
      orderItemList: [],
      // 是否是线下课
      isOfflineCourse: false,
      // 原始的支付结果页链接
      resultUrl: '',
      // 小票页限制高度
      maxHeight: 960,
      // debug: 小票页最终高度
      appHeight: '',
      // 裂变优惠券
      orderCouponInfo: null,
      // 展示查看更多
      showExtra: false,
      extraStyle: {
        top: '392px',
      },
    };
  },
  computed: {
    payStateText() {
      if (this.isOfflineCourse) {
        // 线下课
        return new PayStateText('报名', '完成').getStateText(this.payState);
      } else {
        // 知识付费
        return new PayStateText('支付', '成功').getStateText(this.payState);
      }
    },
    lessonNo() {
      return Args.get('lessonNo', this.resultUrl);
    },
  },
  watch: {
    async payState(val) {
      if (val === PAY_STATE.PAID) {
        // 支付成功后，需要重新获取奖励和营销信息
        this.getPayRewardInfo();
        await this.getUmpInfo();
        if (this.lessonNo && this.lessonNo !== '-1') {
          this.getAppointmentState();
        }
        // 如果支付结果重新查询也需要重新获取活动信息
        this.getIntroductionActivity();
        this.getRecommendGiftActivity();
      }
    },
    orderItemList() {
      // 非套餐
      this.getJoinGroupSetting();
      this.updateBtnList();
    },
    payStateText: {
      handler: function(val) {
        this.ctx.data.payStateText = val;
      },
      immediate: true,
    },
    activitiesInfo() {
      this.splitActivityInfo();
    },
  },
  created() {
    // 监听#app元素高度变化
    this.watchAppHeight();
    // 初始化ctx
    this.ctx.watch('outBizNo', (val) => {
      this.orderNo = val;
      this.ctx.data.orderNo = val;
    });
    this.ctx.watch('returnUrl', (val) => {
      this.resultUrl = val;
      this.ctx.data.resultUrl = val;
    });

    // 收敛跳转方法
    this.ctx.process.define('navigateGo', (params) => {
      console.log('跳转', params);
      // hack: 这里 params.url 里有处理好的kdtid，需要过滤掉
      let finalUrl = '';
      // 如果已经是处理好的完整链接，就不需要在处理了
      if (params.url.indexOf('kdt_id') > -1 && /https|http/.test(params.url)) {
        finalUrl = params.url;
      } else {
        finalUrl = customSafeLink.getSafeUrl({ ...params, kdtId });
      }
      this.ctx.process.invoke('navigateTo', finalUrl);
    });
    // 收敛埋点方法
    this.ctx.process.define('logAction', (params) => {
      console.log('埋点', params);
      this.ctx.process.invoke('logger', params);
    });

    getPayStatePolling(this.orderNo).then((data) => {
      this.payState = data.payStatus;
      this.ctx.data.price = data.realPay;
    }).catch((payStatus) => {
      this.payState = payStatus;
    }).finally(() => {
      // 输出到ctx
      this.ctx.data.payState = this.payState;
    });

    this.updateBtnList();
  },
  methods: {
    // 监听#app元素高度变化
    watchAppHeight() {
      const $app = document.querySelector('#app');
      const config = { attributes: true, childList: true, subtree: true };

      // 当观察到变动时执行的回调函数
      const callback = () => {
        this.appHeight = $app.getBoundingClientRect().height;
        this.maxHeight = 960 / (640 / Math.round(document.documentElement.getBoundingClientRect().width));

        if (this.maxHeight && this.appHeight >= this.maxHeight) {
          $app.style.maxHeight = `${this.maxHeight}px`;
          this.extraStyle = { top: `${this.maxHeight - 88}px` };
          this.showExtra = true;
        } else {
          this.showExtra = false;
        }
      };

      const observer = new MutationObserver(callback);

      // 以上述配置开始观察目标节点
      observer.observe($app, config);

      // 5秒钟之后页面基本加载完成
      setTimeout(() => {
        observer.disconnect();
      }, 5000);
    },
    /* 获取支付奖励 */
    getPayRewardInfo() {
      PayStatusAPI.getPayRewardInfo({ orderNo: this.orderNo })
        .then((data) => {
          if (data) {
            this.ctx.data.payRewardInfo = data;
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    /* 获取营销信息 */
    async getUmpInfo() {
      await PayStatusAPI.getUmpInfo({ orderNo: this.orderNo })
        .then((data) => {
          this.activitiesInfo = data.activitiesInfo || [];
          this.orderItemList = data.simpleItems || [];
          this.orderCouponInfo = data.orderCouponDTO;
          this.ctx.data.orderCouponInfo = this.orderCouponInfo;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    // 获取转介绍活动
    getIntroductionActivity() {
      // 转介绍使用总店的 kdtid（支持连锁）
      const { rootKdtId, kdtId } = _global.shopMetaInfo;
      // 如果没有总店的kdtid，使用单店的
      const useKdtId = rootKdtId || kdtId;

      PayStatusAPI.getIntroductionActivity()
        .then(data => {
          const { activity = {} } = data || {};
          if (!isEmpty(activity)) {
            const introductUrl = customSafeLink.getSafeUrl({
              url: '/wscvis/ump/introduction/old-student',
              kdtId: useKdtId,
              query: {
                kdt_id: useKdtId,
                alias: activity.alias || '',
                from: 'paid_status',
              },
            });

            const btnInfo = {
              text: '推荐得奖励',
              url: introductUrl,
            };

            this.ctx.data.btnUmpMap = {
              ...this.ctx.data.btnUmpMap,
              'introduction': btnInfo,
            };
          }
        });
    },
    // 获取推荐有奖活动信息
    async getRecommendGiftActivity() {
      const { orderItemList } = this;
      const goodsAlias = get(orderItemList, '[0].alias', '');
      if (!goodsAlias) return;
      const activityData = await RecommenAPI.getGetDetailByGoodsAlias({
        goodsAlias,
      });

      if (!isEmpty(activityData)) {
        if (!isGetHighestPhase(activityData)) {
          const btnInfo = {
            component: 'ump-recommend-gift',
            props: {
              activityData,
            },
            url: customSafeLink.getSafeUrl({
              url: '/wscvis/ump/referral-invite',
              kdtId,
              query: {
                alias: goodsAlias,
                fromPage: 'course',
              },
            }),
          };

          this.ctx.data.btnUmpMap = {
            ...this.ctx.data.btnUmpMap,
            'recommend-gift': btnInfo,
          };
        }
      }
    },
    // 更新按钮信息
    updateBtnList() {
      const { orderItemList } = this;

      let btnList = [
        {
        // 业务类型（固定 => 查看课程）
          businessType: 'view-course',
          text: '查看课程',
          type: 'navigation',
          url: '',
        },
        {
        // 业务类型（可替换 => 营销按钮）
          businessType: 'ump-replace',
          text: '推荐给好友',
          type: 'navigation',
          url: '',
        },
      ];

      const createAppointmentBtn = () => {
        return {
          text: '我要约课',
          type: 'navigation',
          url: this.getAppointmentLink(),
        };
      };

      const checkNeedAppointment = (item) => {
        const { owlType, course = {} } = item;
        const { courseType = '', courseSellType = '' } = course;
        return (owlType === 10 && courseType && (courseSellType === 1 || courseSellType === 2));
      };

      if (orderItemList.length) {
        // 是不是套餐
        if (orderItemList.length > 1) {
          // 设置按钮链接
          btnList[0].url = `/wscvis/knowledge/index?p=mypay&kdt_id=${kdtId}`;
          btnList[1].type = 'custom';
          btnList[1].action = 'packageInvite';

          // 套餐包含的线下课需不需要预约
          if (orderItemList.some(checkNeedAppointment)) {
            btnList.unshift(createAppointmentBtn());
          }
        } else {
          const orderItem = orderItemList[0];
          const {
            alias,
            owlType,
            course: {
              courseType,
              servicePledge,
              assetNo,
            } = {},
          } = orderItem;

          // 获取查看课程链接
          const mainBtnUrl = {
            '1': `/wscvis/knowledge/index?kdt_id=${kdtId}&p=columnshow&alias=${alias}`,
            '2': `/wscvis/knowledge/index?kdt_id=${kdtId}&p=contentshow&alias=${alias}`,
            '3': `/wscvis/knowledge/index?kdt_id=${kdtId}&p=vipbenefit&alias=${alias}`,
            '4': `/wscvis/knowledge/index?kdt_id=${kdtId}&p=livedetail&alias=${alias}`,
            // 如果有取到资产编号，则跳转到课程详情页
            // 没有则跳转到已购课程页
            '10': assetNo
              ? `/wscvis/edu/course/coursedetail?kdtId=${kdtId}&assetNo=${assetNo}`
              : `/wscvis/knowledge/index?kdt_id=${kdtId}&p=mypay`,
          }[owlType];

          // 设置默认按钮链接
          btnList[0].url = mainBtnUrl;
          btnList[1].url = `/wscvis/ump/invite-card?alias=${alias}&kdt_id=${kdtId}&owlType=${owlType}`;

          if (checkNeedAppointment(orderItem)) {
            // 我要约课按钮
            btnList.unshift(createAppointmentBtn());

            // 有没有设置下单预约
            if (this.lessonNo) {
              // 用户有没有选择预约的课程
              if (this.lessonNo === '-1') {
                this.ctx.data.tip = '你还未预约课程，可以随时约课';
              }
            }
          }

          // 是不是线下课
          if (owlType === 10) {
            this.isOfflineCourse = true;
            // 是不是正式课，需不需要二次确认
            if (!courseType && servicePledge === 2) {
              this.ctx.data.tip = '请等待商家联系您确认订单信息';
            }
          } else {
            this.isOfflineCourse = false;
          }
        }
      }

      this.ctx.data.btnList = btnList;
    },
    // 拆分活动信息
    splitActivityInfo() {
      const { activitiesInfo } = this;
      if (activitiesInfo.length) {
        activitiesInfo.forEach(activity => {
          switch (activity.type) {
            // case 'certificate':
            //   this.ctx.data.certInfo = activity;
            //   break;
            case 'courseReward':
              this.ctx.data.rewardInfo = activity.data;
              break;
            case 'meetReduce':
              this.ctx.data.presentInfo = activity;
              break;
            default:
              break;
          }
        });
      }
    },
    // 获取加粉推广配置信息
    getJoinGroupSetting() {
      if (this.orderItemList.length === 1) {
        const alias = get(this.orderItemList, '[0].alias', '');
        PayStatusAPI.getJoinGroupSetting({ alias }).then((data) => {
          this.ctx.data.joinGroupSetting = data;
        });
      }
    },
    // 获取约课状态
    getAppointmentState() {
      getAppointmentStatePolling(this.orderNo, this.lessonNo).then(({ status, msg }) => {
        console.log('getAppointmentStatePolling then', status, msg);
        if (status === AppointmentStatus.SUCCESS) {
          const { btnList } = this.ctx.data;
          // 隐藏我要约课按钮
          this.ctx.data.btnList = btnList.slice(1);
          this.ctx.data.tip = msg;
        } else {
          this.ctx.data.tip = msg || '你还未预约课程，可以随时约课';
          this.appointmentConfirm(msg);
        }
      }).catch(({ msg }) => {
        console.log('getAppointmentStatePolling catch', msg);
        this.ctx.data.tip = msg || '未成功预约课程，请重新约课';
      });
    },
    appointmentConfirm(msg) {
      Dialog.confirm({
        title: '预约课程失败',
        message: msg,
        confirmButtonText: '重新约课',
        cancelButtonText: '稍后约课',
      })
        .then(() => {
          this.ctx.process.invoke('logger', {
            et: 'click',
            ei: 'appointment_confirm',
            en: '预约异常弹窗-重新约课',
            pt: 'paidReceipt',
          });
          this.ctx.process.invoke('navigateTo', customSafeLink.getSafeUrl({
            url: this.getAppointmentLink(),
            kdtId,
          }));
        })
        .catch(_ => {
          this.ctx.process.invoke('logger', {
            et: 'click',
            ei: 'appointment_cancel',
            en: '预约异常弹窗-稍后预约',
            pt: 'paidReceipt',
          });
        });
    },
    // 获取约课链接
    getAppointmentLink() {
      const alias = get(this, 'orderItemList[0].alias', '');
      const assetNo = get(this, 'orderItemList[0].course.assetNo', '');

      return `/wscvis/edu/appointment/list?kdt_id=${kdtId}&alias=${alias}&assetNo=${assetNo}&pageFrom=paidStatus`;
    },
    goOriginResult() {
      this.ctx.process.invoke('navigateTo', this.resultUrl);
    },
  },
};
</script>

<style lang="scss">
#app {
  overflow: hidden;
  position: relative;
  transition: height .3s;
}

.van-icon-arrow {
  margin-left: 4px;
}
</style>
<style lang="scss" scoped>

.loading-area {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 128px;
  background-color: #fff;
  display: flex;
  align-content: center;
  justify-content: center;
}

.extra-area {
  position: absolute;
  left: 0;
  right: 0;
  background-image: linear-gradient(180deg, rgba(255,255,255,0.00) 2%, rgba(255,255,255,0.80) 29%, #FFFFFF 72%);
  height: 88px;
  z-index: 1;

  .extra-tip {
    font-size: 14px;
    color: #576B95;
    margin-top: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
