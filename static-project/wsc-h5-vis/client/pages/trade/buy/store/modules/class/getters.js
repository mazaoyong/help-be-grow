import { get, find } from 'lodash';
import { isChainStore } from '@youzan/utils-shop';
import { COURSE_SELL_TYPE } from '@/constants/course/course-sell-type';
import { OWL_TYPE } from '@/constants/course/owl-type';

export const getters = {
  // 是否需要学员信息
  isNeedStudent(_state, getters) {
    // 订单商品列表里面只要含有线下课就需要学员
    return getters.goodsList.some(({ owlType }) => owlType === OWL_TYPE.COURSE);
  },

  // 是否需要信息采集
  isNeedInfoCollect(state, getters) {
    if (getters.isNeedStudent) {
      return false;
    }

    return state.showCollectInfo && state.infoCollect.settings.length > 0;
  },

  // 上课信息是否需要填写时间
  isNeedTime(_, getters) {
    const intentTime = get(getters.singleGoods, 'config.intentTime', 0);
    return getters.isCasualCourse && intentTime === 1;
  },

  // 上课信息是否需要填写地点
  isNeedAddress(state, getters) {
    const intentAddress = get(getters.singleGoods, 'config.intentAddress', 0);
    return (
      getters.isCourse &&
      intentAddress === 1 &&
      !isChainStore &&
      !state.classAddress.down
    );
  },

  // 上课信息是否需要填写预约
  isNeedAppointment(_, getters) {
    const intentTime = get(getters.singleGoods, 'config.intentTime', 0);
    const courseSellType = get(
      getters.singleGoods,
      'orderCourseDTO.courseSellType'
    );
    return (
      intentTime === 1 &&
      getters.isFormalCourse &&
      (courseSellType === COURSE_SELL_TYPE.COUNT ||
        courseSellType === COURSE_SELL_TYPE.DURATION)
    );
  },

  // 选择的学员信息
  chosenStudent(state) {
    return (
      find(state.student.list, (item) => item.id === state.student.chosenId) ||
      {}
    );
  },

  // 选择的地址信息
  chosenClassAddress(state, getters) {
    if (getters.isNeedAppointment && state.appointment.addressId) {
      return {
        id: state.appointment.addressId,
        name: state.appointment.addressName,
      };
    }

    return (
      find(
        state.classAddress.list,
        (item) => item.id === state.classAddress.chosenId
      ) || {}
    );
  },
};
