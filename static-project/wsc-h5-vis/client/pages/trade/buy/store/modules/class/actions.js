import { get } from 'lodash';
// @TODO gaotian 后续把getUserPosition的toast迁了
import Toast from 'vant/lib/toast';
import { getUserPosition } from '@/pages/edu/utils';
import * as SafeLink from 'common/utils/custom-safe-link';
import * as Api from '../../../api';

export const actions = {
  // 获取学员列表
  GET_STUDENT_LIST({ state, getters, commit }) {
    // 当学员列表需要刷新 || 学员列表为空的时候，需要拉取学员列表
    if (state.student.isNeedRefresh || state.student.list.length === 0) {
      const classIdList = getters.goodsList
        .map((goods) => get(goods, 'eduClassDTO.id'))
        .filter((id) => id);
      return Api.getStudentList({
        classIdList,
      }).then((studentList) => {
        studentList = studentList.map(({ studentDTO, classId }) =>
          Object.assign(studentDTO, { classId })
        );

        commit('SET_STUDENT_LIST', studentList);

        if (state.student.isNeedRefresh) {
          commit('SET_STUDENT_REFRESH', false);
        }

        return studentList;
      });
    }

    return state.student.list;
  },

  // 获取地址列表
  GET_ADDRESS_LIST({ commit, state, getters }, { usePosition } = {}) {
    return new Promise((resolve) => {
      if (usePosition) {
        let isSuccess = false;
        setTimeout(() => {
          if (!isSuccess) {
            Toast.clear();
            resolve();
          }
        }, 3000);
        return getUserPosition()
          .then((position) => {
            isSuccess = true;
            resolve(position);
          }).catch(() => {
            resolve();
          });
      }
      resolve();
    })
      .then((position = {}) => {
        const storeIds = get(
          getters.singleGoods,
          'orderCourseDTO.addressList',
          []
        ).map(({ id }) => id);
        return Api.getAddressList({
          storeIds,
          latitude: position.latitude,
          longitude: position.longitude,
        });
      })
      .then((addressList = []) => {
        commit('SET_CLASS_ADDRESS_LIST', addressList);
        return addressList;
      })
      .catch((error) => {
        // 已经取到带有定位的地址列表
        if (state.classAddress.list.length > 0 && !usePosition) {
          return state.classAddress.list;
        } else {
          throw error;
        }
      });
  },

  // 重定向到预约页
  REDIRECT_TO_APPOINTMENT({ getters }) {
    const studentId = getters.chosenStudent.alias || 0;

    SafeLink.redirect({
      url: '/wscvis/edu/appointment/create',
      query: {
        pageFrom: 'order',
        studentId,
        productAlias: getters.singleGoods.alias,
        skuId: getters.singleGoods.skuId,
        applycourseType: getters.singleGoods.orderCourseDTO.applyCourseType,
      },
    });
  },
};
