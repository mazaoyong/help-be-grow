import { Button, Notify } from 'zent';
import React, { Component } from 'react';
import { Dialog } from '@youzan/ebiz-components';

import { batchDeleteSource } from '../../api/list';

const { DialogBody, DialogFooter } = Dialog;
class DeleteSource extends Component {
  state = {
    loading: false,
  };

  confirm = () => {
    this.setState({ loading: true });
    const sourceIds = this.props.data && this.props.data.sourceIds;
    if (!sourceIds) {
      throw new Error('Invalid: lack of sourceIds');
    }
    const payload = { sourceIds };
    const successHint = sourceIds.length > 1 ? '批量删除来源成功' : '删除来源成功';
    // 提交新建分组数据
    batchDeleteSource(payload).then(() => {
      Notify.success(successHint);
    })
      .catch(err => {
        Notify.error(err);
      })
      .finally(() => {
        this.props.dialogref.submit();
        this.setState({ loading: false });
      });
  };

  handleClose = this.props.dialogref.close;

  render() {
    const { loading } = this.state;
    const sourceIds = (this.props.data && this.props.data.sourceIds) || [];
    const sourceIdsLength = sourceIds.length;
    return (
      <>
        <DialogBody className="delete-source">
          <div className="alarmtext">
            {sourceIdsLength > 1 ? `确认删除当前选中的${sourceIdsLength}条来源数据吗？` : '确认删除该来源吗？'}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button loading={loading} onClick={this.confirm}>确认</Button>
          <Button type="primary" onClick={this.handleClose}>取消</Button>
        </DialogFooter>
      </>
    );
  }
}

export default DeleteSource;
