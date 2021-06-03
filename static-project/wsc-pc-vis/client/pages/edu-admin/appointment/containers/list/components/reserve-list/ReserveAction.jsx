import { Pop } from '@zent/compat';
import React, { Component } from 'react';
import { Dialog } from 'zent';
import PopStatusSelect from '../../../../components/pop-status-select';
import DialogReserve from '../../../../components/dialog-reserve';
import { RESERVE_DIALOG_NAME } from '../../../../constants';
const { openDialog, closeDialog } = Dialog;

export default class ReserveAction extends Component {
  openDialog = () => {
    const { reserve, updateReserveData } = this.props;
    openDialog({
      maskClosable: false,
      dialogId: RESERVE_DIALOG_NAME,
      title: '修改预约',
      children: (
        <DialogReserve
          reserve={reserve}
          closeDialog={() => closeDialog(RESERVE_DIALOG_NAME)}
          updateReserveData={updateReserveData}
        />
      ),
      onClose() {
        // 这里进行关闭回调处理
      },
    });
  };
  render() {
    const { reserve, updateReserveData } = this.props;
    return (
      <div className="reserve-list__operation">
        <span className="reserve-list__reserve-change" onClick={this.openDialog}>
          修改
        </span>
        <span className="reserve-list__gap-line" />
        <Pop
          className="reserve-status-pop"
          trigger="hover"
          position="bottom-right"
          content={<PopStatusSelect reserve={reserve} updateReserveData={updateReserveData} />}
        >
          <span className="reserve-list__status-change">更改状态</span>
        </Pop>
      </div>
    );
  }
}
