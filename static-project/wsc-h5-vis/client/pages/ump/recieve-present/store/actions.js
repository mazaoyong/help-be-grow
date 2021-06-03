import map from 'lodash/map';
import get from 'lodash/get';
import * as SafeLink from '@youzan/safe-link';
import { receivePresent, listPresentsByCondition } from '../api';
import { parseList } from '../utils/parser';

const kdtId = get(_global, 'kdt_id');

const getPresentRecords = (list) => {
  let typeList = [];
  if (list.course && list.course.length > 0) {
    typeList = list.course;
  } else {
    typeList = list.knowledge;
  }
  return map(typeList, item => {
    const { presentRecordId, presentId } = item;
    return {
      presentRecordId,
      presentId,
    };
  });
};

export default {
  receivePresent({ state }, { data, success, fail }) {
    receivePresent({
      alias: state.alias,
      orderNo: state.orderNo,
      presentSource: Number(state.presentSource) || 16, // 为兼容以前买赠逻辑，默认赠品来源为买赠：16
      presentRecords: getPresentRecords(state.list),
      studentId: (data.student && data.student.id) || 0,
    }).then(res => {
      success(res);
    }).catch(err => {
      fail(err);
    });
  },

  listPresentsByCondition({ state, commit }) {
    commit('startFetch');
    listPresentsByCondition({
      alias: state.alias,
      orderNo: state.orderNo,
      presentQueryParams: decodeURIComponent(state.presentQueryParams),
      presentSource: state.presentSource,
      receiveStatus: state.receiveStatus,
    })
      .then(res => {
        const list = parseList(res);
        if (!list.course.length && !list.goods.length && !list.knowledge.length) {
          SafeLink.redirect({
            url: `/wscump/presents?kdt_id=${kdtId}`,
            kdtId,
          });
        }
        commit('setList', list);
      })
      .catch(() => commit('errorFetch'))
      .finally(() => commit('endFetch'));
  },
};
