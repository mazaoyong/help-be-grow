import React, { FC, useState, useEffect, useMemo } from 'react';
import VisList, { VisFilter, VisGrid } from 'components/vis-list';
import { recordOptions, defaultRecordOptions, recordColumns } from './record-columns';
import { Button as SamButton, Notify } from 'zent';
import { IListDataSets, IScheduleFilter, TTeacherDetailParams, IStatistics, IFetchConditions } from '../interface';
import RecordStatistics from '../record-statistics';
import { format } from 'date-fns';
import { queryLessonList, exportLessonList, queryTeacherLessonStatistics } from '../../../api/teachers';
import { validDateRange, getCurrentMonth } from '../time-utils';
import { getExportRecordUrl, EXPORT_RECORD_TYPES } from '@ability-center/ump/export-record';
import './index.scss';

const RecordList: FC<TTeacherDetailParams> = (props) => {
  const [statistics, setStatistics] = useState<Partial<IStatistics>>({});
  // const filterConf = useRef({}) as any;
  useEffect(() => {
    fetchStatisticsData({});
  }, []);

  const getQuery: ((iProps: IFetchConditions['filterConditions'])=> object) = (filterConditions) => {
    const query: object = {
      targetKdtId: props.targetKdtId || _global.kdtId,
      teacherNo: props.teacherNo,
      eduCourseName: filterConditions.eduCourseName,
    };
    if (filterConditions.dateRange && filterConditions.dateRange.length === 2) {
      query['startDate'] = format(filterConditions.dateRange[0], 'YYYY-MM-DD HH:mm:ss');
      query['endDate'] = format(filterConditions.dateRange[1], 'YYYY-MM-DD HH:mm:ss');
    }
    return query;
  };

  const exportDataUrl = useMemo(() => {
    return getExportRecordUrl({ type: EXPORT_RECORD_TYPES.TEACHER_TEACH_LIST });
  }, []);

  const fetchStatisticsData: ((iProps: IFetchConditions['filterConditions'])=>void) =
  (filterConditions) => {
    const query: object = getQuery(filterConditions);
    return queryTeacherLessonStatistics({
      query,
    }).then((resp: IStatistics) => {
      if (resp) {
        setStatistics(resp);
      }
    }).catch(err => {
      Notify.error(err);
    });
  };

  const fetchData: ((iProps : IFetchConditions)=>Promise<IListDataSets | void>) =
  ({ filterConditions, pageConditions }) => {
    const query: object = getQuery(filterConditions);
    return queryLessonList({
      query,
      pageRequest: {
        pageSize: pageConditions.pageSize,
        pageNumber: pageConditions.pageNumber,
      },
    }).then(resp => {
      return {
        datasets: resp.content || [],
        total: resp.total || 0,
        current: resp ? resp.pageable.pageNumber : 1,
      };
    }).catch(err => {
      Notify.error(err);
    });
  };

  const onRecordExport = (data: Partial<IScheduleFilter>): void => {
    const query: object = getQuery(data);
    exportLessonList({
      query,
    }).then(resp => {
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
    const filterData: Partial<IScheduleFilter> = data();
    const onSubmit = (data: Partial<IScheduleFilter>): void => {
      const errMessage = validDateRange(data.dateRange);
      if (!errMessage) {
        fetchStatisticsData(data);
        submit();
      } else {
        Notify.error(errMessage);
      }
    };
    return (
      <>
        <SamButton type="primary" onClick={() => onSubmit(filterData)}>
          筛选
        </SamButton>
        <SamButton onClick={() => onRecordExport(filterData)}>
          导出报表
        </SamButton>
        <SamButton onClick={() => { window.open(exportDataUrl); }}>
          查看已生成的报表
        </SamButton>
        <span className="filter__actions__reset" onClick={() => {
          fetchStatisticsData({
            dateRange: getCurrentMonth(),
            eduCourseName: '',
          });
          reset();
        }}>
          重置筛选条件
        </span>
      </>
    );
  };

  return (
    <div className="record-list-grid">
      <VisList>
        <VisFilter
          defaultValue={defaultRecordOptions}
          options={recordOptions()}
          bottomActions={renderBottomAction}
        />
        <RecordStatistics
          {...statistics}
        />
        <VisGrid
          columns={recordColumns()}
          fetchData={fetchData}
          rowKey='createdAt'
          scroll={{ x: 1000 }}
          selectable={false}
          pageConfig={{
            current: 1,
            pageSize: 20,
          }}
        />
      </VisList>
    </div>
  );
};

export default RecordList;
