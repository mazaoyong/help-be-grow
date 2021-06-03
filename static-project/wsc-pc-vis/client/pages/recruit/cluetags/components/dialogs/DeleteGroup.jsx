import { get } from 'lodash';
import React, { Component } from 'react';
import { Button } from 'zent';
import promiseCallback from 'fns/promise-callback';
import { Dialog } from '@youzan/ebiz-components';

const { DialogBody, DialogFooter } = Dialog;
class DeleteGroup extends Component {
  state = {
    isSubmitting: false,
  };

  confirm = () => {
    this.setState({ isSubmitting: true });
    const groupId = get(this.props.data, 'groupId');
    if (!groupId) {
      throw new Error('请检查groupId是否在调用dialog之前在data中声明');
    }
    const payload = { groupId };
    // 提交新建分组数据
    promiseCallback(
      this.props.data.deleteTagGroup(payload),
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
          如果删除当前分组，该分组下的标签也会被删除，使用过这些标签的线索，相应的标签记录也会被删除，你确认删除吗？
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
