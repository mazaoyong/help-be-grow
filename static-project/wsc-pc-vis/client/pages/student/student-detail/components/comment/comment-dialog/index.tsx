import React, { FC } from 'react';
import CommentForm from './comment-form';
import './index.scss';

interface ICommentDialogParam {
  onClose: (saved?: boolean) => void;
  type: number;
  isEdit?: boolean;
  isBackground?: boolean;
  data?: any;
  queryData?: any;
}

const CommentDialog: FC<ICommentDialogParam> = (props) => {
  // const onFormChange = (data) => {
  //   console.log('onchange', data);
  // };
  return <CommentForm {...props}/>;
};

export default CommentDialog;
