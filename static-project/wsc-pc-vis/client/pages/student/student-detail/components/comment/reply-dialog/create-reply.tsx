import React, { FC, useState, useCallback } from 'react';
import { Input, Button, Dialog, Notify } from 'zent';
import { createComment } from '../api';

const { closeDialog } = Dialog;

interface IProps {
  forceUpdate: () => any;
  postId: number;
  actorId: number;
  actorRole: number;
  dialogId: string;
}

const CreateReplyComponent: FC<IProps> = ({ forceUpdate, postId, actorId, actorRole, dialogId }) => {
  const [ reply, setReply ] = useState('');
  const postComment = useCallback(() => {
    createComment({ command: {
      interactionType: 2,
      postId,
      replyContent: reply,
      receiver: {
        userId: actorId,
        userRole: actorRole,
      },
      sender: {
        userId: _global.userId,
        userRole: 2,
      },
    } }).then(() => {
      closeDialog(dialogId);
      forceUpdate();
    }).catch(err => {
      Notify.error(err, 2000);
    });
  }, [actorId, actorRole, dialogId, forceUpdate, postId, reply]);
  return (
    <>
      <Input
        type="textarea"
        className="create_reply_input"
        maxLength={5000}
        placeholder='用礼貌的回复给学生和家长留下一个美好的学习印象吧'
        showCount
        value={reply}
        onChange={(e) => setReply(e.target.value)}
      />
      <div className="create-reply-operation">
        <span>
          <Button onClick={() => closeDialog('creat_replay_dialog') }>取消</Button>
          <Button type="primary" onClick={postComment}>回复</Button>
        </span>
      </div>
    </>
  );
};

export default CreateReplyComponent;
