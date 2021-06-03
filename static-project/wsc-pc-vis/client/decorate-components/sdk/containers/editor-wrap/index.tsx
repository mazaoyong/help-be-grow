import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'zan-shuai';
import find from 'lodash/find';
import assign from 'lodash/assign';
import get from 'lodash/get';
import forEach from 'lodash/forEach';
import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
import cx from 'classnames';
import { isExpectedDesginType } from '../../utils/design-type';
import { setGlobalUnification } from '../../utils/set-global-unification';
import ComsManager from '../../components/coms-manager';
import ComNotSupport from '../../components/com-not-support';

import {
  filterData,
  filterDataMileStone,
  tagValuesWithUUID,
  getUUIDFromValue,
} from '../../common/helper';

import './index.scss';

function getAdditionalProps(propsOrFn, value) {
  const props = isFunction(propsOrFn) ? propsOrFn(value) : propsOrFn;

  return props || {};
}

interface IProps {
  instList: any;
  placeholderIndex: number;
  comList: object[];
  instPositions: object[];
  currentEditInstIndex: number;
  hasModified: boolean;
  validations: object[];
  iframeReady: boolean;
  comBriefInfoList: object[];
  comEditors: any;
  showError: boolean;
  settings: {};
  id: number;
  isMultiStore: boolean;
  className: string;
}

class EditorWrap extends Component<IProps> {
  hasBeforeUnloadHook: boolean | undefined;

  constructor(props) {
    super(props);
    const { instList } = props;
    tagValuesWithUUID(instList);
  }

  componentDidMount() {
    this.setupBeforeUnloadHook();
  }

  componentDidUpdate() {
    this.setupBeforeUnloadHook();
  }

  componentWillUnmount() {
    this.uninstallBeforeUnloadHook();
  }

  setupBeforeUnloadHook() {
    if (this.hasBeforeUnloadHook) {
      return;
    }

    window.addEventListener('beforeunload', this.onBeforeWindowUnload);
    this.hasBeforeUnloadHook = true;
  }

  uninstallBeforeUnloadHook() {
    window.removeEventListener('beforeunload', this.onBeforeWindowUnload);
    this.hasBeforeUnloadHook = false;
  }

  onBeforeWindowUnload = evt => {
    const { hasModified } = this.props;
    if (!hasModified) {
      return;
    }

    // 这个字符串其实不会展示给用户
    const confirmLeaveMessage = '页面上有未保存的数据，确定要离开吗？';
    evt.returnValue = confirmLeaveMessage;
    return confirmLeaveMessage;
  };

  componentWillReceiveProps(nextProps) {
    const { instList, iframeReady, comBriefInfoList } = this.props;
    const { comBriefInfoList: nextComBriefInfoList } = nextProps;

    // 确保iframe ready的时候才发送数据
    // comBriefInfoList 改变的时候 也发送
    if (
      (nextProps.iframeReady !== iframeReady && nextProps.iframeReady) ||
      (comBriefInfoList.length && comBriefInfoList !== nextComBriefInfoList)
    ) {
      window.postMessager.emit('comBriefInfoList', nextComBriefInfoList);
    }

    // 用uuid标记列表
    if (nextProps.instList !== instList) {
      tagValuesWithUUID(nextProps.instList);
    }
  }

  setValidation = validation => {
    const validations = assign({}, this.props.validations, validation);
    // 设置编辑器validations
    Actions.editorsState.setEditorValidations(validations);
  };

  onComponentValueChange = identity => (diff, replace = false) => {
    const { instList, currentEditInstIndex } = this.props;
    const newComponentValue = replace ? assign({}, diff) : assign({}, identity, diff);
    const newValue = instList.map((v: any, index: number) =>
      index === currentEditInstIndex ? newComponentValue : v,
    );
    const changedProps = Object.keys(diff);

    this.trackValueChange(newValue);
    this.validateComponentValue(newComponentValue, identity, changedProps).then(errors => {
      const id = getUUIDFromValue(newComponentValue);
      this.setValidation({ [id]: errors });
    });
  };

  validateComponentValue = (value, prevValue, changedProps) => {
    const { type } = value;
    const { comEditors } = this.props;
    const comp = find(comEditors, c => isExpectedDesginType(c, type));
    const { validate } = comp.editor;
    let p;
    if (validate) {
      p = validate(value, prevValue, changedProps);
    } else {
      p = new Promise(resolve => {
        resolve([]);
      });
    }

    return p;
  };

  // 调用 onChange 的统一入口，用于处理一些需要知道有没有修改过值的情况
  // trackValueChange(newValue, writeCache = true) {
  trackValueChange(newValue) {
    const { hasModified } = this.props;
    if (isArray(newValue) && newValue.length) {
      // 更新组件
      Actions.previewState.updateInstList(newValue);
      // CacheMsg.writeCache(newValue);

      if (!hasModified) {
        Actions.editorsState.setModified(true);
      }
    }
  }

