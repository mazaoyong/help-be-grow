import assign from 'lodash/assign';
import { createState } from 'zan-shuai';
import { initConfigData } from '../constants';
// 初始化state数据
const initialValue = {
  currentEditInstIndex: 0, // 当前激活的组件,右侧显示对应组件编辑器
  dragging: false, // 表示组件正在做拖拽中
  iframeReady: false, // iframe preview 加载成功标志位
  instList: [initConfigData], // 组件实例列表，包含组件实例数据，供C端渲染用
  instPositions: [], // 组件实例渲染后的位置信息
  loadedDecorateData: false, // 获取装修数据完成标志位
  placeholderIndex: -1, // 占位组件的index
  previewType: 'weapp', // 预览类型：h5和weapp
  previewUrl: '', // 预览url
  topLimitFlag: false, // 组件超出上限标志位
};

export default createState('previewState', {
  initial: initialValue,

  /**
   *
   * @param {*} state
   * @param {*} payload
   * 点击添加组件 废除，此交互被产品否定
   */
  clickToPreview(state, payload) {
    const { instList } = state;
    const newinstList = instList.concat(payload);
    const newState = assign({}, state, { instList: newinstList });
    return {
      ...newState,
    };
  },

  /**
   *
   * @param {*} state
   * @param {*} payload
   * 拖拽添加组件
   */
  addToPreview(state, payload) {
    const { instList } = state;
    const { placeholderIndex, instData } = payload;
    window.postMessager.emit('addInst', { instData, placeholderIndex });
    const newinstList = [...instList];
    newinstList.splice(placeholderIndex + 1, 0, instData);
    // 拖拽添加组件，同时把编辑器同时渲染出来
    const newState = assign({}, state, {
      currentEditInstIndex: placeholderIndex + 1,
      instList: newinstList,
    });
    return {
      ...newState,
    };
  },

  /**
   *
   * @param {*} state
   * @param {*} payload
   * 设置拖拽到预览区中，此时显示占位组件
   */
  movingToPreview(state, payload) {
    const { placeholderIndex, topLimit } = payload;
    const newState = assign({}, state, {
      placeholderIndex,
      topLimitFlag: !!topLimit,
    });

    return {
      ...newState,
    };
  },

  /**
   *
   * @param {*} state
   * @param {*} payload
   * 设置or更新组件实例渲染的位置信息，由iframe传回
   */
  setInstPositions(state, payload) {
    const newState = assign({}, state, { instPositions: payload });
    return {
      ...newState,
    };
  },

  /**
   *
   * @param {*} state
   * @param {*} payload
   * 设置or更新当前激活（正在编辑）的组件
   */
  setCurrentEditInstIndex(state, payload) {
    const newState = assign({}, state, { currentEditInstIndex: payload });
    return {
      ...newState,
    };
  },

  /**
   *
   * @param {*} state
   * @param {*} payload
   * 设置or更新当前激活（正在编辑）的组件
   */
  setPlaceholderIndex(state, payload) {
    const newState = assign({}, state, { placeholderIndex: payload });
    return {
      ...newState,
    };
  },

  /**
   *
   * @param {*} state
   * @param {*} payload
   * 更新组件实例数据
   */
  updateInstList(state, payload) {
    const newState = assign({}, state, { instList: payload });
    return {
      ...newState,
    };
  },

  /**
   *
   * @param {*} state
   * @param {*} payload
   * 删除某个组件实例数据
   */
  deleteInst(state, payload) {
    const { instList } = state;
    const newinstList = [...instList];
    newinstList.splice(payload, 1);
    const newState = assign({}, state, { instList: newinstList });
    window.postMessager.emit('deleteInst', payload);
    return {
      ...newState,
    };
  },

  /**
   *
   * @param {*} state
   * @param {*} payload
   * 设置正在拖动中
   */
  setDragging(state, payload) {
    const newState = assign({}, state, { dragging: payload });
    return {
      ...newState,
    };
  },

  /**
   *
   * @param {*} state
   * @param {*} payload
   * 设置获取装修数据完成标志位
   */
  loadDecorateData(state, payload) {
    const newState = assign({}, state, { instList: payload, loadedDecorateData: true });
    return {
      ...newState,
    };
  },

  /**
   *
   * @param {*} state
   * @param {*} payload
   * 设置iframe preview 加载成功标志位
   */
  setIframeReady(state, payload) {
    const newState = assign({}, state, { iframeReady: payload });
    return {
      ...newState,
    };
  },

  /**
   *
   * @param {*} state
   * @param {*} payload
   * 设置预览类型
   */
  setPreviewType(state, payload) {
    const newState = assign({}, state, { previewType: payload });
    return {
      ...newState,
    };
  },

  /**
   *
   * @param {*} state
   * @param {*} payload
   * 设置预览url
   */
  setPreviewUrl(state, payload) {
    const newState = assign({}, state, { previewUrl: payload });
    return {
      ...newState,
    };
  },
});
