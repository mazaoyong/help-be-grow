import React, { FC, useState, useCallback, useEffect } from 'react';
import { Dialog } from 'zent';
import CommentRecordsGrid, { ICommentRecordsParams } from './grid';
import CommentDialog from './comment-dialog';
import './index.scss';
const { openDialog, closeDialog } = Dialog;

const openCommentDialog = (options: ICommentRecordsParams, handleClose?: () => void) => {
  openDialog({
    dialogId: 'create_comment_dialog',
    title: '写点评',
    mask: true,
    maskClosable: false,
    children: (
      <CommentDialog
        {...options}
        onClose={() => closeDialog('create_comment_dialog')}
      />
    ),
    onClose: () => {
      closeDialog('create_comment_dialog');
      handleClose && handleClose();
    },
  });
};

const CommentRecords: FC<ICommentRecordsParams> = props => {
  const { type = 0, queryData, updatingSignal: propsUpdatingSignal } = props;
  const [updatingSignal, setSignal] = useState(0);

  const updateSignal = useCallback(() => {
    setSignal(updatingSignal + 1);
  }, [updatingSignal]);

  useEffect(() => {
    if (propsUpdatingSignal) {
      setSignal(updatingSignal + 1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propsUpdatingSignal]);

  return (
    <CommentRecordsGrid
      updatingSignal={updatingSignal}
      queryData={queryData}
      onRefresh={updateSignal}
      type={type}
    />
  );
};

export default CommentRecords;
export { openCommentDialog };
