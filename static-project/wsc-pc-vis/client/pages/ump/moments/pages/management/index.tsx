import { Pop } from '@zent/compat';
import React, { FC, useCallback, useMemo, useRef, useState } from 'react';
import { Dialog, Button, Notify, ClampLines, previewImage, Icon } from 'zent';
import { Button as SamButton, Link as SamLink } from '@youzan/sam-components';
import { EasyList, Img, Video as VideoPreview } from '@youzan/ebiz-components';
import { BlankLink, Operations } from '@youzan/react-components';
import { date } from '@youzan/utils';
import { isEduChainStore, isEduBranchStore } from '@youzan/utils-shop';
import { IEasyGridColumn, ICombinedFilterConf, FilterRefType } from '@youzan/ebiz-components/es/types/easy-list';
import { CommentDialog, ReplyDialog } from '@ability-center/supv/moments';
import { findPosts, deleteMoments } from '../../api';
import './style.scss';

const { Filter, EasyGrid, List, DatePickerTypes } = EasyList;
const { ImgWrap } = Img;
interface MomentsExtraContentsType {
  contentType: number; // 0: 图片 2: 视频
  id: number;
  url: string;
  // 仅在contentType === 2时提供
  videoDTO: null | {
    coverHeight: number;
    coverWidth: number;
    coverUrl: string;
    deleted: boolean;
    duration: number;
    videoId: number;
    videoStatus: number;
  };
}

interface MomentsItem {
  kdtId: number;
  postId: number;
  createdAt: number;
  textContent: string;
  senderRole: number;
  senderId: number;
  senderName: string;
  commentNum: number;
  visibility: number;
  state: number; // 动态审核状态
  mentionedUsers: {
    userName: string;
    userRole: number;
    userId: number;
    isDeleted: boolean;
  }[];
  extraContents: MomentsExtraContentsType[];
}

function getStaffLink(staffId: number) {
  if (isEduChainStore) {
    return `${_global.url.v4}/setting/chainstaff#/staff/view/${staffId}`;
  }
  return `${_global.url.v4}/setting/staff#/view/${staffId}`;
}

/** 非本校区动态 */
function notFromCurrentBranch(item: MomentsItem) {
  return isEduBranchStore && item.kdtId !== _global.kdtId;
}

/** 发送人是非本校区的员工 */
function isUnavaliableStaffSender(item: MomentsItem) {
  return notFromCurrentBranch(item) && item.senderRole >= 2;
}

const MomentsExtraContents: FC<{ itemList: MomentsExtraContentsType[] }> = ({ itemList }) => {
  const imgList = itemList.filter(it => it.contentType === 0).map(it => it.url);
  return <>
    {itemList.map((item, index) => {
      if (item.contentType === 0) {
        return (
          <ImgWrap
            key={index}
            width="45px"
            height="45px"
            src={item.url}
            fullfill="!100x100.jpg"
            onClick={() => previewImage({
              images: imgList,
              index,
            })}
          />
        );
      }
      if (item.contentType === 2) {
        return (
          <VideoPreview
            coverUrl={item.videoDTO!.coverUrl}
            key={index}
            id={item.id}
            url={item.url}
            deleted={item.videoDTO!.deleted}
          />
        );
      }
    })}
  </>;
};

const filterConfig: ICombinedFilterConf[] = [
  { label: '动态发布时间：', name: 'dateRange', type: DatePickerTypes.DateRangePicker },
  {
    label: '发布人身份：',
    name: 'senderRole',
    type: 'Select',
    defaultValue: 9,
    options: [
      { text: '全部', value: '9' },
      { text: '老师', value: '2' },
      { text: '客户', value: '0' },
    ],
  },
];
const visibilityEnum = {
  0: '全校可见',
  1: '仅被点评学员可见',
  2: '仅本节课学员可见',
};

