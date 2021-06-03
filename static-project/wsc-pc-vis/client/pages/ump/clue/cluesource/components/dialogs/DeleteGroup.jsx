import React, { Component } from 'react';
import { Button } from 'zent';
import promiseCallback from 'fns/promise-callback';
import { Dialog } from '@youzan/ebiz-components';
import { deleteSourceGroup } from '../../api/group';

const { DialogBody, DialogFooter } = Dialog;
class DeleteGroup extends Component {
  state = {
    isSubmitting: false,
  };

  confirm = () => {
    this.setState({ isSubmitting: true });
    const groupId = this.props.data && this.props.data.groupId;
    if (!groupId) {
      throw new Error('Warn: groupId');
    }
    const payload = { groupId };
    // 提交新建分组数据
    promiseCallback(
      deleteSourceGroup(payload),
      ['success', '删除分组成功', () => {
        this.props.dialogref.submit();
        this.handleClose();
      }],
    ).finally(() => this.setState({ isSubmitting: false }));
  };

  handleClose = this.props.dialogref.close;

  render() {
    const { isSubmitting } = this.state;
    return (
      <>
        <DialogBody className="deletegroup">
          <div className="alarmtext">
            如果删除分组，当前分组下的来源也会被删除，你确认删除吗？
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

export default DeleteGroup;
