/**
 * @file
 * 这里是订单提交的数据校验
 */

import { Toast } from 'vant';
import { isEmpty } from 'lodash';

export default function validateOrder(param) {
  /** @type {Array.<{validator: (state, getters) => string | void, needToast?: Boolean}>} */
  const validators = [
    { validator: validateStudent },
    { validator: validateInfoCollect },
  ];

  return !validators.some(({ validator, isNeedToast = true } = {}) => {
    const msg = validator(param);
    if (isNeedToast && msg) {
      Toast(msg);
    }
    return msg;
  });
}

// 校验学员信息
function validateStudent({ state, getters }) {
  if (!getters.isNeedStudent) {
    return;
  }

  if (!getters.chosenStudent.id) {
    return '请选择学员';
  }

  if (getters.isNeedTime && !state.classTime.chosenTime) {
    return '请选择上课时间';
  }

  if (getters.isNeedAppointment && !state.appointment.lesson) {
    return '请选择上课时间';
  }

  if (getters.isNeedAddress && !getters.chosenClassAddress.id) {
    return '请选择上课地点';
  }
}

function validateInfoCollect({ state, getters, commit }) {
  if (!getters.isNeedInfoCollect) {
    return;
  }

  if (isEmpty(state.infoCollect.data)) {
    commit('OPEN_INFO_COLLECT_POPUP');
    return '请准确填写你的信息';
  }
}
