import React from 'react';
import ReactDOM from 'react-dom';
import noop from 'lodash/noop';
import partial from 'lodash/partial';
import isSsr from '@youzan/utils/browser/isSsr';
import uniqueId from 'lodash/uniqueId';

const dialogInstanceMap = {};

function ensureUniqDialogInstance(dialogId: string) {
  if (dialogInstanceMap[dialogId]) {
    throw new Error(`Duplicate dialog id found: ${dialogId}`);
  }
}

function addDialogInstance(dialogId: string, dialog: any) {
  dialogInstanceMap[dialogId] = dialog;
}

export function closeDialog(dialogId: string, options = {} as any) {
  const dialog = dialogInstanceMap[dialogId];

  if (!dialog) {
    return;
  }

  delete dialogInstanceMap[dialogId];

  const { onClose, container, getClose } = dialog;

  const closeCallback = () => {
    const { triggerOnClose = true } = options;
    if (triggerOnClose && onClose) {
      onClose();
    }

    ReactDOM.unmountComponentAtNode(container);
  };

  const close = getClose();

  if (close) {
    close(() => {
      closeCallback();
    });
  } else {
    closeCallback();
  }
}

/*
  打开一个dialog，返回值是一个用来关闭dialog的函数。
*/
export default function openDialog(options = {} as any, Comp) {
  if (isSsr()) {
    return noop;
  }

  const {
    onClose: oldOnClose,
    ref,
    dialogId = uniqueId('__zent-dialog__'),
    parentComponent,
  } = options;

  ensureUniqDialogInstance(dialogId);

  const container = document.createElement('div');

  // 确保多次调用close不会报错
  const closeHandler = evt => {
    closeDialog(dialogId, {
      triggerOnClose: evt !== false,
    });
  };

  let close = null;

  const props = {
    ...options,
    visible: true,
    onClose: closeHandler,
    refClose: closeInstance => {
      close = closeInstance;
    },
  };

  // 只支持函数形式的ref
  if (ref && typeof ref !== 'function') {
    delete props.ref;
  }

  const render = parentComponent
    ? partial(ReactDOM.unstable_renderSubtreeIntoContainer, parentComponent)
    : ReactDOM.render;

  // 不要依赖render的返回值，以后可能行为会改变
  // @ts-ignore
  render(React.createElement(Comp, props), container);

  addDialogInstance(dialogId, {
    onClose: oldOnClose,
    container,
    getClose: () => close, // the order of the call of refClose and here is uncertain, use closure
  });

  return closeHandler;
}