export const Management: FC = () => {
  const filterRef = useRef<FilterRefType>(null);
  const expandMoments = useRef(new Set<number>());
  const [forceUpdateId, forceUpdate] = useState(0);
  const openMomonetDialog = useCallback((data?: MomentsItem) => {
    Dialog.openDialog({
      dialogId: 'comment_dialog',
      title: '发动态',
      mask: true,
      maskClosable: false,
      children: (
        <CommentDialog
          data={{
            kdtId: _global.kdtId,
            ...data,
          }}
          queryData={{
            kdtId: _global.kdtId,
            lessonName: '',
          }}
          isEdit={!!data}
          isBackground
          type={2}
          onClose={(saved) => {
            Dialog.closeDialog('comment_dialog');
            if (saved && filterRef.current) {
              filterRef.current.reset();
            }
          }}
        />
      ),
      onClose: () => {
        Dialog.closeDialog('comment_dialog');
      },
    });
  }, []);

  const columns = useMemo<IEasyGridColumn<MomentsItem>[]>(() => [
    {
      title: '动态内容',
      width: 228,
      name: 'textContent',
      bodyRender: (item) => {
        const expanded = expandMoments.current.has(item.postId);
        return <>
          {expanded ? (
            <div>
              <span className="moments-text-content">
                {item.textContent}
                <a onClick={() => {
                  expandMoments.current.delete(item.postId);
                  forceUpdate(forceUpdateId + 1);
                }}>收起</a>
              </span>
            </div>
          ) : (
            <ClampLines
              className="moments-text-content"
              lines={expanded ? Infinity : 5}
              text={item.textContent}
              showPop={false}
              extra={<a onClick={() => {
                expandMoments.current.add(item.postId);
                forceUpdate(forceUpdateId + 1);
              }}>
                更多
              </a>}
            />
          )}
          <div className="moments-extra-content">
            <MomentsExtraContents itemList={item.extraContents} />
          </div>
        </>;
      },
    },
    {
      title: '发布人',
      width: 94,
      bodyRender: (item) => (isUnavaliableStaffSender(item) || (isEduBranchStore && item.senderRole === 0))
        ? item.senderName
        : (
          <BlankLink
            href={item.senderRole === 0
              ? `${_global.url.v4}/scrm/customer/manage#/detail?yzUid=${item.senderId}`
              : getStaffLink(item.senderId)
            }
            className="schedule-detail_list-name"
          >
            {item.senderName}
          </BlankLink>
        ),
    },
    {
      title: '发布时间',
      name: 'createdAt',
      needSort: true,
      width: 105,
      bodyRender({ extraContents = [], createdAt, state }) {
        if (extraContents.length && extraContents[0].contentType === 2 && state !== 2) {
          return <span>
            {state === 3 && <Pop trigger='hover' content="视频审核未通过，动态未发送请修改后重新发送动态。">
              <div>
                <Icon style={{ color: 'rgb(223, 69, 69)' }} type='info-circle' /><span>转码/审核失败</span>
              </div>
            </Pop>}
            {state < 2 && <>视频审核中，动态未发送。</>}
          </span>;
        } else {
          return date.makeDateTimeStr(createdAt);
        }
      },
    },
    {
      title: '被点评学员',
      width: 180,
      bodyRender: (item) => notFromCurrentBranch(item)
        ? item.mentionedUsers.map((user, index) => (
          <React.Fragment key={index}>
            {user.userName}
            {index !== item.mentionedUsers.length - 1 && '、'}
          </React.Fragment>
        ))
        : item.mentionedUsers.map((user, index) => (
          <React.Fragment key={index}>
            {!user.isDeleted ? <BlankLink href={`${_global.url.v4}/vis/edu/page/student#/detail/${user.userId}`}>
              {user.userName}
            </BlankLink> : <Pop trigger="hover" content="学员已被删除"><span style={{ color: '#999' }}>{user.userName}</span></Pop>}
            {index !== item.mentionedUsers.length - 1 && '、'}
          </React.Fragment>
        )),
    },
    {
      title: '可见范围',
      width: 126,
      name: 'visibility',
      bodyRender: (item) => visibilityEnum[item.visibility],
    },
    {
      title: '操作',
      textAlign: 'right',
      fixed: 'right',
      width: 216,
      bodyRender: (item) => {
        const rootKdtId = isEduBranchStore && item.senderRole === 0 && _global.shopInfo.rootKdtId;
        return (
          <Operations
            items={[
              <ReplyDialog
                key="reply"
                postId={item.postId}
                currentUser={item.senderName}
                commentNum={item.commentNum}
                senderId={item.senderId}
                senderRole={item.senderRole}
                kdtId={item.kdtId}
              />,
              <SamLink
                key="modify"
                disabled={notFromCurrentBranch(item)}
                name="家校圈修改动态"
                onClick={() => openMomonetDialog(item)}
              >
                修改
              </SamLink>,
              <Pop
                key="delete"
                trigger="click"
                content="确定删除吗？"
                onConfirm={() => deleteMoments({
                  command: {
                    kdtId: item.kdtId,
                    postId: item.postId,
                  },
                  rootKdtId,
                }).then(() => {
                  Notify.success('删除成功');
                  if (filterRef.current) {
                    filterRef.current.reset();
                  }
                }).catch(err => Notify.error(err))}
                confirmText="确定"
                position="top-right"
              >
                <SamLink
                  disabled={notFromCurrentBranch(item)}
                  name="家校圈修改动态"
                  href="javascript:void(0);"
                >
                  删除
                </SamLink>
              </Pop>,
            ]}
          />
        );
      },
    },
  ], [forceUpdateId]);

  const fetchData = useCallback(({
    page, dateRange = [], senderRole = 9, sortType = 'desc', // sortBy = 'createdAt',
  }) => {
    if (page >= 166) {
      return Promise.reject('最多可查询3300条记录，建议使用筛选功能缩小查询范围');
    }
    const query: any = {
      pageRequest: {
        pageSize: 20,
        pageNumber: page,
        sort: {
          orders: [{
            property: 'created_at',
            direction: (sortType || 'desc').toUpperCase(),
          }],
        },
      },
      senderRole,
    };

    if (dateRange[0]) query.startDate = dateRange[0];
    if (dateRange[1]) query.endDate = dateRange[1];

    return findPosts(query).then(({ pageable, content, total }) => ({
      pageInfo: {
        page: pageable.pageNumber,
        pageSize: pageable.pageSize,
        total,
      },
      dataset: content,
    }));
  }, []);
  return (
    <div className="moments-management">
      <SamButton
        type="primary"
        name="家校圈发布动态"
        style={{ marginBottom: 16, width: 90 }}
        onClick={() => openMomonetDialog()}
      >
        发动态
      </SamButton>
      <List mode="hash" onSubmit={fetchData}>
        <Filter
          ref={filterRef}
          config={filterConfig}
          renderActions={({ filter }) => (
            <Button style={{ width: 80 }} type="primary" onClick={() => filter.submit()}>筛选</Button>
          )}
        />
        <EasyGrid scroll={{ x: 1000 }} columns={columns} rowKey="postId" />
      </List>
    </div>
  );
};
