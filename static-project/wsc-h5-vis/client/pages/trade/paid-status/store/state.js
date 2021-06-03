import get from 'lodash/get';
import Args from '@youzan/utils/url/args';
import { versionWrapper } from '@/vis-shared/configs/version/fns';
import { PAY_STATE } from '../constants';
import notifyPayfinished from 'common/utils/notify-payfinished';

const lessonNo = Args.get('lessonNo');
const orderNo = Args.get('orderNo');
const kdtId = _global.kdt_id;

// 从 global 取值
const initialState = _global.initialState || {};
const {
  payState,
  payWay,
  orderType,
  price,
  payRewardInfo = {},
  showRecommend,
  joinGroupSetting,
  umpInfo,
  orderItemList = [],
} = initialState;

// 拼装展示数据
const {
  payStateText,
  paySuccessText = '支付成功',
  tip,
  btnList,
  certInfo,
  rewardInfo,
  presentInfo,
  fissionCouponInfo,
} = initState(payState, umpInfo);

export default {
  payState,
  payStateText,
  price,
  tip,
  btnList,
  orderItemList,
  payRewardInfo,
  activities: [],
  presentInfo,
  rewardInfo,
  certInfo,
  // 裂变优惠券信息
  fissionCouponInfo,
  joinGroupSetting,
  showRecommend,
  paySuccessText,
  introduction: {}, // 转介绍活动
  // 按钮对应的活动状态信息
  btnUmpMap: {},
};

export function initState(payState, umpInfo) {
  const { simpleItems: orderItemList = [], activitiesInfo = [], orderCouponDTO } = umpInfo;
  // 初始化页面展示用信息
  let payText = '报名';
  let payText2 = '完成';
  let tip = '';
  const btnList = [
    {
      // 业务类型（固定=>查看课程）
      businessType: 'view-course',
      text: '查看课程',
      type: 'navigation',
      url: '',
    },
    {
      // 业务类型（可替换=>营销按钮）
      businessType: 'ump-replace',
      text: '推荐给好友',
      type: 'navigation',
      url: '',
    },
  ];

  if (orderItemList.length) {
    // 是不是套餐
    if (orderItemList.length > 1) {
      // 设置按钮链接
      btnList[0].url = `/wscvis/knowledge/index?p=mypay&kdt_id=${kdtId}`;
      btnList[1].type = 'custom';
      btnList[1].action = 'packageInvite';

      // 套餐包含的线下课需不需要预约
      const needAppointment = orderItemList.some(({
        owlType,
        course: {
          courseType,
          courseSellType,
        } = {},
      }) => owlType === 10 && courseType && (courseSellType === 1 || courseSellType === 2));
      // 如果需要预约展示我要预约按钮
      if (needAppointment) {
        const assetNo = get(this, 'orderItemList[0].course.assetNo', '');
        btnList.unshift({
          text: '我要约课',
          type: 'navigation',
          url: `/wscvis/edu/appointment/list?kdt_id=${kdtId}&assetNo=${assetNo}&pageFrom=paidStatus`,
        });
      }
    } else {
      const orderItem = orderItemList[0];
      const {
        alias,
        owlType,
        course: {
          courseType,
          courseSellType,
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

      // 是不是线下课
      if (owlType === 10) {
        // 是不是正式课
        if (courseType) {
          // 按课时/时段
          if (courseSellType === 1 || courseSellType === 2) {
            // 我要约课按钮
            const appointmentBtn = {
              text: '我要约课',
              type: 'navigation',
              url: `/wscvis/edu/appointment/list?kdt_id=${kdtId}&alias=${alias}&assetNo=${assetNo}&pageFrom=paidStatus`,
            };
            btnList.unshift(appointmentBtn);

            // 有没有设置下单预约
            if (lessonNo) {
              // 用户有没有选择预约的课程
              if (lessonNo === '-1') {
                tip = '你还未预约课程，可以随时约课';
              } else {
                tip = '你已成功预约课程，可查看课表';
              }
            }
          }
        } else {
          // 需不需要二次确认
          if (servicePledge === 2) {
            tip = '请等待商家联系您确认订单信息';
          }
        }
      } else {
        payText = '支付';
        payText2 = '成功';
      }
    }
  }

  const payStateTextList = {
    [PAY_STATE.CLOSED]: `${payText}失败`,
    [PAY_STATE.PAID]: `${payText}${payText2}`,
    [PAY_STATE.CREATED]: `正在${payText}中`,
    [PAY_STATE.WAIT_PAY]: `正在${payText}中`,
  };

  // 获取证书、入学奖励、买赠信息
  let certInfo, rewardInfo, presentInfo;
  if (activitiesInfo.length) {
    activitiesInfo.forEach(activity => {
      switch (activity.type) {
        case 'certificate':
          certInfo = activity;
          break;
        case 'courseReward':
          rewardInfo = activity.data;
          break;
        case 'meetReduce':
          presentInfo = activity;
          break;
        default:
          break;
      }
    });
  }

  return {
    payStateText: payStateTextList[payState],
    paySuccessText: payStateTextList[PAY_STATE.PAID],
    tip,
    btnList: versionWrapper('appointBtn', btnList),
    fissionCouponInfo: orderCouponDTO,
    certInfo,
    rewardInfo,
    presentInfo,
  };
}

// 获取支付状态并发送支付完成消息
if (payState === PAY_STATE.PAID) {
  try {
    notifyPayfinished(orderNo, payWay, orderType);
  } catch (err) {}
}
