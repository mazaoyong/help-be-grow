import { Pop } from '@zent/compat';
import React from 'react';
import { IGridColumn, Notify } from 'zent';
import { deleteComment } from '../api';
import formatDate from '@youzan/utils/date/formatDate';
import { isEduBranchStore } from '@youzan/utils-shop';
import { Link as SamLink } from '@youzan/sam-components';

export interface IReplyGridParams {
  currentUser: string;
  postId: number;
  forceUpdate(): void;
  [index: string]: any;
  createReply: (obj: { actorId: number; actorRole: string; actorName: string }) => void;
}

/** 非本校区动态 */
function notFromCurrentBranch(kdtId: number) {
  return isEduBranchStore && kdtId !== _global.kdtId;
}

const defaultAvatar = 'https://img.yzcdn.cn/v4/scrm/customer/list/default-photo.png!small.webp';

export const columns: (data: IReplyGridParams) => IGridColumn[] = ({
  currentUser,
  postId,
  forceUpdate,
  createReply,
  kdtId,
}) => [
  {
    title: '',
    name: 'replyUser',
    bodyRender({
      actorName,
      replyToName,
      actorAvatar = '',
      replyContent = '',
      actorId,
      actorRole,
      createdAt,
      interactionId,
      replyTo,
    }) {
      const isDifferentBranch = notFromCurrentBranch(kdtId);
      return (
        <div className="reply-user-wrap">
          <img src={actorAvatar || defaultAvatar} className="reply-avatar"></img>
          <div style={{ flexGrow: 1 }}>
            <span>
              {replyToName === currentUser ? (
                <>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`${_global.url.v4}/scrm/customer/manage#/detail?yzUid=${actorId}`}
                  >
                    {actorName}
                  </a>{' '}
                  回复:
                </>
              ) : (
                <>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`${_global.url.v4}/scrm/customer/manage#/detail?yzUid=${actorId}`}
                  >
                    {actorName}
                  </a>{' '}
                  回复:
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`${_global.url.v4}/scrm/customer/manage#/detail?yzUid=${replyTo}`}
                  >
                    {replyToName}
                  </a>
                </>
              )}
            </span>
            <div className="reply-content-row">{replyContent}</div>
            <div className="reply-operation-wrap">
              <span className="reply-operation-time">
                {formatDate(createdAt, 'YYYY-MM-DD HH:mm:ss')}
              </span>
              <span>
                <span
                  onClick={() => {
                    createReply({ actorId, actorRole, actorName });
                  }}
                  className="reply_dialog_option"
                >
                  回复
                </span>
                <span style={{ color: '#DBDBDB' }}>{` | `}</span>
                {!isDifferentBranch ? <Pop
                  trigger="click"
                  content="确定要删除该评论吗？"
                  onConfirm={() => {
                    deleteComment({
                      command: {
                        interactionId,
                        interactionType: 2,
                        postId,
                        sender: {
                          userRole: 2,
                          userId: _global.userId,
                        },
                      },
                    })
                      .then(() => {
                        forceUpdate();
                        Notify.success('成功删除评论');
                      })
                      .catch((err) => {
                        Notify.error(err);
                      });
                  }}
                  confirmText="确定"
                  position="top-right"
                >
                  <SamLink
                    disabled={notFromCurrentBranch(kdtId)}
                    name="家校圈修改动态"
                    href="javascript:void(0);"
                  >
                  删除
                  </SamLink>
                </Pop> : <Pop trigger="hover" content="无法删除其他校区的回复内容">
                  <span className="reply_dialog_option_disabled">删除</span>
                </Pop>}
              </span>
            </div>
          </div>
        </div>
      );
    },
  },
];
