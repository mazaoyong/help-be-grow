import React, { FC, useMemo } from 'react';
import VisList, { VisFilterTable } from 'components/vis-list';
import { courseColumns, courseOptions, defaultCourseOptions } from './course-coulmns';
import { Button as SamButton, Notify } from 'zent';
import { getExportRecordUrl, EXPORT_RECORD_TYPES } from '@ability-center/ump/export-record';
import { IListDataSets, TTeacherDetailParams, ICourseFilter } from '../interface';
import { queryCourseList, exportCourseList } from '../../../api/teachers';
import './index.scss';

const Courselist: FC<TTeacherDetailParams> = (props) => {
  const getQuery: ((iProps: Partial<ICourseFilter>)=> object) = (filterConditions) => {
    const query: object = {
      targetKdtId: props.targetKdtId || _global.kdtId,
      teacherNo: props.teacherNo,
      courseTitle: filterConditions.courseTitle,
    };
    if (filterConditions.courseType) {
      query['courseType'] = filterConditions.courseType;
    }
    return query;
  };

  const exportDataUrl = useMemo(() => {
    return getExportRecordUrl({ type: EXPORT_RECORD_TYPES.TEACHER_COURSE_LIST });
  }, []);

  const fetchData = ({ filterConditions, pageConditions }): Promise<IListDataSets | void> => {
    const query: object = getQuery(filterConditions);
    return queryCourseList({
      query,
      pageRequest: pageConditions,
    }).then(resp => {
      return {
        datasets: resp.content || [],
        total: resp.total || 0,
        current: parseInt(pageConditions.pageNumber) || 1,
      };
    }).catch(err => {
      Notify.error(err);
    });
  };

  const onCourseExport = (data: Partial<ICourseFilter>): void => {
    const query: object = getQuery(data);
    exportCourseList({
      query,
    }).then((resp: boolean) => {
      if (resp) {
        Notify.success('导出列表成功');
        window.open(exportDataUrl);
      }
    }).catch(err => {
      Notify.error(err);
    });
  };

  const renderBottomAction: FC<{submit: ()=>void, reset: ()=>void, data: ()=>any}> = (filter) => {
    const { submit, reset, data } = filter;
    const filterData: Partial<ICourseFilter> = data();
    return (
      <>
        <SamButton type="primary" onClick={submit}>
          筛选
        </SamButton>
        <SamButton onClick={() => onCourseExport(filterData)}>
          导出报表
        </SamButton>
        <SamButton onClick={() => { window.open(exportDataUrl); }}>
          查看已生成的报表
        </SamButton>
        <span className="filter__actions__reset" onClick={reset}>
          重置筛选条件
        </span>
      </>
    );
  };

  return (
    <div className="course-list-grid">
      <VisList>
        <VisFilterTable
          filterProps={
            {
              defaultValue: defaultCourseOptions,
              options: courseOptions,
              bottomActions: renderBottomAction,
            }
          }
          tableProps={
            {
              columns: courseColumns(),
              fetchData: fetchData,
              rowKey: 'createdAt',
              pageConfig: {
                current: 1,
                pageSize: 20,
              },
            }
          }
        >
        </VisFilterTable>
      </VisList>
    </div>
  );
};

export default Courselist;
