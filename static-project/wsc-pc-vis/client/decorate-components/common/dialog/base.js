import React from 'react';
import { Dialog } from 'zent';
import omit from 'lodash/omit';

const { openDialog, closeDialog } = Dialog;

export default Component => {
  return props => {
    return new Promise((resolve, reject) => {
      const dialogId = `${Date.now()}`;
      const close = () => {
        closeDialog(dialogId);
      };
      const confirm = data => {
        resolve(data);
        close();
      };
      const cancel = reason => {
        reject(reason);
        close();
      };
      const omitProps = omit(props, ['title', 'width']);
      openDialog({
        dialogId,
        title: props.title || '提示',
        style: {
          width: props.width ? `${props.width}px` : '500px',
        },
        children: <Component {...omitProps} onConfirm={confirm} onCancel={cancel} />,
      });
    });
  };
};
