import React, { ComponentType, FC } from 'react';
import { Dialog, Notify } from 'zent';
import EventEmitter from 'wolfy87-eventemitter';
import { IopenDialogOptions, IDialogChildrenProps, IopenDialogRef } from './types';

const { openDialog: zentOpenDialog, closeDialog } = Dialog;

/**
 * 打开 dialog 弹窗
 *
 * @param Child - 要打开弹窗组件
 * @param options - 参数
 */
export function openDialog<T, P = any>(
  Child: ComponentType<IDialogChildrenProps<T, P>>,
  options: IopenDialogOptions<P> = {}
): IopenDialogRef<T> {
  const {
    dialogId = Date.now().toString(),
    title,
    data = null,
    closeBtn,
    mask,
    maskClosable,
    parentComponent,
    className,
    prefix,
    style,
    submitEffect = () => Promise.resolve(true),
  } = options;

  const event$ = new EventEmitter();

  const close$$ = new Promise<T>((resolve, reject) => {
    event$.once('submit', resolve);

    event$.once('close', () => {
      reject();
    });
  });

  const closeDialogAdopet = () => {
    closeDialog(dialogId, { triggerOnClose: true });
  };

  const DialogContent = () => {
    const [loadingState, setLoadingState] = React.useState(false);

    const handleSubmit = React.useCallback((data: T) => {
      if (submitEffect) {
        setLoadingState(true);
        submitEffect(data)
          .then((allowClose) => (allowClose ? Promise.resolve(data) : Promise.reject()))
          .then((data) => {
            event$.emit('submit', data);
            closeDialog(dialogId, { triggerOnClose: false });
          })
          .catch(err => err && Notify.error(err))
          .finally(() => setLoadingState(false));
      } else event$.emit('submit', data);
    }, []);

    return (
      <Child
        data={data!}
        loadingState={loadingState}
        dialogref={{
          submit: handleSubmit,
          close: closeDialogAdopet,
        }}
      />
    );
  };

  zentOpenDialog({
    dialogId,
    children: <DialogContent />,
    title,
    closeBtn,
    mask,
    maskClosable,
    parentComponent,
    className,
    prefix,
    style,
    onClose: () => {
      event$.emit('close');
    },
  });

  return {
    close: closeDialogAdopet,
    afterClosed: () => close$$,
  };
}

export const DialogBody: FC<{}> = ({ children }) => {
  return <div className="dialog-r-body">{children}</div>;
};

export const DialogFooter: FC<{}> = ({ children }) => {
  return <div className="dialog-r-footer">{children}</div>;
};
