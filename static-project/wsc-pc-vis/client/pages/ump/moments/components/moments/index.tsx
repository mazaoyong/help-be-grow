import React, { FC, useState } from 'react';
import { Button, Dialog } from 'zent';
import MomentsGrid, { IMomentsParams } from './grid';
import CommentDialog from './comment-dialog';
import './index.scss';
const { openDialog, closeDialog } = Dialog;

const Moments: FC<IMomentsParams> = (props) => {
  const { type = 0, queryData, fetchDataRef } = props;
  const [ loading, setLoading ] = useState<boolean>(true);
  const onCreateMoment = () => {
    openDialog({
      dialogId: 'create_comment_dialog',
      title: '写点评',
      mask: true,
      maskClosable: false,
      children: <CommentDialog queryData={queryData} type={type} onClose={() => {
        closeDialog('create_comment_dialog');
        setLoading(true);
      }}/>,
      onClose: () => {
        closeDialog('create_comment_dialog');
      },
    });
  };

  return <div>
    {type !== 1 && <Button className="moments_create_btn" type="primary" onClick={onCreateMoment}>写点评</Button> }
    <MomentsGrid
      loading={loading}
      setLoading={setLoading}
      queryData={queryData}
      type={type}
      fetchDataRef={fetchDataRef}
    />
  </div>;
};

export default Moments;
