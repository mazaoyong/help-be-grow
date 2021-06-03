import React, { Component } from 'react';
import {
  Button,
  // Popover,
  // Menu,
  // Notify,
  // Pop,
  // Icon
} from 'zent';
import { connect } from 'react-redux';

import './index.scss';

class Topbar extends Component {
  constructor(props) {
    super(props);
    const { id, isCreate } = this.props;

    const stateObj = {
      loading: true,
      saveLoading: false,
      saveDraftLoading: false,
      savePreviewLoading: false,
      simplificationLoading: false,
      alias: '',
      isCreate,
      id,
    };
    this.state = stateObj;
  }

  render() {
    const {
      saveLoading,
      saveOnlyLoading,
      // saveDraftLoading,
      // savePreviewLoading
    } = this.state;
    return (
      <div className="top-bar">
        <div className="top-bar-back" onClick={this.backToPrev}>
          返回
        </div>
        <div className="decorate-action">
          <Button
            loading={saveOnlyLoading}
            onClick={this.backToPrev}
          >
            取消
          </Button>
          <Button
            type="primary"
            loading={saveLoading}
            onClick={this.props.handleSave.bind(this)}
          >
            保存
          </Button>
        </div>
      </div>
    );
  }

  backToPrev = () => {
    this.props.backToGroupList();
  }
}

export default connect(state => {
  const { previewState, editorsState } = state;
  return {
    comEditors: editorsState.comEditors,
    validations: editorsState.validations,
    hasModified: editorsState.hasModified,
    instList: previewState.instList,
    instPositions: previewState.instPositions,
  };
})(Topbar);
