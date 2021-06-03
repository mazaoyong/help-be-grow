import assign from 'lodash/assign';
import { createState } from 'zan-shuai';

export default createState('extraOptionsState', {
  initial: {},

  // 设置额外的状态字段
  setExtraOption(state, payload) {
    let newState = {};
    newState = assign({}, state, {
      ...payload,
    });

    return {
      ...newState,
    };
  },
});
