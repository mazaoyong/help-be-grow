import React, { Component } from 'react';
import { Icon } from 'zent';
import find from 'lodash/find';
import assign from 'lodash/assign';
import pick from 'lodash/pick';
import defaultTo from 'lodash/defaultTo';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import { connect } from 'react-redux';
import { Actions } from 'zan-shuai';
import cx from 'classnames';

import { drag } from '../../utils/drag';
import ComItem from '../../components/com-item';
import { isExpectedDesginType } from '../../utils/design-type';
import './index.scss';
import { shouldAddComponentPromise } from '../../common/helper';

const IFRAME_HEADER_HEIGHT = 64;

interface IProps {
  placeholderIndex: number;
  comList: any;
  instPositions: any;
  comBriefInfoList: object[];
  comEditors: any;
  settings: {};
  comsLibMap: any;
  className: string;
}

interface IState {
  hideLibIds: any;
}

class ComsList extends Component<IProps, IState> {
  dragFlag: boolean;
  dragOutArea: boolean;
  constructor(props) {
    super(props);
    this.state = {
      hideLibIds: [],
    };
    this.dragFlag = false; // 标识拖拽中
    this.dragOutArea = true;
  }

  clickComsLibTab(id) {
    const { hideLibIds } = this.state;
    const isTabHideIndex = hideLibIds.indexOf(id);
    if (isTabHideIndex !== -1) {
      hideLibIds.splice(isTabHideIndex, 1);
    } else {
      hideLibIds.push(id);
    }
    this.setState({
      hideLibIds,
    });
  }

  dragStartHandler = (event, item) => {
    const { instPositions, comEditors } = this.props;
    const that = this;
    const previewIframe = document.querySelector('.preview-iframe');
    const previewIframePosRec = (previewIframe as HTMLElement).getBoundingClientRect();

    const iframeMargin = (previewIframePosRec.width - 375) / 2;
    const previewIframePos = {
      left: previewIframePosRec.left + iframeMargin,
      right: previewIframePosRec.right - iframeMargin,
      top: previewIframePosRec.top,
      bottom: previewIframePosRec.bottom,
    };
    const topLimit = item.topLimit;

    drag({
      moveDownEvent: event,
      movingCallback(context) {
        const { currentLeft, currentTop } = context;

        // 设置拖拽标志
        if (!that.dragFlag) {
          Actions.previewState.setDragging(true);
          that.dragFlag = true;
        }

        // 在预览区拖拽
        if (
          previewIframePos.left < currentLeft &&
          previewIframePos.right > currentLeft &&
          previewIframePos.top - IFRAME_HEADER_HEIGHT < currentTop &&
          previewIframePos.bottom > currentTop
        ) {
          that.dragOutArea = false;
          if (instPositions && instPositions.length) {
            for (let index = 0; index < instPositions.length; index++) {
              const pos = instPositions[index];
              // 拖拽元素的高度
              const moveElmTop = currentTop;
              // 在iframe中的组件上方拖入
              if (
                pos.top + previewIframePos.top <= moveElmTop &&
                moveElmTop < pos.top + pos.height + previewIframePos.top
              ) {
                if (moveElmTop < previewIframePos.top + pos.top + pos.height / 2) {
                  // 在index 前面插入一个新的占位组件
                  // 特殊逻辑： 如果是业务组件（置顶在页面顶部，不能拖拽），则在这个位置上不能进行放置
                  const sticky = get(comEditors, `[${index + 1}].editor.info.sticky`, '');
                  if (sticky) {
                    Actions.previewState.setPlaceholderIndex(-1);
                    break;
                  }

                  Actions.previewState.movingToPreview({ placeholderIndex: index, topLimit });
                } else {
                  // 在index后面插入一个新的占位组件
                  Actions.previewState.movingToPreview({ placeholderIndex: index + 1, topLimit });
                }
              } else if (previewIframePos.top > moveElmTop) {
                // 在iframe上方拖入
                // 特殊逻辑： 如果是业务组件（置顶在页面顶部，不能拖拽），则在这个位置上不能进行放置
                const sticky = get(comEditors, `[${index + 1}].editor.info.sticky`, '');
                if (sticky) {
                  Actions.previewState.setPlaceholderIndex(-1);
                  break;
                }
                Actions.previewState.movingToPreview({ placeholderIndex: 0, topLimit });
              } else if (
                instPositions.length === index + 1 &&
                moveElmTop > pos.top + pos.height + previewIframePos.top
              ) {
                // 在iframe下方拖入
                Actions.previewState.movingToPreview({ placeholderIndex: index + 1, topLimit });
              }
            }
          } else {
            // 首次放入组件
            Actions.previewState.movingToPreview({ placeholderIndex: 0, topLimit });
          }
        } else {
          // 不在预览区拖拽时
          if (!that.dragOutArea) {
            Actions.previewState.movingToPreview({ placeholderIndex: -1, topLimit });
            that.dragOutArea = true;
          }
        }
      },
      endCallback(context) {
        const { currentLeft, currentTop, height } = context;
        const { placeholderIndex } = that.props;

        // 特殊逻辑： 如果放置在sticky组件（业务组件）上方，则不放置组件
        if (placeholderIndex < 0) {
          that.dragFlag = false;
          Actions.previewState.setDragging(false);
          return;
        }

        // 在预览区中drop
        if (
          previewIframePos.left < currentLeft &&
          previewIframePos.right > currentLeft &&
          previewIframePos.top - IFRAME_HEADER_HEIGHT < currentTop + height &&
          previewIframePos.bottom > currentTop
        ) {
          // 组件没有超出上限
          if (!topLimit) {
            Actions.previewState.addToPreview({
              instData: cloneDeep(item.data),
              placeholderIndex,
            });
            // 增加组件使用次数
            Actions.comsState.incUsedComNum({
              comData: item,
            });

            // 如果是联系客服组件,直接滚动到底部
            if (item.data && item.data.type === 'contact_us') {
              const previewNode = document.querySelector('.preview-wrap');
              if (previewNode) {
                const top = previewNode.scrollHeight;
                previewNode.scrollTo({
                  top,
                  behavior: 'smooth',
                });
              }
            }
          }
          // 移出占位组件
          Actions.previewState.movingToPreview({ placeholderIndex: -1, topLimit });
        }
        // 设置拖拽标志
        if (that.dragFlag) {
          Actions.previewState.setDragging(false);
          that.dragFlag = false;
        }
      },
    });
  };

