import { Toast } from 'vant';
import { ACTIVITY_STATUS } from '@/constants/ump/activity-status';
import openFollowMp from '@/components/follow-mp/open-follow-mp';
import { checkAndLogin } from '@/common/utils/login';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import pay from '@/pages/course/detail/store/pay';
import log from '@/pages/course/detail/utils/log';

import isAfter from 'date-fns/is_after';
import endOfDay from 'date-fns/end_of_day';
import dateFormat from 'date-fns/format';
import addDays from 'date-fns/add_days';

import { appointment } from './api';
import openQuestion from './question';

export default function(activityData, state) {
  const { goodsData, kdtId, mpFollowed } = state;
  const {
    status,
    activityId,
    isCheckRight,
    useFollow,
    useQuestion,
    questionId,
    isUserBooking,
    isUserRemind,
    sku,
    startTime,
  } = activityData;

  function getTimeDesc() {
    let now = Date.now();
    if (isAfter(startTime, now)) {
      const todayEnd = endOfDay(now);
      const tomorrowEnd = endOfDay(addDays(now, 1));
      const secondTomorrowEnd = endOfDay(addDays(now, 2));
      if (isAfter(startTime, secondTomorrowEnd)) {
        return dateFormat(startTime, 'M月D日HH:mm开抢');
      }
      if (isAfter(startTime, tomorrowEnd)) {
        return dateFormat(startTime, '后天HH:mm开抢');
      }
      if (isAfter(startTime, todayEnd)) {
        return dateFormat(startTime, '明天HH:mm开抢');
      }
      return dateFormat(startTime, '今天HH:mm开抢');
    }
  }

  function wrappedAppointment() {
    return new Promise((resolve, reject) => {
      checkAndLogin(() => {
        log({
          et: 'custom',
          ei: 'seckill_remind',
          en: '秒杀设置提醒',
        });
        appointment(activityId)
          .then(res => {
            if (res) {
              resolve();
              setTimeout(() => {
                location.reload();
              }, 3000);
            } else {
              reject();
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    });
  }

  function seckillPay() {
    pay(ACTIVITY_TYPE.SEC_KILL, null, 'seckill-buy');
  }

  const originBuyButton = {
    text: '直接报名',
    url: `/wscvis/course/detail/${goodsData.alias}?kdt_id=${kdtId}`,
  };

  const buyButton = {
    text: '立即抢课',
    action: seckillPay,
  };

  const skuButtons = [{
    text: '立即报名',
    action: seckillPay,
  }];

  const appointButton = {
    text: '立即预约',
    action: () => {
      const appoint = () => {
        wrappedAppointment()
          .then(() => {
            Toast.success('预约成功');
          })
          .catch(err => {
            Toast.fail(err || '预约失败');
          });
      };
      if (useFollow) {
        if (mpFollowed) {
          appoint();
        } else {
          openFollowMp();
        }
      }
      if (useQuestion) {
        openQuestion(questionId)
          .then(() => {
            appoint();
          });
      }
    },
  };

  const remindButton = {
    text: '设置提醒',
    action: () => {
      if (mpFollowed) {
        wrappedAppointment()
          .then(() => {
            Toast.success('设置成功');
          })
          .catch(err => {
            Toast.fail(err || '设置失败');
          });
      } else {
        openFollowMp();
      }
    },
  };

  // 未开始
  if (status === ACTIVITY_STATUS.UNSTART) {
    // 开启秒杀预约
    if (isCheckRight) {
      // 已预约
      if (isUserBooking) {
        return {
          buttons: [originBuyButton],
          skuButtons: [originBuyButton],
          message: '你已成功预约，活动暂未开始，但也可以现价购买',
        };
      } else {
        return {
          buttons: [appointButton],
          skuButtons: [appointButton],
        };
      }
    } else {
      // 已提醒
      if (isUserRemind) {
        return {
          buttons: [originBuyButton],
          skuButtons: [originBuyButton],
          message: '你已设置提醒，活动暂未开始，但也可以现价购买',
        };
      } else {
        // 判断店铺是否已绑定公众号
        if (_global.mp_account.id) {
          return {
            buttons: [remindButton],
            skuButtons: [remindButton],
          };
        } else {
          const directButton = {
            ...originBuyButton,
            text: '现价购买',
          };

          const introButton = {
            text: `${getTimeDesc()}`,
            disabled: true,
          };

          return {
            buttons: [directButton, introButton],
            skuButtons: [directButton],
          };
        }
      }
    }
  }

  // 已开始
  if (status === ACTIVITY_STATUS.GOING) {
    if (sku.stockNum) {
      // 开启秒杀预约
      if (isCheckRight) {
        // 已预约
        if (isUserBooking) {
          return {
            buttons: [buyButton],
            skuButtons,
          };
        } else {
          return {
            buttons: [originBuyButton],
            skuButtons: [originBuyButton],
            message: '你未预约此活动，无法参与秒杀，下次记得预约哦',
          };
        }
      } else {
        return {
          buttons: [buyButton],
          skuButtons,
        };
      }
    } else {
      return {
        buttons: [originBuyButton],
        skuButtons: [originBuyButton],
        message: '秒杀价课程已售磬，你可以现价购买',
      };
    }
  }

  // 已结束
  if (status === ACTIVITY_STATUS.END) {
    return {
      buttons: [originBuyButton],
      skuButtons: [originBuyButton],
      message: '秒杀活动已结束，你还可以现价进行购买',
    };
  }
}
