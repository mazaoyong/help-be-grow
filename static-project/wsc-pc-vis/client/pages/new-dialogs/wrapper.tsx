import React from 'react';
import { Dialog } from 'zent';
import uniqueId from 'lodash/uniqueId';

type IDialog = {
  open: (title: string, props?: object) => void;
  close: (any) => void;
}

export interface IWrapperFunc<T> {
  (component: React.ComponentClass<any> | React.FC<any>, className?: string): T;
}

const { openDialog, closeDialog } = Dialog;

const wrapper: IWrapperFunc<IDialog> = (Comp, className) => {
  const dialogId = uniqueId('edu-admin-dialog');
  return {
    open: (title: string, props = {}, onClose?: () => void) => {
      openDialog({
        dialogId,
        title,
        maskClosable: false,
        className,
        onClose: onClose || undefined,
        children: <Comp {...props} close={() => closeDialog(dialogId)} />,
      });
    },
    close: () => closeDialog(dialogId),
  };
};

export default wrapper;