  handleComsManager({ instList }) {
    const config = get(this.props.instList, '[0]');
    const newInstList = [config, ...instList];
    Actions.previewState.updateInstList(newInstList);
  }

  handleClearAllInsts() {
    const { comEditors, instList } = this.props;
    const newInstList: any[] = [];

    instList.forEach(item => {
      const { type } = item;
      comEditors.forEach(editor => {
        const { type: editorType, editor: editorProps } = editor;
        // 清除所有组件，只剩下 config组件 、sticky组件和不能删除的组件
        const sticky = get(editorProps, 'info.sticky');
        const deletable = get(editorProps, 'info.deletable');
        if (type === editorType && (sticky || deletable || type === 'config')) {
          newInstList.push(item);
        }
      });
    });
    Actions.previewState.updateInstList(newInstList);
    // 重置组件使用数量
    Actions.comsState.resetetUsedComNums();
  }

  handleDeleteInst(index) {
    const { instList, comList } = this.props;
    const deleteInst = get(instList, `[${index}]`);
    let comData = {};
    forEach(comList, item => {
      if (isExpectedDesginType(item, deleteInst.type)) {
        comData = item;
      }
    });
    Actions.previewState.deleteInst(index);
    // 为了标识对应的组件，所以要用comData
    Actions.comsState.decUsedComNum({
      comData,
    });
  }

  handleClickComChild(index) {
    const { instPositions } = this.props;
    if (index) {
      // 获取组件的位置信息
      const top = get(instPositions, `[${index}].top`) || 0;
      const previewNode = document.querySelector('.preview-wrap');
      if (previewNode) {
        previewNode.scrollTo({
          top,
          behavior: 'smooth',
        });
      }
    }
  }

  render() {
    const { validations } = this.props;
    const {
      currentEditInstIndex,
      showError = true,
      comEditors,
      instList,
      comList,
      comBriefInfoList,
      settings, // 全局配置
      isMultiStore, // 多网点
      className,
    } = this.props;

    const globalConfig = setGlobalUnification();

    const design = {
      validateComponentValue: this.validateComponentValue,
      getUUID: getUUIDFromValue,
      setValidation: this.setValidation,
    };

    const showComsManager =
      currentEditInstIndex === -1 ||
      (instList.length === 1 && currentEditInstIndex !== -1 && currentEditInstIndex !== 0);
    return (
      <div className={cx('decorate-editor-wrap', className)}>
        {instList.map((item, index) => {
          // 如果选中了某个组件，则调用该组件的数据处理方法
          const selected = index === currentEditInstIndex;
          try {
            if (selected) {
              item = filterData(item, filterDataMileStone.AFTER_SELECT);
            }
            const valueType = item.type;
            // 选择对应的编辑器
            const comEditor = find(comEditors, com => isExpectedDesginType(com, valueType));
            const uuid = getUUIDFromValue(item);
            return (
              selected && (
                <div key={uuid}>
                  {comEditor ? (
                    <comEditor.editor
                      {...getAdditionalProps(comEditor.editorProps, item)}
                      value={item}
                      onChange={this.onComponentValueChange(item)}
                      design={design}
                      globalConfig={globalConfig}
                      settings={settings}
                      // onSettingsChange={this.onSettingsChange}
                      validation={validations[uuid] || {}}
                      showError={showError}
                      isMultiStore={isMultiStore}
                    />
                  ) : (
                    <ComNotSupport />
                  )}
                </div>
              )
            );
          } catch (error) {
            // tslint:disable-next-line:no-console
            console.log(error);
          }
        })}
        {showComsManager && (
          <ComsManager
            comList={comList}
            instList={instList}
            comBriefInfoList={comBriefInfoList}
            onChange={this.handleComsManager.bind(this)}
            onClearAllInsts={this.handleClearAllInsts.bind(this)}
            onDeleteInst={this.handleDeleteInst.bind(this)}
            onClickComChild={this.handleClickComChild.bind(this)}
          />
        )}
      </div>
    );
  }
}

export default connect((state: any) => {
  const { previewState, editorsState, comsState } = state;
  return {
    comEditors: editorsState.comEditors,
    hasModified: editorsState.hasModified,
    validations: editorsState.validations,
    instList: previewState.instList,
    placeholderIndex: previewState.placeholderIndex,
    currentEditInstIndex: previewState.currentEditInstIndex,
    comList: comsState.comList,
    comBriefInfoList: comsState.comBriefInfoList,
    iframeReady: previewState.iframeReady,
    instPositions: previewState.instPositions,
  };
})(EditorWrap);
