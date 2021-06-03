import { Pop } from '@zent/compat';
import { React, useState, useEffect, useMemo, useCallback, useRef, useContext, createModel } from '@youzan/tany-react';
import { ClampLines, Notify } from 'zent';
import { Link as SamLink } from '@youzan/sam-components';
import { ArthurContainer, ArthurDecorator } from '@youzan/arthur-scheduler-react';
import { isEduHqStore } from '@youzan/utils-shop';
import isNil from 'lodash/isNil';

import { CampusContext } from '../components/campus-filter';
import EmptyListWrapper from 'components/empty-list-wrapper';
import ListOperations from '../components/list-operations';
import WorkbookService from 'domain/workbook-domain/services';
import { instockStatusMap, workbookListSortMap, workbookStockOperationMap } from '../../../constants';
import { workbookCreateRoute } from '../../../router';
import { timespanParser } from 'pages/supv/homework/utils';

import {
  IWorkbookListData,
  workbookPublishStatus,
  instockStatusFilterType,
} from 'domain/workbook-domain/types';
import type {
  IEasyGridColumn,
  ICombinedFilterConf,
  IListContext,
  IRenderPropsType,
} from '@youzan/ebiz-components/es/types/easy-list';
import type { IWorkbookListFilter } from '../types';

const { onFetchWorkbookList, changeWorkbookStockStatus, deleteWorkbook } = WorkbookService;