  componentDidMount() {
    const { comEditors } = this.props;
    this.updateComAndEditorsInfo(comEditors);
  }

  componentWillReceiveProps(nextProps) {
    const { comEditors } = this.props;
    const { comEditors: nextEditors } = nextProps;

    if (comEditors.length !== nextEditors.length) {
      this.updateComAndEditorsInfo(nextEditors);
    }
  }

  updateComAndEditorsInfo(editors) {
    const { settings } = this.props;
    const comList: any[] = [];
    let comBriefInfoList: any[] = [];
    // 组件列表
    editors.forEach(item => {
      const { editor, appendable } = item;
      // 假如编辑器设置了 appendable: false，则不显示
      if (editor && defaultTo(appendable, true)) {
        let instData = {};
        try {
          instData = editor.getInitialValue({ settings });
        } catch (error) {
          instData = {
            type: '',
          };
        }

        const comData = assign({}, { data: instData }, editor.info);
        comList.push(comData);
      }
    });
    // 组件列表简要信息 comBriefInfoList
    comBriefInfoList = comList.map(item => {
      const comBriefInfo = pick(item, ['name', 'type', 'extensionImage', 'sticky', 'deletable']);
      return comBriefInfo;
    });
    // 获取组件分类map
    // ComsLibMap 从外部action载入
    // Actions.fetchComsLibMap();
    // 通过editors来生成comList 数据
    Actions.comsState.loadComListFromEditors({ comList });
    // 根据组件列表获生成组件列表简要信息 comBriefInfoList
    Actions.comsState.loadComBriefInfoList({ comBriefInfoList });
  }

  componentWillUpdate(nextProps) {
    const { comList: nextComList } = nextProps;
    if (nextComList.length !== this.props.comList.length) {
      // couldCreateCb
      // 是否可以添加组件的回调函数，返回一个 Promise，resolve 的话可以创建
      const comsList = [...nextComList];
      comsList.forEach((item, index) => {
        const { couldCreateCb } = item;
        if (couldCreateCb) {
          shouldAddComponentPromise(item, couldCreateCb).then(couldCreate => {
            if (!couldCreate) {
              item.couldCreate = false;
              Actions.comsState.updateComData({ index, item });
            }
          });
        }
      });
    }
  }

  comsTabs(coms) {
    const { comList } = this.props;
    const { hideLibIds } = this.state;
    // 根据id获取组件数据
    const getComItemByType = type => find(comList, item => isExpectedDesginType(item, type));
    return (
      <div
        className={hideLibIds.indexOf(coms.id) === -1 ? 'coms-lib coms-lib-active' : 'coms-lib'}
        key={coms.id}
      >
        <div className="coms-lib-tab" onClick={this.clickComsLibTab.bind(this, coms.id)}>
          <Icon className="coms-lib-tab-icon" type="caret-down" />
          <span className="coms-lib-tab-name">{coms.name}</span>
        </div>
        <div className="com-list">
          {coms.list.map(type => {
            const item = getComItemByType(type);
            return (
              // 组件设置了 stiky: true, 说明是业务组件，具有置顶属性，也不允许放置在组件列表
              item &&
              !item.sticky && (
                <ComItem
                  item={item}
                  key={item.type}
                  dragStartHandler={this.dragStartHandler.bind(this)}
                />
              )
            );
          })}
        </div>
      </div>
    );
  }

  render() {
    const { comsLibMap = [], className } = this.props;
    return (
      <div className={cx('coms-lib-wrap', className)}>
        {comsLibMap && comsLibMap.map(coms => this.comsTabs(coms))}
      </div>
    );
  }
}

export default connect((state: any) => {
  const { comsState, previewState, editorsState } = state;
  return {
    comsLibMap: comsState.comsLibMap,
    instPositions: previewState.instPositions,
    placeholderIndex: previewState.placeholderIndex,
    comList: comsState.comList,
    comEditors: editorsState.comEditors,
  };
})(ComsList);
