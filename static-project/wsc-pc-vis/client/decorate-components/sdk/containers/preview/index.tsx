import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'zan-shuai';
import cx from 'classnames';
import get from 'lodash/get';
import forEach from 'lodash/forEach';
import isArray from 'lodash/isArray';
import Messager from '../../common/messager';
import { isExpectedDesginType } from '../../utils/design-type';

const h5Url = get(_global, 'url.h5', '');

import './index.scss';

interface IProps {
  instList: any;
  placeholderIndex: number;
  comList: object[];
  instPositions: object[];
  currentEditInstIndex: number;
  showPageComs: boolean;
  iframeReady: boolean;
  dragging: boolean;
  loadedDecorateData: boolean;
  showPageOption: boolean;
  previewType: string;
  previewUrl: string;
  topLimitFlag: boolean;
  setPreviewWidth: boolean;
  className: string;
}

class Preview extends Component<IProps> {
  iframeElem: any;

  componentDidMount() {
    const that = this;
    const postMessager = new Messager(this.iframeElem.contentWindow, h5Url);
    window.postMessager = postMessager;

    window.postMessager.on('readyToRender', () => {
      Actions.previewState.setIframeReady(true);
    });

    window.postMessager.on('instPositionsChange', positions => {
      Actions.previewState.setInstPositions(positions);
    });

    window.postMessager.on('activeInstIndex', activeIndex => {
      Actions.previewState.setCurrentEditInstIndex(activeIndex);
    });

    window.postMessager.on('deleteInst', index => {
      const { instList, comList } = that.props;
      const deleteInst = get(instList, `[${index}]`);
      let comData = {};
      forEach(comList, item => {
        if (isExpectedDesginType(item, deleteInst.type)) {
          comData = item;
        }
      });
      Actions.previewState.deleteInst(index);
      Actions.comsState.decUsedComNum({
        comData,
      });
    });

    window.postMessager.on('dragEnd', dragEndObj => {
      const { instList } = dragEndObj;
      // 更新组件列表
      Actions.previewState.updateInstList(instList);
    });
  }

  clickPageSetting() {
    const { showPageOption } = this.props;
    // 如果没有设置
    if (!showPageOption) {
      return;
    }
    Actions.previewState.setCurrentEditInstIndex(0);
    window.postMessager.emit('activeIndex', 0);
  }

  clickComsManage() {
    Actions.previewState.setCurrentEditInstIndex(-1);
    window.postMessager.emit('activeIndex', -1);
  }

  updateValueFromCache(cachedValue) {
    if (isArray(cachedValue) && cachedValue.length) {
      Actions.previewState.updateInstList(cachedValue);
    }
  }

  componentWillReceiveProps(nextProps: IProps) {
    const {
      instList: nextInstList = [],
      placeholderIndex: nextPlaceholderIndex,
      topLimitFlag,
    } = nextProps;
    const { instList = [], placeholderIndex, loadedDecorateData, iframeReady } = this.props;

    // 确保iframe ready的时候才发送数据
    if (
      nextInstList !== instList ||
      nextProps.loadedDecorateData !== loadedDecorateData ||
      nextProps.iframeReady !== iframeReady
    ) {
      if (nextProps.iframeReady && nextProps.loadedDecorateData) {
        window.postMessager.emit('instListChange', nextInstList);
      }
    }

    if (placeholderIndex !== nextPlaceholderIndex) {
      window.postMessager.emit('placeholderIndexChange', {
        placeholderIndex: nextPlaceholderIndex,
        topLimitFlag,
      });
    }
  }

  componentWillUnmount() {
    window.postMessager.destroy();
  }

  render() {
    const {
      instList = [],
      instPositions = [],
      dragging,
      currentEditInstIndex,
      children,
      showPageOption,
      showPageComs,
      previewType = 'weapp',
      previewUrl,
      setPreviewWidth,
      className,
    } = this.props;
    const pageInfo = instList[0] || {};
    const iframeUrl = previewUrl || `${h5Url}/wscshop/decorate/preview?kdtId=${_global.kdtId}`;
    const instPositionsLength = instPositions.length;
    const defaultHeight = 758;
    const footerHeght = 150;
    let totalHeight = defaultHeight;
    if (instPositionsLength) {
      const top = get(instPositions, `[${instPositionsLength - 1}].top`);
      const height = get(instPositions, `[${instPositionsLength - 1}].height`);
      const realHeight = top + height + footerHeght * 2;
      totalHeight = realHeight > defaultHeight ? realHeight : defaultHeight;
    }

    return (
      <div className={cx('preview-wrap', className)}>
        {children}
        <div className="preview-page">
          {showPageOption && (
            <div
              className={
                currentEditInstIndex === 0
                  ? 'preview-page-options preview-page-options-active'
                  : 'preview-page-options'
              }
              onClick={this.clickPageSetting.bind(this)}
            >
              <i className="preview-page-options-icon" />
              页面设置
            </div>
          )}
          {showPageComs && (
            <div
              className={
                currentEditInstIndex === -1
                  ? 'preview-page-coms preview-page-coms-active'
                  : 'preview-page-coms'
              }
              onClick={this.clickComsManage}
            >
              <i className="preview-page-coms-icon" />
              组件管理
            </div>
          )}
        </div>
        <div className="preview">
          <div
            className={`preview-head preview-head--${previewType}`}
            onClick={this.clickPageSetting.bind(this)}
          >
            <div className="preview-header-title">{pageInfo.title}</div>
          </div>
          <div
            className={cx('preview-iframe-wrap', { 'preview-iframe-wrap-width': setPreviewWidth })}
          >
            <iframe
              className="preview-iframe"
              title={pageInfo.title}
              src={iframeUrl}
              frameBorder="0"
              width="100%"
              height={totalHeight}
              ref={elem => {
                this.iframeElem = elem;
              }}
            />
            <div className="preview-height-tag">
              <span className="preview-height-tag-text">iPhone 8手机高度</span>
            </div>
            {/* 在拖动的时候做一层mask todo */}
            {dragging && <div className="preview-drag-mask" />}
          </div>
        </div>
      </div>
    );
  }
}

export default connect((state: any) => {
  const { previewState, comsState } = state;
  return {
    instList: previewState.instList,
    placeholderIndex: previewState.placeholderIndex,
    currentEditInstIndex: previewState.currentEditInstIndex,
    instPositions: previewState.instPositions,
    dragging: previewState.dragging,
    topLimitFlag: previewState.topLimitFlag,
    comList: comsState.comList,
    loadedDecorateData: previewState.loadedDecorateData,
    iframeReady: previewState.iframeReady,
    previewUrl: previewState.previewUrl,
  };
})(Preview);
