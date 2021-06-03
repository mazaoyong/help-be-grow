import { getPayStateInfo, hasTradeWithLessonAppointment } from './api';
import { PAY_STATE } from './constants';

/* 轮询查询订单状态 */
const getPayStatePolling = (orderNo) => {
  let pollingTimes = 0;
  let timer = null;
  const pollingInterval = 500;

  const checkMaxTimes = () => {
    // 如果轮询次数超过10次就停止轮询
    if (pollingTimes >= 10) {
      return true;
    }
    return false;
  };

  // 获取订单状态
  if (orderNo) {
    return new Promise((resolve, reject) => {
      const query = () => {
        pollingTimes++;
        getPayStateInfo({ orderNo })
          .then((data) => {
            if (data && data.payStatus === PAY_STATE.PAID) {
              clearInterval(timer);
              resolve(data);
            } else {
              throw new Error(PAY_STATE.WAIT_PAY);
            }
          })
          .catch(() => {
            if (checkMaxTimes()) {
              clearInterval(timer);
              reject(PAY_STATE.WAIT_PAY);
            }
          });
      };

      if (!pollingTimes) {
        query();
      }
      if (!timer) {
        timer = setInterval(query, pollingInterval);
      }
    });
  } else {
    return Promise.reject(PAY_STATE.WAIT_PAY);
  }
};

const AppointmentStatus = {
  SUCCESS: 1,
  FAILED: 0,
};

/* 轮询进行预约状态查询 */
const getAppointmentStatePolling = (orderNo, lessonNo) => {
  let pollingTimes = 0;
  let timer = null;
  const pollingInterval = 500;

  const checkMaxTimes = () => {
    // 如果轮询次数超过10次就停止轮询
    if (pollingTimes >= 10) {
      return true;
    }
    return false;
  };

  // 获取订单状态
  if (orderNo && lessonNo) {
    return new Promise((resolve, reject) => {
      const query = () => {
        pollingTimes++;

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
                // 业务异常
                clearInterval(timer);
                resolve({
                  status: AppointmentStatus.FAILED,
                  msg: data.msg,
                });
              } else {
                // 接口异常
                clearInterval(timer);
                reject({
                  status: AppointmentStatus.FAILED,
                  msg: data.msg,
                });
              }
            } else if (actionStatus === 1) {
              // 执行成功
              clearInterval(timer);
              resolve({
                status: AppointmentStatus.SUCCESS,
                msg: '你已成功预约课程，可查看课表',
              });
            } else if (actionStatus === 0) {
              // 执行中，加入延迟
              if (checkMaxTimes()) {
                clearInterval(timer);
                reject();
              }
            }
          })
          .catch(() => {
            clearInterval(timer);
            reject();
          });
      };

      if (!pollingTimes) {
        query();
      }
      if (!timer) {
        timer = setInterval(query, pollingInterval);
      }
    });
  } else {
    return Promise.reject();
  }
};

export {
  getPayStatePolling,
  getAppointmentStatePolling,
  AppointmentStatus,
};
