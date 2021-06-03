import { React, useState, useMemo, useCallback, useRef, createModel } from '@youzan/tany-react';
import { Notify, ClampLines } from 'zent';
import { ArthurContainer } from '@youzan/arthur-scheduler-react';
import { IListContext } from '@youzan/ebiz-components/es/types/easy-list';
import type { IEasyGridColumn } from '@youzan/ebiz-components/es/types/easy-list';
import { Link as SamLink } from '@youzan/sam-components';
import CommonLink from 'components/common-link';
import EmptyListWrapper from 'components/empty-list-wrapper';
import useWorkbookSummaryModel from './workbook-summary';
import HomeworkListOption from '../components/homework-list-operations';

import HomeworkService from 'domain/homework-domain/services';
import { IHomeworkListDTO } from 'domain/homework-domain/types/homework';
import { useWorkbookRouterModel } from '../../../router';
import { workbookHomeworkListSortByMap } from '../constants';

import { IHomeworkListQuery } from '../types';

const { onFetchHomeworkList, deleteHomework } = HomeworkService;

const HomeworkListModel = () => {
  const { workbookTeacherIdList } = useWorkbookSummaryModel();

  const listRef = useRef<IListContext>(null);

  const [isFilterEmpty, toggleIsFilterEmpty] = useState(true);

  const refreshList = useCallback(() => listRef.current && listRef.current.action.refresh(), []);

  const { route } = useWorkbookRouterModel();

  const { id: workbookId } = route?.params || {};

  const homeworkCreateLink = useMemo(
    () => `/v4/vis/supv/homework/work/add?workbookId=${workbookId}`,
    [workbookId],
  );

  // @ts-ignore
  const userIsWorkbookTeacher = useMemo(() => workbookTeacherIdList.includes(_global.userId), [
    workbookTeacherIdList,
  ]);

  const handleFetchWorkbookList = useCallback(
    (query: IHomeworkListQuery) => {
      const { page, pageSize, sortBy, sortType, title } = query;

      if (Number(page) === 1 && !title) {
        toggleIsFilterEmpty(true);
      } else {
        toggleIsFilterEmpty(false);
      };

      const id = Number(workbookId);
      if (id) {
        return onFetchHomeworkList({
          query: {
            title,
            exerciseBookId: id,
          },
          pageRequest: {
            pageNumber: page,
            pageSize,
            sort: {
              orders:
                sortBy && sortType
                  ? [
                    {
                      direction: sortType.toUpperCase(),
                      property: workbookHomeworkListSortByMap?.[sortBy],
                    },
                  ]
                  : [
                    {
                      direction: 'DESC',
                      property: workbookHomeworkListSortByMap.publishTime,
                    },
                  ],
            },
          },
        });
      }
    },
    [workbookId],
  );

  const handleDelete = useCallback(
    (id: number) => {
      return deleteHomework({ id })
        .then(refreshList)
        .catch((e) => {
          Notify.error(e || '删除作业失败，请稍后重试');
        });
    },
    [refreshList],
  );

  const homeworkColumns: IEasyGridColumn<IHomeworkListDTO>[] = useMemo(
    () => [
      {
        title: '作业名称',
        name: 'title',
        fixed: 'left',
        width: 200,
        bodyRender: (data) => <ClampLines lines={2} text={data.title || '-'} />,
      },
      {
        title: '发布时间',
        name: 'publishTime',
        needSort: true,
        width: 112,
      },
      {
        title: '截止时间',
        name: 'deadlineTime',
        needSort: true,
        width: 112,
      },
      {
        title: '提交作业数',
        name: 'submitNum',
        needSort: true,
        width: 112,
      },
      {
        title: '作业提交率',
        name: 'submitRatio',
        needSort: true,
        width: 112,
      },
      {
        title: '待批阅',
        name: 'awaitMarkingNum',
        needSort: true,
        width: 96,
      },
      {
        title: '操作',
        fixed: 'right',
        textAlign: 'right',
        bodyRender: (data) => (
          <HomeworkListOption
            data={data}
            handleDelete={handleDelete}
            isTeacher={userIsWorkbookTeacher}
            workbookId={workbookId}
          />
        ),
      },
    ],
    [handleDelete, userIsWorkbookTeacher, workbookId],
  );

  const emptyLabel = useMemo(
    () => (
      <EmptyListWrapper>
        {isFilterEmpty ? (
          <>
            暂无作业
            <ArthurContainer name="createHomework" namespace="督学互动">
              ，
              {userIsWorkbookTeacher ? (
                <CommonLink url={homeworkCreateLink}>
                  去布置
                </CommonLink>
              ) : (
                <SamLink name="编辑" href={homeworkCreateLink}>
                  去布置
                </SamLink>
              )}
            </ArthurContainer>
          </>
        ) : (
          '没有更多数据了'
        )}
      </EmptyListWrapper>
    ),
    [homeworkCreateLink, isFilterEmpty, userIsWorkbookTeacher],
  );

  return {
    handleDelete,
    handleFetchWorkbookList,
    homeworkColumns,
    emptyLabel,
    listRef,
    homeworkCreateLink,
  };
};

export default createModel(HomeworkListModel);