const WorkbookListModel = () => {
  const listRef = useRef<IListContext>(null);
  const filterRef = useRef<IRenderPropsType>(null);

  const [isFilterEmpty, toggleIsFilterEmpty] = useState(true);

  const { targetKdtId } = useContext(CampusContext);

  const refreshList = useCallback(() => listRef.current && listRef.current.action.refresh(), []);

  useEffect(() => {
    if (isEduHqStore) {
      refreshList();
    }
  }, [refreshList, targetKdtId]);

  const handleFetchWorkbookList = useCallback((query: IWorkbookListFilter) => {
    const { page, pageSize, sortBy, sortType, createAtDateRange, title, status, ...rest } = query;
    const [startTime, endTime] = createAtDateRange?.[0] || [null, null];

    if (Number(page) === 1 && !title && !status && !startTime && !endTime) {
      toggleIsFilterEmpty(true);
    } else {
      toggleIsFilterEmpty(false);
    };

    const adaptedQuery: Record<string, any> = { page, pageSize, title, status, ...rest };

    if (isEduHqStore) {
      adaptedQuery['targetKdtId'] = targetKdtId;
    }

    adaptedQuery['createAtDateRange'] = timespanParser([startTime, endTime]);

    if (!title) {
      delete adaptedQuery.title;
    }
    if (!status || status === String(instockStatusFilterType.all)) {
      delete adaptedQuery.status;
    }

    return onFetchWorkbookList({
      query: adaptedQuery,
      pageRequest: {
        pageNumber: page,
        pageSize,
        sort: {
          orders:
            sortBy && sortType
              ? [
                {
                  direction: sortType.toUpperCase(),
                  property: workbookListSortMap?.[sortBy],
                },
              ]
              : [
                {
                  direction: 'DESC',
                  property: workbookListSortMap.createdAt,
                },
              ],
        },
      },
    });
  }, [targetKdtId]);

  const handleSwitch = useCallback(
    (id: number, type: workbookPublishStatus) => {
      const status =
        type === workbookPublishStatus.inStock
          ? workbookPublishStatus.offStock
          : workbookPublishStatus.inStock;
      return changeWorkbookStockStatus({ id, status })
        .then(() => Notify.success(`作业本${workbookStockOperationMap[type]}成功`))
        .then(refreshList)
        .catch((e) => {
          Notify.error(e || `${workbookStockOperationMap[type]}作业本失败，请稍后重试`);
        });
    },
    [refreshList],
  );

  const handleDelete = useCallback(
    (id: number) => {
      return deleteWorkbook({ id })
        .then(() => Notify.success('作业本删除成功'))
        .then(refreshList)
        .catch((e) => {
          Notify.error(e || '删除作业本失败，请稍后重试');
        });
    },
    [refreshList],
  );

  const filterConfig: ICombinedFilterConf[] = [
    {
      name: 'createAtDateRange',
      label: '创建时间：',
      type: 'DateRangeQuickPicker',
      inheritProps: {
        width: 180,
      },
    },
    {
      name: 'title',
      label: '作业本名称：',
      type: 'Input',
    },
    {
      name: 'status',
      label: '上架状态：',
      type: 'Select',
      options: [
        {
          text: instockStatusMap[instockStatusFilterType.all],
          value: String(instockStatusFilterType.all),
        },
        {
          text: instockStatusMap[instockStatusFilterType.inStock],
          value: String(instockStatusFilterType.inStock),
        },
        {
          text: instockStatusMap[instockStatusFilterType.outOfStock],
          value: String(instockStatusFilterType.outOfStock),
        },
      ],
      inheritProps: {
        width: 180,
      },
      defaultValue: String(instockStatusFilterType.all),
    },
  ];

  const columns: IEasyGridColumn<IWorkbookListData>[] = useMemo(
    () => [
      {
        title: '作业本名称',
        name: 'title',
        fixed: 'left',
        width: 203,
        bodyRender: (data) => <ClampLines lines={2} text={data.title || '-'} />,
      },
      {
        title: '作业数',
        name: 'assignmentNum',
        needSort: true,
        width: 80,
        bodyRender: ({ assignmentNum }) => assignmentNum ?? '-',
      },
      {
        title: '学员数',
        name: 'joinStudentNum',
        needSort: true,
        width: 80,
        bodyRender: ({ joinStudentNum }) => joinStudentNum ?? '-',
      },
      {
        title: '老师',
        name: 'teacherList',
        width: 100,
        bodyRender: ({ teacherList }) => {
          const teacherListDetail = teacherList?.map((item, index) => (
            <p key={`teacher-${index}`}>{`• ${item?.name}`}</p>
          ));
          const teacherNameList = teacherList?.map((item) => item?.name);
          return (
            teacherList && teacherList.length > 0
              ? <Pop trigger="hover" wrapperClassName="teacher-list" content={teacherListDetail || '-'}>
                <span className="ellipsis-2">{teacherNameList?.join('，') || '-'}</span>
              </Pop>
              : '-'
          );
        },
      },
      {
        title: '上架状态',
        name: 'status',
        bodyRender: ({ status }) => (!isNil(status) && instockStatusMap[status]) || '-',
      },
      {
        title: '创建时间',
        name: 'createdAt',
        needSort: true,
      },
      {
        title: '操作',
        fixed: 'right',
        textAlign: 'right',
        bodyRender: (data) => (
          <ArthurContainer name="editHomework" namespace="督学互动" preventDefault>
            <ArthurDecorator preventDefault>
              {(model) => (
                <ListOperations
                  data={data}
                  handleDelete={handleDelete}
                  handleSwitch={handleSwitch}
                  hasAttendance={~~data.submitStudentNum > 0}
                  studentNum={data.joinStudentNum ?? 0}
                  arthurModel={model}
                />
              )}
            </ArthurDecorator>
          </ArthurContainer>
        ),
      },
    ],
    [handleDelete, handleSwitch],
  );

  const emptyLabel = useMemo(() => (
    <EmptyListWrapper>
      {isFilterEmpty ? (
        <>
          暂无作业本
          <ArthurContainer name="createHomework" namespace="督学互动">
            ，
            <SamLink
              name="编辑"
              type="primary"
              onClick={() => workbookCreateRoute.push()}
            >
              去新建
            </SamLink>
          </ArthurContainer>
        </>
      ) : (
        '没有更多数据了'
      )}
    </EmptyListWrapper>
  ), [isFilterEmpty]);

  return {
    isEduHqStore,
    handleSwitch,
    handleDelete,
    handleFetchWorkbookList,
    filterConfig,
    columns,
    emptyLabel,
    listRef,
    filterRef,
  };
};

export type AssignmentListModelType = ReturnType<typeof WorkbookListModel>;
export default createModel(WorkbookListModel);
