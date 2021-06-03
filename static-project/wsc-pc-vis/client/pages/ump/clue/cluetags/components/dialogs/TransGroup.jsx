import { Select } from '@zent/compat';
import React, { Component } from 'react';
import { Button, Notify, Dialog } from 'zent';
import promiseCallback from 'fns/promise-callback';
import { Dialog as ebizDialog } from '@youzan/ebiz-components';
import { getTagGroupList } from '../../api/group';

const { closeDialog, openDialog } = Dialog;
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
    const { tagIds } = this.props.data;
    if (!targetGroup) {
      Notify.error('请选择需要更换的分组');
      return;
    }
    this.setState({ isSubmitting: true });
    this.props.data.transTagGroup({ tagIds, newGroupId: targetGroup }).then(() => {
      Notify.success('修改分组成功');
      this.props.dialogref.submit();
      this.handleClose();
    }).catch(err => {
      if (err === '每个分组中最多添加100个标签') {
        const dialogId = 'tip';
        const handleCancel = () => closeDialog(dialogId);
        openDialog({
          dialogId,
          title: '提示',
          children: <div>
            <DialogBody>
              一个分组最多只能添加100个标签，你选择的分组剩余空间不足，<br />无法移入。
            </DialogBody>
            <DialogFooter>
              <Button type="primary" onClick={handleCancel}>我知道了</Button>
            </DialogFooter>
          </div>,
        });
      } else {
        Notify.error(err);
      }
    }).finally(() => {
      this.setState({ isSubmitting: false });
    });
  }

  componentDidMount() {
    promiseCallback(
      getTagGroupList(),
      (data) => (
        this.setState({
          groupList: data.map(one => ({ text: one.name, value: one.groupId })),
        })
      ),
    );
  }

  render() {
    const { groupList, targetGroup, isSubmitting } = this.state;
    return (
      <div className="edu-clue-tags-dialog-small">
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
          <Button outline type="primary" onClick={this.handleClose}>取消</Button>
          <Button
            type="primary"
            onClick={this.submit}
            loading={isSubmitting}
          >确认</Button>
        </DialogFooter>
      </div>
    );
  }
}
