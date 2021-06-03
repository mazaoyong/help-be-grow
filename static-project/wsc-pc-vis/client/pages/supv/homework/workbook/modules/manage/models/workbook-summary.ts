import { useState, useEffect, useCallback, createModel, useMemo } from '@youzan/tany-react';
import { Notify } from 'zent';
import WorkbookService from 'domain/workbook-domain/services';
import { useWorkbookRouterModel, workbookListRoute, workbookManageRoute } from '../../../router';
import { WorkbookManageViewType, defaultSummaryData } from '../../../constants';

import { IWorkbookSummaryData } from 'domain/workbook-domain/types';

const { onGetWorkbookSummary, getWorkbookDetail } = WorkbookService;

const WorkbookSummaryModel = () => {
  const { route } = useWorkbookRouterModel();

  const { id: workbookId, viewType: routeViewType } = route?.params || {};

  const [summaryData, setSummaryData] = useState<IWorkbookSummaryData>(defaultSummaryData);

  const [viewType, toggleViewType] = useState<WorkbookManageViewType>(WorkbookManageViewType.HOMEWORKS);

  const [workbookTeacherIdList, setWorkbookTeacherIdList] = useState<number[] | []>([]);

  const isAuthorizedTeacher = useMemo(() => {
    // @ts-ignore
    return workbookTeacherIdList.includes(_global.userId);
  }, [workbookTeacherIdList]);

  useEffect(() => {
    const id = Number(workbookId);

    if (id) {
      onGetWorkbookSummary({ exerciseBookId: id })
        .then(summary => {
          if (summary) {
            setSummaryData(summary);
          }
        })
        .catch(e => {
          setSummaryData({ ...defaultSummaryData, title: '' });
          Notify.error(e || '获取作业本概览数据失败，请稍后重试');
        });

      getWorkbookDetail({ id })
        .then((detail) => {
          if (detail) {
            setWorkbookTeacherIdList(detail?.teacherList?.map(teacher => teacher?.teacherId) || []);
          }
        })
        .catch(e => {
          Notify.error(e || '获取作业本详情失败，请稍后重试');
        });
    } else {
      workbookListRoute.push();
    }
  }, [workbookId]);

  useEffect(() => {
    switch (routeViewType) {
      case WorkbookManageViewType.STUDENTS:
        toggleViewType(WorkbookManageViewType.STUDENTS);
        break;
      case WorkbookManageViewType.HOMEWORKS:
      default:
        toggleViewType(WorkbookManageViewType.HOMEWORKS);
    }
  }, [routeViewType]);

  const onViewTypeChange = useCallback((tabViewType: WorkbookManageViewType) => {
    if (
      tabViewType === WorkbookManageViewType.STUDENTS ||
      tabViewType === WorkbookManageViewType.HOMEWORKS
    ) {
      workbookManageRoute.replace({
        params: {
          id: workbookId,
          viewType: tabViewType,
        },
      });
    }
  }, [workbookId]);

  return {
    workbookId,
    viewType,
    onViewTypeChange,
    summaryData,
    workbookTeacherIdList,
    isAuthorizedTeacher,
  };
};

export default createModel(WorkbookSummaryModel);
