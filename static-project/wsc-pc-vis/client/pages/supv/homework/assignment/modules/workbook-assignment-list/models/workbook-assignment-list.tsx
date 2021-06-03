import { React, useState, useEffect, useRef, useCallback, createModel } from '@youzan/tany-react';
import { ClampLines } from 'zent';
import { Select } from '@youzan/ebiz-components';
import { Operations } from '@youzan/react-components';
import { Link as SamLink } from '@youzan/sam-components';
import { isEduChainStore } from '@youzan/utils-shop';
import CommonLink from 'components/common-link';

import AssignmentService from 'domain/assignment-domain/services';
import StaffService from 'domain/staff-domain/services';
import WorkbookService from 'domain/workbook-domain/services';
import { useAssignmentRouterModel } from '../../../router';
import { workbookStuAssignmentSortByMap } from '../../../constants';
import { superDecoder } from '../../../../utils';

import {
  ICombinedFilterConf,
  IEasyGridColumn,
  IListContext,
} from '@youzan/ebiz-components/es/types/easy-list';
import { IWorkbookAssignmentListDTO } from 'domain/assignment-domain/types/assignment';
import { GoodAssignmentFilterStatus, IWorkbookAssignmentListQuery } from '../types';
import { timespanParser } from 'pages/supv/homework/utils';

const { onFetchWorkbookStudentAssignmentList } = AssignmentService;

const { fetchSingleShopStaffList, fetchChainStaffList } = StaffService;

const { getWorkbookDetail } = WorkbookService;

