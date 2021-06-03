import React from 'react';
import { Dialog, IOpenDialogOption } from 'zent';
import uuid from 'uuid';

type IDialog = {
  open: (title: string, props?: object) => void;
  close: () => void;
};

export interface IWrapperFunc<T> {
  (component: React.ComponentClass<any> | React.FC<any>, dialogProps?: Partial<IOpenDialogOption>): T;
}

const { openDialog, closeDialog } = Dialog;

const wrapper: IWrapperFunc<IDialog> = (Comp, dialogProps) => {
  const dialogId = uuid.v4();
  return {
    open: (title, props = {}) => {
      openDialog({
        dialogId,
        title,
        maskClosable: false,
        children: <Comp {...props} close={() => closeDialog(dialogId)} />,
        ...dialogProps,
      });
    },
    close: () => closeDialog(dialogId),
  };
};

export default wrapper;
