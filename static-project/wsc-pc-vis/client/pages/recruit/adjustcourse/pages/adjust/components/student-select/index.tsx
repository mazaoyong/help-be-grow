import React from 'react';
import { ISwitchoutDialogProps } from './types';
import { Dialog, Button } from 'zent';
import CardList from './card-list';
import './index.scss';

const { openDialog, closeDialog } = Dialog;

let selectItem = null;

const useSelectCardlist: (params: ISwitchoutDialogProps) => Function = ({ studentInfo, onConfirm }) => {
  const setSeletctItem = (item) => {
    selectItem = item;
  };
  const onOk = () => {
    closeDialog('switch_out_dialog');
    onConfirm(selectItem);
  };
  return () => openDialog({
    dialogId: 'switch_out_dialog',
    title: '选择转出课程',
    children: (
      <div className="switch-out-dialog">
        <CardList onSelect={setSeletctItem} studentInfo={studentInfo} />
      </div>
    ),
    footer: <span>
      <Button onClick={() => closeDialog('switch_out_dialog')}>取消</Button>
      <Button type="primary" onClick={onOk}>确定</Button>
    </span>,
    onClose: () => {}
  });
};

export default useSelectCardlist;
