import { Button } from 'zent';
import React, { Component } from 'react';
import promiseCallback from 'fns/promise-callback';
import { Dialog } from '@youzan/ebiz-components';

const { DialogBody, DialogFooter } = Dialog;
class DeleteTag extends Component {
  state = {
    isSubmitting: false,
  };

  confirm = () => {
    this.setState({ isSubmitting: true });
    const tagIds = (this.props && this.props.data && this.props.data.tagIds) || [];
    const tip = tagIds.length > 1 ? '批量删除标签成功' : '删除标签成功';
    // 提交新建分组数据
    promiseCallback(
      this.props.data.deleteTagOrTags({ tagIds }),
      ['success', tip, () => {
        this.props.dialogref.submit();
        this.handleClose();
      }],
    ).finally(() => this.setState({ isSubmitting: false }));
  };

  handleClose = this.props.dialogref.close;

  render() {
    const { isSubmitting } = this.state;
    const tagIds = (this.props && this.props.data && this.props.data.tagIds) || [];
    const tagIdsLength = tagIds.length;
    return (
      <>
        <DialogBody className="deletetag">
          <div className="alarmtext">
            {tagIdsLength > 1 ? `确认删除当前选中的${tagIdsLength}条标签数据吗？` : '确认删除该标签吗？'}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button loading={isSubmitting} onClick={this.confirm}>确认</Button>
          <Button type="primary" onClick={this.handleClose}>取消</Button>
        </DialogFooter>
      </>
    );
  }
}

export default DeleteTag;
