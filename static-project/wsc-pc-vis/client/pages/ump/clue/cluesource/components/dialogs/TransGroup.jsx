import { Select } from '@zent/compat';
import React, { Component } from 'react';
import { Button, Notify, Dialog } from 'zent';
import promiseCallback from 'fns/promise-callback';
import { Dialog as ebizDialog } from '@youzan/ebiz-components';
import { findSourceGroupList } from '../../api/group';

const { openDialog, closeDialog } = Dialog;
const { DialogBody, DialogFooter } = ebizDialog;
export default class TransGroup extends Component {
  state = {
    targetGroup: '',
    groupList: [],
    isSubmitting: false,
  };

  handleClose = this.props.dialogref.close;

  submit = () => {
    const { targetGroup } = this.state;
    const { sourceIds } = this.props.data;
    if (!targetGroup) {
      Notify.error('请选择需要更换的分组');
      return void 0;
    }
    this.setState({ isSubmitting: true });
    this.props.data.changeGroup({
      command: {
        sourceIds,
        newGroupId: targetGroup,
      },
    })
      .then(() => {
        Notify.success('更换来源分组成功');
        this.props.dialogref.submit();
        this.handleClose();
      })
      .catch(err => {
        if (err === '每个来源中最多添加100个线索') {
          const dialogId = 'tip';
          const handleCancel = () => closeDialog(dialogId);
          openDialog({
            dialogId,
            title: '提示',
            children: <div>
              <DialogBody>
                一个分组最多只能添加100个来源，你选择的分组剩余空间不足，<br />无法移入。
              </DialogBody>
              <DialogFooter>
                <Button type="primary" onClick={handleCancel}>我知道了</Button>
              </DialogFooter>
            </div>,
          });
        } else {
          Notify.error(err);
        }
      })
      .finally(() => {
        this.setState({ isSubmitting: false });
      });
  };

  componentDidMount() {
    promiseCallback(
      findSourceGroupList({
        kdtId: window._global.kdtId,
        needSysGroup: false,
      }),
      data => {
        this.setState({
          groupList: data.map(one => ({ text: one.name, value: one.groupId })),
        });
      },
    );
  }

  render() {
    const { groupList, targetGroup, isSubmitting } = this.state;
    return (
      <>
        <DialogBody>
          <label htmlFor="transGroup" style={{ marginRight: '10px' }}>选择分组:</label>
          <Select
            id="transGroup"
            data={groupList}
            value={targetGroup}
            placeholder="选择分组："
            onChange={evt => this.setState({ targetGroup: evt.target.value })}
          />
        </DialogBody>
        <DialogFooter>
          <Button onClick={this.handleClose}>取消</Button>
          <Button
            type="primary"
            onClick={this.submit}
            loading={isSubmitting}
          >确认</Button>
        </DialogFooter>
      </>
    );
  }
}
