import { React, useState, useMemo, useCallback, useRef, createModel } from '@youzan/tany-react';
import EmptyListWrapper from 'components/empty-list-wrapper';
import ListOperations from '../components/student-list-operations';
import WorkbookStudentInfo from '../../../../components/workbook-student-info';
import WorkbookStudentService from 'domain/student-domain/services';
import WorkbookService from 'domain/workbook-domain/services';
import { useWorkbookRouterModel } from '../../../router';
import useWorkbookSummaryModel from './workbook-summary';
import { timespanParser } from 'pages/supv/homework/utils';

import type {
  IEasyGridColumn,
  ICombinedFilterConf,
  IListContext,
  IRenderPropsType,
} from '@youzan/ebiz-components/es/types/easy-list';
import { workbookStuListSortByMap } from '../constants';
import type { IWorkbookStudentListFilter } from '../types';
import type { IWorkbookStudentList } from 'domain/student-domain/types/homework-student';
import { WorkbookStudentStatus } from 'domain/assignment-domain/types/assignment';
import { IExerciseStudentPageQuery } from 'definitions/api/owl/pc/ExerciseBookStatisticsFacade/findStudentPageByCondition';

const { onGetWorkbookStudentList } = WorkbookStudentService;

const { exportWorkbookStudentData } = WorkbookService;

const StudentListModel = () => {
  const { route } = useWorkbookRouterModel();
  const { summaryData } = useWorkbookSummaryModel();
  const { id: workbookId } = route?.params || {};

  const workbookKdtId = useMemo(() => summaryData.kdtId, [summaryData.kdtId]);
  const homeworkNum = useMemo(() => summaryData.assignmentNum ?? 0, [summaryData.assignmentNum]);

  const listRef = useRef<IListContext>(null);
  const filterRef = useRef<IRenderPropsType>(null);

  const [isFilterEmpty, toggleIsFilterEmpty] = useState(true);

  const fetchWorkbookStudentList = useCallback(
    (query: IWorkbookStudentListFilter) => {
      const { pageSize, page, sortBy, sortType, joinTime, name } = query;
      const [startTime, endTime] = joinTime?.[0] || [null, null];

      if (Number(page) === 1 && !name && !startTime && !endTime) {
        toggleIsFilterEmpty(true);
      } else {
        toggleIsFilterEmpty(false);
      };

      const adaptedQuery: IExerciseStudentPageQuery = {
        bookId: Number(workbookId),
      };
      adaptedQuery['joinTime'] = timespanParser([startTime, endTime]);

      if (name) {
        adaptedQuery['studentName'] = name;
      }

      return onGetWorkbookStudentList({
        query: adaptedQuery,
        pageRequest: {
          pageSize,
          pageNumber: page,
          sort: {
            orders:
              sortBy && sortType
                ? [
                  {
                    direction: sortType.toUpperCase(),
                    property: workbookStuListSortByMap[sortBy],
                  },
                ]
                : [
                  {
                    direction: 'DESC',
                    property: 'created_at',
                  },
                ],
          },
        },
      });
    },
    [workbookId],
  );

  const filterConfig: ICombinedFilterConf[] = [
    {
      name: 'joinTime',
      label: '加入时间：',
      type: 'DateRangeQuickPicker',
      inheritProps: {
        width: 180,
      },
    },
    {
      name: 'name',
      label: '学员姓名：',
      type: 'Input',
    },
  ];

  const columns: IEasyGridColumn<IWorkbookStudentList>[] = useMemo(
    () => [
      {
        title: '学员',
        fixed: 'left',
        width: 200,
        bodyRender: (data) => (
          <WorkbookStudentInfo
            name={data?.name}
            link={data?.detailLink}
            mobile={data?.mobile}
            avatar={data?.avatar}
            hasLeft={data?.hasLeft === WorkbookStudentStatus.QUIT}
          />
        ),
      },
      {
        title: '加入时间',
        name: 'joinTime',
        needSort: true,
        width: 188,
      },
      {
        name: 'completedAssignmentNum',
        title: '提交作业数',
        needSort: true,
        width: 120,
        bodyRender: ({ completedAssignmentNum }) => (
          <span>{`${completedAssignmentNum}/${homeworkNum}`}</span>
        ),
      },
      {
        name: 'goodAssignmentNum',
        title: '优秀作业数',
        needSort: true,
        width: 120,
      },
      {
        title: '待批阅作业数',
        name: 'awaitMarkingNum',
        needSort: true,
        width: 130,
      },
      {
        title: '操作',
        fixed: 'right',
        textAlign: 'right',
        bodyRender: ({ enrollmentInfo, assignmentListLink }) => (
          <ListOperations enrollmentInfo={enrollmentInfo} assignmentListLink={assignmentListLink} />
        ),
      },
    ],
    [homeworkNum],
  );

  const emptyLabel = useMemo(() => {
    return (
      <EmptyListWrapper>
        {isFilterEmpty ? <span>暂无数据</span> : '没有更多数据了'}
      </EmptyListWrapper>
    );
  }, [isFilterEmpty]);

  const handleWorkbookStudentExport = useCallback(
    (filter) => {
      const { joinTime, name } = filter.getCurrentValues();
      const [startTime, endTime] = joinTime?.[0] || [null, null];

      const adaptedQuery: Record<string, any> = { studentName: name, bookId: Number(workbookId) };
      adaptedQuery['joinTime'] = timespanParser([startTime, endTime]);

      return exportWorkbookStudentData({
        query: adaptedQuery,
      });
    },
    [workbookId],
  );

  return {
    filterConfig,
    columns,
    listRef,
    filterRef,
    fetchWorkbookStudentList,
    emptyLabel,
    handleWorkbookStudentExport,
    workbookKdtId,
  };
};

export type AssignmentListModelType = ReturnType<typeof StudentListModel>;
export default createModel(StudentListModel);
