import React, { FC, useCallback, useState, useEffect } from 'react';
import { Dialog, Button } from 'zent';
import ReplyGrid from './reply-grid';
import './index.scss';
const { openDialog, closeDialog } = Dialog;

interface IReplyDialogParams {
  commentNum: number;
  currentUser: string;
  postId: number;
  senderRole: number;
  senderId: number;
  [index: string]: any;
}

const ReplyDialog: FC<IReplyDialogParams> = (props) => {
  const { commentNum: initCommentNum = 0, currentUser, postId, senderRole, senderId, kdtId } = props;
  const [commentNum, setCommentNum] = useState(initCommentNum);

  useEffect(() => {
    setCommentNum(initCommentNum);
  }, [initCommentNum]);

  const open = useCallback(() => {
    openDialog({
      dialogId: 'replay_dialog',
      title: `回复（${commentNum}）`,
      mask: true,
      maskClosable: false,
      children: (
        <ReplyGrid
          postId={postId}
          currentUser={currentUser}
          senderId={senderId}
          senderRole={senderRole}
          onCommentNumChange={setCommentNum}
          kdtId={kdtId}
        />
      ),
      onClose: () => {
        closeDialog('replay_dialog');
      },
      footer: <Button type='primary' onClick={() => closeDialog('replay_dialog') }>关闭</Button>,
    });
  }, [commentNum, postId, currentUser, senderId, senderRole, kdtId]);

  return <>
    <span className={'reply_dialog_option'} onClick={open}>查看回复({commentNum})</span>
  </>;
};

export default ReplyDialog;
