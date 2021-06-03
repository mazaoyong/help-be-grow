import React, { useState } from 'react';
import { Dialog } from 'zent';
/**
 * @param  {} Comp 传入的
 * @param  {} options
 * @param  {} dialogOptions
 */
function useChooseDialog(Comp, options) {
  const [visable, setVisable] = useState(false);
  const { onClose = null, onSubmit = null, onOpen = null, ...props } = options || {};

  const openDialog = () => {
    setVisable(true);
    if (typeof onOpen === 'function') {
      return onOpen();
    }
  };

  const closeDialog = () => {
    setVisable(false);
    if (typeof onClose === 'function') {
      return onClose();
    }
  };

  const submitDialog = data => {
    setVisable(false);
    if (typeof onSubmit === 'function') {
      return onSubmit(data);
    }
  };

  const createDialog = () => <Dialog
    {...props}
    visible={visable}
    onClose={closeDialog}
  >
    <div className='dialog-content'>
      {ComponentWrap(Comp, { close: closeDialog, submit: (data) => submitDialog(data) })}
    </div>
  </Dialog>;

  return [openDialog, createDialog];
}

const ComponentWrap = (Com, props) => {
  if (typeof Com === 'function') {
    return <Com {...props}/>;
  } else if (React.isValidElement(Com)) {
    return React.cloneElement(Com, props);
  } else {
    return null;
  }
};

export default useChooseDialog;
