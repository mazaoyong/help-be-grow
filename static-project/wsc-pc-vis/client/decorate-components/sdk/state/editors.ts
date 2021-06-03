import assign from 'lodash/assign';
import { createState } from 'zan-shuai';
import { Actions, createEffect } from 'zan-shuai';
export default createState('editorsState', {
  initial: {
    comEditors: [], // 组件编辑器列表
    hasModified: false, // 组件编辑器编辑状态 true: 有编辑未保存的内容， false：无
    validations: [],
  },

  /**
   *
   * @param {*} state
   * @param {*} payload
   * 获取组件编辑器列表 目前前端写死的，后期改为后端获取
   */
  loadComEditors(state, payload) {
    let newState = {};
    newState = assign({}, state, {
      // todo 需要通过店铺类型来判断店铺
      comEditors: payload,
    });

    return {
      ...newState,
    };
  },

  /**
   *
   * @param {*} state
   * @param {*} payload
   * 设置编辑过页面数据
   */
  setModified(state, payload) {
    let newState = {};
    newState = assign({}, state, {
      hasModified: payload,
    });

    return {
      ...newState,
    };
  },

  /**
   *
   * @param {*} state
   * @param {*} payload
   * 设置没有编辑过页面数据
   */
  setUnModified(state) {
    let newState = {};
    newState = assign({}, state, {
      hasModified: false,
    });

    return {
      ...newState,
    };
  },

  /**
   *
   * @param {*} state
   * @param {*} payload
   * 设置编辑器validations
   * 当前所有组件的 validation 信息 key 是 value 的 UUID
   */
  setEditorValidations(state, payload) {
    let newState = {};
    newState = assign({}, state, {
      validations: payload,
    });

    return {
      ...newState,
    };
  },
});

// 待用
createEffect('fetchComEditors', () => {
  return Actions.editorsState.loadComEditors();
});
