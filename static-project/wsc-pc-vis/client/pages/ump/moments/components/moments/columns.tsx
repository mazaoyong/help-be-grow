import { Pop } from '@zent/compat';
import React, { useState, FC } from 'react';
import { IGridColumn, Dialog, previewImage, Icon } from 'zent';
import fullfillImage from 'zan-utils/fullfillImage';
import { ReplyDialog } from '@ability-center/supv/moments';
import CommentDialog from './comment-dialog';
import { Video as VideoPreview } from '@youzan/ebiz-components';
import formatDate from '@youzan/utils/date/formatDate';
import OperationPop from './delete-operation';
const { openDialog, closeDialog } = Dialog;

const TextExpand: FC<{textContent: string}> = (props) => {
  const { textContent } = props;
  const [isExpand, setIsExpand] = useState(false);
  return <div style={{ wordBreak: 'break-all' }}>
    {
      !isExpand && <div>{`${textContent.slice(0, 100)}...`}<span style={{ color: '#155bd4', cursor: 'pointer' }} onClick={() => {
        setIsExpand(true);
      }}>更多</span></div>
    }
    {
      isExpand && <div>{textContent}<span style={{ color: '#155bd4', cursor: 'pointer' }} onClick={() => {
        setIsExpand(false);
      }}>  收起</span></div>
    }
  </div>;
};

export const columns: (type: number, setLoading: (boolean)=>void, queryData: any)
=> IGridColumn[] = (type, setLoading, queryData) => {
  return [
    {
      title: '评论内容',
      name: 'textContent',
      width: '20%',
      bodyRender({ textContent, extraContents }) {
        return <div>
          { textContent.length > 100 && <TextExpand textContent={textContent}></TextExpand>}
          { textContent.length <= 100 && <div>{textContent}</div>}
          <div className="moments_media_layout">
            {!!extraContents.length && extraContents[0].contentType === 2 && <VideoPreview
              coverUrl={extraContents[0].videoDTO ? extraContents[0].videoDTO.coverUrl : ''}
              id={extraContents[0].id}
              url={extraContents[0].url}
              deleted={extraContents[0].videoDTO ? extraContents[0].videoDTO.deleted : false}
            />}
            {!!extraContents.length && extraContents[0].contentType === 0 &&
            extraContents.map((item, index) => {
              return (
                <div onClick={() => {
                  previewImage({
                    images: extraContents.map((item) => fullfillImage(item.url)),
                    showRotateBtn: false,
                    index
                  });
                }} className="image-sortable__item" key={`${item.id}${index}`}>
                  <img src={item.url} />
                </div>
              );
            })}
          </div>
        </div>;
      }
    },
    {
      title: '评价老师',
      name: 'senderName',
      bodyRender({ senderName }) {
        return <span>{senderName}</span>;
      }
    },
    {
      title: '评价对象',
      name: 'mentionedUser',
      bodyRender({ mentionedUsers = [] }) {
        return <div className='moments_comment_targets_wrap'>{
          mentionedUsers.length <= 4
            ? mentionedUsers.map((item, index) => {
              return item.isDeleted ? <Pop trigger="hover" content="学员已被删除"><span style={{ color: '#999' }}>{item.userName}</span></Pop> : <a key={`${item.userId}${index}`} target="_blank" rel="noopener noreferrer" href={`${_global.url.v4}/vis/edu/page/student#/detail/${item.userId}`}>{item.userName}</a>;
            })
            : mentionedUsers.slice(0, 4).map((item, index) => {
              return <> <a key={`${item.userId}${index}`} target="_blank" rel="noopener noreferrer" href={`${_global.url.v4}/vis/edu/page/student#/detail/${item.userId}`}>{item.userName}</a>
                {index === 3 && <Pop trigger="hover" position="bottom-center" content={<div className='moments_comment_popup_wrap'>{
                  mentionedUsers.map((popItem, index) => {
                    const userName = index === mentionedUsers.length - 1 ? popItem.userName : `${popItem.userName}、`;
                    return popItem.isDeleted ? <Pop trigger="hover" content="学员已被删除"><span style={{ color: '#999' }}>{userName}</span></Pop> : <a key={`${popItem.userId}${index}`} target="_blank" rel="noopener noreferrer" href={`${_global.url.v4}/vis/edu/page/student#/detail/${item.userId}`}>{userName}</a>;
                  })
                }</div>} className="reserve-pop-item">
                  <a>...</a>
                </Pop>}
              </>;
            })
        }</div>;
      }
    },
    {
      title: '评价时间',
      name: 'createdAt',
      bodyRender({ extraContents = [], createdAt, state }) {
        if (extraContents.length && extraContents[0].contentType === 2 && state !== 2) {
          return <span>
            {state === 3 && <Pop trigger='hover' content="视频审核未通过，点评未发送请修改后重新发送点评。">
              <div>
                <Icon style={{ color: 'rgb(223, 69, 69)' }} type='info-circle' /><span>转码/审核失败</span>
              </div>
            </Pop>}
            {state < 2 && <>视频审核中，点评未发送。</>}
          </span>;
        } else {
          return formatDate(createdAt, 'YYYY-MM-DD HH:mm:ss');
        }
      }
    },
    {
      title: '操作',
      fixed: 'right',
      width: '200px',
      textAlign: 'right',
      name: 'operation',
      bodyRender(data) {
        const { commentNum = 0, senderName, postId = 0, mentionedUsers = [], senderId, senderRole } = data;

        const onModifyMoment = () => {
          openDialog({
            dialogId: 'modify_comment_dialog',
            maskClosable: false,
            mask: true,
            title: '修改点评',
            children: <CommentDialog data={data} queryData={queryData} isEdit={true} type={type} onClose={() => {
              closeDialog('modify_comment_dialog');
              setLoading(true);
            }}/>,
            onClose: () => {
              closeDialog('modify_comment_dialog');
            }
          });
        };

        return <div className="moments_operation_wrap">
          <ReplyDialog postId={postId} currentUser={senderName} commentNum={commentNum}
            senderId={senderId} senderRole={senderRole} />
          <span style={{ color: '#DCDEE0' }}> | </span>
          <span onClick={onModifyMoment} className="moments_operation_modify">修改</span>
          <span style={{ color: '#DCDEE0' }}> | </span>
          <OperationPop postId={postId} mentionedUsers={mentionedUsers} setLoading={setLoading} />
        </div>;
      }
    }
  ];
};
