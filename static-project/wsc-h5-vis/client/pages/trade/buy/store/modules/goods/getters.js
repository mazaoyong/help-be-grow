import { OWL_TYPE } from '@/constants/course/owl-type';
import { COURSE_TYPE } from '@/constants/course/course-type';

export const getters = {
  // 单商品信息
  singleGoods(state) {
    return state.goods.list[0] || {};
  },

  // 商品列表
  // 和state.goods.list的区别是
  // 在单商品，但是参加买赠的情况
  // goods.list 内会包含赠品的信息
  goodsList(state, getters) {
    return getters.isPackageBuy
      ? state.goods.list
      : [getters.singleGoods];
  },

  // 订单商品数量
  goodsTotalNum(_state, getters) {
    return getters.goodsList.reduce((total, { num }) => total + num, 0);
  },

  // 是否是线下课
  isCourse(_state, getters) {
    return (
      !getters.isPackageBuy && getters.singleGoods.owlType === OWL_TYPE.COURSE
    );
  },

  // 是否是正式课
  isFormalCourse(_state, getters) {
    return (
      getters.isCourse &&
      getters.singleGoods.orderCourseDTO.courseType === COURSE_TYPE.FORMAL
    );
  },

  // 是否是体验课
  isCasualCourse(_state, getters) {
    return (
      getters.isCourse &&
      getters.singleGoods.orderCourseDTO.courseType === COURSE_TYPE.CASUAL
    );
  },

  // 是否是知识付费
  isPaidContent(_state, getters) {
    return getters.isColumn || getters.isContent || getters.isLive;
  },

  // 是否是专栏
  isColumn(_state, getters) {
    return (
      !getters.isPackageBuy && getters.singleGoods.owlType === OWL_TYPE.COLUMN
    );
  },

  // 是否是内容
  isContent(_state, getters) {
    return (
      !getters.isPackageBuy && getters.singleGoods.owlType === OWL_TYPE.CONTENT
    );
  },

  // 是否是直播
  isLive(_state, getters) {
    return (
      !getters.isPackageBuy && getters.singleGoods.owlType === OWL_TYPE.LIVE
    );
  },
};
