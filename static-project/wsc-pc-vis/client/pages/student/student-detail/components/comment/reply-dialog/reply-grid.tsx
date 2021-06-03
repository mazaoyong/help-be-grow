import React, { FC, useState, useEffect, useCallback } from 'react';
import { Grid, IGridOnChangeConfig, IGridPageInfo, Notify, Button, Dialog } from 'zent';
import { columns } from './columns';
import { findComments } from '../api';
import CreateReplyComponent from './create-reply';

const { openDialog, closeDialog } = Dialog;

const noop = () => {};

const CREATE_REPLY_DIALOG_ID = 'creat_replay_dialog';

interface IProps {
  currentUser: string;
  postId: number;
  onCommentNumChange?: (commentNum: number) => void;
  senderId: number;
  senderRole: number;
  kdtId: number;
}

const EmptyLabel = (
  <div className='reply_dialog_empty'>
    <img className='reply_dialog_empty-img' src='https://b.yzcdn.cn/public_files/d0ef87aafb0cf08dd0f9a2fe0f03ce7a.png' />
    <p className='reply_dialog_empty-tip'>暂无回复</p>
  </div>
);

const ReplyGrid: FC<IProps> = props => {
  const { currentUser = '', postId, onCommentNumChange = noop, senderId, senderRole, kdtId } = props;
  const [datasets, setDatasets] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageInfo, setPageInfo] = useState<IGridPageInfo>({
    current: 1,
    total: 0,
    pageSize: 6,
  });

  const fetchData = useCallback(() => {
    setLoading(true);
    findComments({
      pageRequest: {
        pageNumber: pageInfo.current || 1,
        pageSize: pageInfo.pageSize,
      },
      query: {
        postId,
      },
    })
      .then(resp => {
        if (resp) {
          setDatasets(resp.content);
          onCommentNumChange(resp.total);
          setPageInfo(prev => {
            return {
              ...prev,
              total: resp.total
            };
          });
        }
      })
      .catch(Notify.error)
      .finally(() => setLoading(false));
  }, [onCommentNumChange, pageInfo, postId]);

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageInfo.current]);

  const onPageChange: ((conf: IGridOnChangeConfig) => any) | undefined = ({ current = 1 }) => {
    setPageInfo({ ...pageInfo, current });
  };

  const createReply = useCallback(({ actorId, actorRole, actorName }) => {
    openDialog({
      dialogId: CREATE_REPLY_DIALOG_ID,
      title: `回复 ${actorName}`,
      mask: true,
      maskClosable: false,
      children: (
        <CreateReplyComponent
          dialogId={CREATE_REPLY_DIALOG_ID}
          forceUpdate={fetchData}
          postId={postId}
          actorId={actorId}
          actorRole={actorRole}
        />
      ),
      onClose: () => {
        closeDialog(CREATE_REPLY_DIALOG_ID);
      },
    });
  }, [fetchData, postId]);

  const createCommentReply = useCallback(() => {
    createReply({ actorName: '', actorId: senderId, actorRole: senderRole });
  }, [createReply, senderId, senderRole]);

  return (
    <>
      <div className='reply_dialog_top'>
        <Button type='primary' onClick={createCommentReply}>回复</Button>
      </div>
      <Grid
        className="reply_dialog_grid"
        rowKey="interactionId"
        loading={loading}
        columns={columns({ currentUser, postId, forceUpdate: fetchData, createReply, kdtId })}
        datasets={datasets}
        pageInfo={pageInfo}
        onChange={onPageChange}
        emptyLabel={EmptyLabel}
      />
    </>
  );
};

export default ReplyGrid;