const AssignmentListModel = () => {
  const { route } = useAssignmentRouterModel();

  const { workbookId, studentId, studentName } = route?.query || {};

  const listRef = useRef<IListContext>(null);

  const [isFilterEmpty, toggleIsFilterEmpty] = useState(true);

  const userName = superDecoder(studentName);

  const [isAuthorized, toggleIsAuthorized] = useState(false);

  const [workbookKdtId, setWorkbookKdtId] = useState<number>();

  useEffect(() => {
    if (workbookId) {
      getWorkbookDetail({ id: Number(workbookId) }).then((res) => {
        if (res) {
          toggleIsAuthorized(!!res.teacherList?.map((t) => t.teacherId)?.includes(_global.userId));
          setWorkbookKdtId(res.kdtId);
        }
      });
    }
  }, [workbookId]);

  const onGetWorkbookAssignmentList = useCallback(
    (query: IWorkbookAssignmentListQuery) => {
      const {
        page,
        pageSize,
        sortBy,
        sortType,
        reviewerId: reviewer,
        isGoodAssignment,
        status,
        title,
        publishTimeRange,
        submitTimeRange,
      } = query;

      const reviewerId = reviewer && reviewer?.[0]; // ebiz-select结果为list

      const [publishStartTime, publishEndTime] = publishTimeRange?.[0] || [null, null];
      const [submitStartTime, submitEndTime] = submitTimeRange?.[0] || [null, null];

      if (
        Number(page) === 1 &&
        !reviewerId &&
        !isGoodAssignment &&
        !title &&
        !publishStartTime &&
        !publishEndTime &&
        !submitStartTime &&
        !submitEndTime
      ) {
        toggleIsFilterEmpty(true);
      } else {
        toggleIsFilterEmpty(false);
      }

      return onFetchWorkbookStudentAssignmentList({
        query: {
          studentId: Number(studentId),
          reviewerId,
          workbookId: Number(workbookId),
          isGoodAssignment,
          status: status ?? 0,
          title,
          publishTimeRange: timespanParser([publishStartTime, publishEndTime]),
          submitTimeRange: timespanParser([submitStartTime, submitEndTime]),
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
                    property: workbookStuAssignmentSortByMap[sortBy],
                  },
                ]
                : [
                  {
                    direction: 'DESC',
                    property: 'submit_time',
                  },
                ],
          },
        },
      });
    },
    [workbookId, studentId],
  );

  const fetchStaffList = useCallback((query, pageRequest) => {
    const fetch = isEduChainStore ? fetchChainStaffList : fetchSingleShopStaffList;

    return fetch({
      keyword: query,
      pageNo: pageRequest?.current || 1,
      pageSize: pageRequest?.pageSize || 20,
    }).then((res) => {
      const { items = [], paginator = {} } = res || {};
      const options = items.map((item) => ({
        text: `${item?.name}(${item?.linkPhone})`,
        value: String(item.adminId),
      }));
      options.unshift({
        text: '全部批阅人',
        value: null,
      });
      const pageInfo = {
        current: paginator.page || 1,
        pageSize: paginator?.pageSize || 20,
        total: paginator.totalCount,
      };
      return {
        options,
        pageInfo,
      };
    });
  }, []);

  const config: ICombinedFilterConf[] = [
    {
      name: 'publishTimeRange',
      label: '作业发布时间：',
      type: 'DateRangeQuickPicker',
      inheritProps: {
        width: 180,
      },
    },
    {
      name: 'submitTimeRange',
      label: '作业提交时间：',
      type: 'DateRangeQuickPicker',
      inheritProps: {
        width: 180,
      },
    },
    {
      name: 'title',
      label: '作业名称：',
      type: 'Input',
    },
    {
      name: 'reviewerId',
      type: 'Custom',
      label: '批阅人：',
      renderField: Select,
      defaultValue: [''],
      inheritProps: {
        width: 182,
        autoWidth: true,
        defaultOptions: [{ text: '全部批阅人', value: '' }],
        filter: true,
        mode: 'async',
        fetchOnOpened: true,
        fetchOptions: fetchStaffList,
      },
    },
    {
      name: 'isGoodAssignment',
      label: '优秀作业：',
      type: 'Select',
      options: [
        {
          text: '全部',
          value: GoodAssignmentFilterStatus.ALL,
        },
        {
          text: '是',
          value: GoodAssignmentFilterStatus.GOOD_ONES,
        },
        {
          text: '否',
          value: GoodAssignmentFilterStatus.NORMAL_ONES,
        },
      ],
      defaultValue: GoodAssignmentFilterStatus.ALL,
    },
  ];

  const workbookAssignmentListColumn: IEasyGridColumn<IWorkbookAssignmentListDTO>[] = [
    {
      title: '作业名称',
      fixed: 'left',
      width: 200,
      bodyRender: ({ title }) => <ClampLines lines={2} text={title} />,
    },
    {
      title: '发布时间',
      name: 'publishTime',
      needSort: true,
      width: 112,
    },
    {
      title: '提交时间',
      name: 'submitTime',
      needSort: true,
      width: 112,
    },
    {
      title: '作业成绩',
      width: 96,
      bodyRender: ({ score }) => {
        return score || '-';
      },
    },
    {
      title: '是否优秀作业',
      name: 'assignmentRateText',
      width: 112,
    },
    {
      title: '状态',
      name: 'statusText',
      width: 120,
    },
    {
      title: '批阅人',
      width: 128,
      bodyRender: (data: IWorkbookAssignmentListDTO) =>
        data?.reviewerUsername && data?.reviewerMobile ? (
          <div>
            <ClampLines lines={1} text={data.reviewerUsername} />
            <ClampLines lines={1} text={data.reviewerMobile} />
          </div>
        ) : (
          '-'
        ),
    },
    {
      title: '操作',
      fixed: 'right',
      textAlign: 'right',
      bodyRender: (data: IWorkbookAssignmentListDTO) => (
        <Operations
          items={[
            workbookKdtId !== _global.kdtId ? (
              <span className="disabled">{data?.operationText}</span>
            ) : isAuthorized ? (
              <CommonLink key="toCorrectPage" target="_blank" url={data?.operationLink}>
                {data?.operationText}
              </CommonLink>
            ) : (
              <SamLink name="编辑" href={data?.operationLink}>
                {data?.operationText}
              </SamLink>
            ),
          ]}
        />
      ),
    },
  ];

  return {
    workbookId,
    studentId,
    userName,
    listRef,
    onGetWorkbookAssignmentList,
    config,
    workbookAssignmentListColumn,
    isFilterEmpty,
  };
};

export type AssignmentListModelType = ReturnType<typeof AssignmentListModel>;
export default createModel(AssignmentListModel);
