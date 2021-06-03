import { React, useState, useEffect, useCallback, useMemo, createModel } from '@youzan/tany-react';
import { ClampLines } from 'zent';
import { Select } from '@youzan/ebiz-components';
import { Operations } from '@youzan/react-components';
import { Link as SamLink } from '@youzan/sam-components';
import { isEduChainStore } from '@youzan/utils-shop';
import CommonLink from 'components/common-link';

import AssignmentService from 'domain/assignment-domain/services';
import HomeworkService from 'domain/homework-domain/services';
import StaffService from 'domain/staff-domain/services';
import WorkbookService from 'domain/workbook-domain/services';
import { useHomeworkRouterModel } from '../../../router';
import WorkbookStudentInfo from '../../../../components/workbook-student-info';

import { ICustomConfType, IEasyGridColumn } from '@youzan/ebiz-components/es/types/easy-list';
import {
  IHomeworkAssignmentListDTO,
  WorkbookStudentStatus,
} from 'domain/assignment-domain/types/assignment';
import { IHomeworkAssignmentListQuery } from '../types';
import { IExerciseBookRelTeacherDTO } from 'definitions/api/owl/pc/ExerciseBookFacade/getExerciseBookDetail';

const { onFetchHomeworkStudentAssignmentList } = AssignmentService;

const { onFetchHomeworkData } = HomeworkService;

const { fetchSingleShopStaffList, fetchChainStaffList } = StaffService;

const { getWorkbookDetail } = WorkbookService;

const AssignmentListModel = () => {
  const { route } = useHomeworkRouterModel();
  const pageQuery = route?.query || {};

  const { id: homeworkId } = route?.params || {};

  const workbookId = pageQuery?.workbookId;

  const [homeworkTitle, setHomeworkTitle] = useState('加载中...');
  const [workbookTeacherList, setTeacherList] = useState<IExerciseBookRelTeacherDTO[]>([]);
  const [isFilterEmpty, toggleIsFilterEmpty] = useState(true);
  const [workbookKdtId, setWorkbookKdtId] = useState<number>();

  const isAuthorized = useMemo(
    () => workbookTeacherList?.map((teacher) => teacher.teacherId)?.includes(_global.userId),
    [workbookTeacherList],
  );

  useEffect(() => {
    Promise.all([
      getWorkbookDetail({ id: Number(workbookId) }),
      onFetchHomeworkData({ homeworkId: Number(homeworkId) }),
    ]).then(([workbook, homework]) => {
      if (workbook) {
        setTeacherList(workbook?.teacherList);
        setWorkbookKdtId(workbook.kdtId);
      }
      if (homework) {
        setHomeworkTitle(homework?.title || '');
      }
    });
  }, [homeworkId, workbookId]);

  const homeworkSortParamMap = {
    submitTime: 'submit_time',
    score: 'score',
  };

  const onGetHomeworkAssignmentList = useCallback(
    (query: IHomeworkAssignmentListQuery) => {
      const { pageSize, page, sortBy, sortType, reviewerId: reviewer, studentName, status = 0 } = query;

      const reviewerId = reviewer && reviewer?.[0]; // ebiz-select结果为list,
      if (Number(page) === 1 && !reviewerId && !studentName) {
        toggleIsFilterEmpty(true);
      } else {
        toggleIsFilterEmpty(false);
      }

      return onFetchHomeworkStudentAssignmentList({
        query: {
          workbookId: Number(workbookId),
          homeworkId: Number(homeworkId),
          reviewerId,
          studentName,
          status: status ?? 0,
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
                    property: homeworkSortParamMap[sortBy],
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
    [homeworkId, workbookId, homeworkSortParamMap],
  );

  const fetchReviewerList = useCallback((query, pageRequest) => {
    const fetch = isEduChainStore ? fetchChainStaffList : fetchSingleShopStaffList;

    return fetch({
      keyword: query,
      pageNo: pageRequest?.current || 1,
      pageSize: pageRequest?.pageSize || 20,
    }).then((res) => {
      const { items = [], paginator = {} } = res;

      const options = items.map((item) => ({
        text: `${item?.name}(${item?.linkPhone})`,
        value: String(item.adminId),
      }));
      options.unshift({
        text: '全部批阅人',
        value: '',
      });
      const pageInfo = {
        current: paginator.page || 1,
        total: paginator.totalCount,
      };
      return {
        options,
        pageInfo,
      };
    });
  }, []);

  const reviewerConfig: ICustomConfType = {
    name: 'reviewerId',
    type: 'Custom',
    renderField: Select,
    defaultValue: [''],
    inheritProps: {
      width: 182,
      autoWidth: true,
      defaultOptions: [{ text: '全部批阅人', value: '' }],
      filter: true,
      mode: 'async',
      fetchOnOpened: true,
      fetchOptions: fetchReviewerList,
    },
  };

  const homeworkAssignmentListColumn: IEasyGridColumn<IHomeworkAssignmentListDTO>[] = [
    {
      title: '学员',
      fixed: 'left',
      width: 200,
      bodyRender: (data) => (
        <WorkbookStudentInfo
          name={data?.studentName}
          link={data?.detailLink}
          mobile={data?.studentMobile}
          avatar={data?.studentAvatar}
          hasLeft={data?.hasQuit === WorkbookStudentStatus.QUIT}
        />
      ),
    },
    {
      title: '提交时间',
      name: 'submitTime',
      needSort: true,
      width: 120,
    },
    {
      title: '成绩',
      name: 'score',
      needSort: true,
      width: 120,
      bodyRender: ({ score }) => {
        return score || '-';
      },
    },
    {
      title: '优秀作业',
      name: 'assignmentRateText',
      width: 120,
    },
    {
      title: '状态',
      name: 'statusText',
      width: 120,
    },
    {
      title: '批阅人',
      width: 128,
      bodyRender: (data: IHomeworkAssignmentListDTO) =>
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
      bodyRender: (data: IHomeworkAssignmentListDTO) => (
        <Operations
          items={[
            workbookKdtId !== _global.kdtId ? (
              <span className="disabled">{data?.operationText}</span>
            ) : isAuthorized
              ? <CommonLink key="toCorrectPage" target="_blank" href={data?.operationLink}>
                {data?.operationText}
              </CommonLink>
              : <SamLink name="编辑" href={data?.operationLink}>
                {data?.operationText}
              </SamLink>,
          ]}
        />
      ),
    },
  ];

  return {
    workbookId,
    onGetHomeworkAssignmentList,
    homeworkTitle,
    reviewerConfig,
    homeworkAssignmentListColumn,
    isFilterEmpty,
  };
};

export default createModel(AssignmentListModel);
