import assign from 'lodash/assign';
import isNumber from 'lodash/isNumber';
import { createState } from 'zan-shuai';
import { Actions, createEffect } from 'zan-shuai';
import { getComsLibMap } from '../constants';
import { isExpectedDesginType } from '../utils/design-type';

export default createState('comsState', {
  initial: {
    comBriefInfoList: [], // 根据组件列表获生成的组件列表简要信息
    comList: [], // 全部组件列表，组件里面包含组件的基本信息和默认数据, 目前通过读取editors的数据来组装
    comsLibMap: [], // 获取组件分类map, 目前包括基础组件、营销组件和业务组件，后期考虑异步获取
  },

  /**
   *
   * @param {*} state
   * @param {*} payload
   * 获取组件分类map 目前前端写死的，后期改为后端获取
   */
  loadComsLibMap(state, payload) {
    let newState = {};
    // 默认去 constants里的组件
    const comsLibMap = payload || getComsLibMap();
    newState = assign({}, state, {
      comsLibMap,
    });
    return {
      ...newState,
    };
  },

  /**
   *
   * @param {*} state
   * @param {*} payload
   * 从editors中加载组件列表
   */
  loadComListFromEditors(state, payload) {
    let newState = {};
    const { comList = [] } = payload;
    newState = assign({}, state, {
      comList,
    });
    return {
      ...newState,
    };
  },

  /**
   *
   * @param {*} state
   * @param {*} payload
   * 根据组件列表获生成组件列表简要信息
   */
  loadComBriefInfoList(state, payload) {
    let newState = {};
    const { comBriefInfoList = [] } = payload;
    newState = assign({}, state, {
      comBriefInfoList,
    });
    return {
      ...newState,
    };
  },

  /**
   *
   * @param {*} state
   * @param {*} payload
   * 更新组件数据
   */
  updateComData(state, payload) {
    let newState = {};
    const { item, index } = payload;
    const { comList } = state;
    const newComList = [...comList];
    newComList[index] = item;
    newState = assign({}, state, {
      comList: newComList,
    });
    return {
      ...newState,
    };
  },

  /**
   *
   * @param {*} state
   * @param {*} payload
   * 组件数量增加+1
   */
  incUsedComNum(state, payload) {
    const { comList } = state;
    let { comData = {} } = payload;
    let usedNum = comData.usedNum;
    if (isNumber(usedNum)) {
      usedNum = usedNum + 1;
    }
    comData = assign({}, comData, { usedNum });
    const newComList = comList.map(item => {
      if (item.type === comData.type) {
        // 达到上限
        if (comData.usedNum >= comData.maxNum) {
          comData.topLimit = true;
        } else {
          comData.topLimit = false;
        }
        return comData;
      } else {
        return item;
      }
    });
    let newState = {};
    newState = assign({}, state, {
      comList: newComList,
    });
    return {
      ...newState,
    };
  },

  /**
   *
   * @param {*} state
   * @param {*} payload
   * 组件数量减少 -1
   */
  decUsedComNum(state, payload) {
    const { comList } = state;
    let { comData = {} } = payload;
    let usedNum = comData.usedNum;
    if (isNumber(usedNum)) {
      usedNum = usedNum - 1;
    }
    comData = assign({}, comData, { usedNum });
    const newComList = comList.map(item => {
      if (item.type === comData.type) {
        // 达到上限
        if (comData.usedNum >= comData.maxNum) {
          comData.topLimit = true;
        } else {
          comData.topLimit = false;
        }

        if (comData.usedNum <= 0) {
          comData.usedNum = 0;
        }
        return comData;
      } else {
        return item;
      }
    });
    let newState = {};
    newState = assign({}, state, {
      comList: newComList,
    });
    return {
      ...newState,
    };
  },

  /**
   *
   * @param {*} state
   * @param {*} payload
   * 设置组件列表里面的组件数量
   */
  setUsedComNums(state, payload) {
    const { comList } = state;
    const instList = payload;
    const newComList = [...comList];
    newComList.forEach(item => {
      instList.forEach(inst => {
        if (isExpectedDesginType(item, inst.type)) {
          item.usedNum++;
          if (item.usedNum >= item.maxNum) {
            item.topLimit = true;
          } else {
            item.topLimit = false;
          }
        }
      });
    });
    let newState = {};
    newState = assign({}, state, {
      comList: newComList,
    });
    return {
      ...newState,
    };
  },

  /**
   *
   * @param {*} state
   * @param {*} payload
   * 重置组件使用数量
   */
  resetetUsedComNums(state) {
    const { comList } = state;
    const newComList = [...comList];
    newComList.forEach(item => {
      item.usedNum = 0;
      item.topLimit = false;
    });
    let newState = {};
    newState = assign({}, state, {
      comList: newComList,
    });
    return {
      ...newState,
    };
  },
});

createEffect('fetchComsLibMap', () => {
  return Actions.comsState.loadComsLibMap();
});
