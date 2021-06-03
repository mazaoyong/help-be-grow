import React, { FC } from 'react';
import VisList, { VisFilter, VisGrid } from 'components/vis-list';
import { scheduleOptions, defaultScheduleOptions, scheduleColumns } from './schedule-columns';
import { Button as SamButton, Notify } from 'zent';
import { IListDataSets, TTeacherDetailParams, IScheduleFilter } from '../interface';
import { getScheduleListAPI } from '../../../api/teachers';
import './index.scss';

const ScheduleList: FC<TTeacherDetailParams> = (props) => {
  const fetchData = ({ filterConditions, pageConditions }): Promise<IListDataSets | void> => {
    const query: object = {
      kdtId: props.targetKdtId || _global.kdtId,
      teacherNo: props.teacherNo,
      eduCourseName: filterConditions.eduCourseName,
    };
    if (filterConditions.dateRange && filterConditions.dateRange.length === 2) {
      query['startTime'] = new Date(filterConditions.dateRange[0]).getTime();
      query['endTime'] = new Date(filterConditions.dateRange[1]).getTime();
    }
    return getScheduleListAPI({
      query,
      page: {
        pageSize: pageConditions.pageSize,
        pageNumber: pageConditions.pageNumber,
      },
    }).then(resp => {
      return {
        datasets: resp.content || [],
        total: resp.total || 0,
        current: parseInt(pageConditions.pageNumber),
      };
    }).catch(err => {
      Notify.error(err);
    });
  };

  const renderBottomAction: FC<{submit: ()=>void, reset: ()=>void, data: ()=>any}> = (filter) => {
    const { submit, reset, data } = filter;
    const filterData: Partial<IScheduleFilter> = data();
    const onSubmit: (data: Partial<IScheduleFilter>) => void = (data) => {
      if (!data.dateRange || !data.dateRange[0] || !data.dateRange[1]) {
        Notify.error('请选择开始时间和结束时间');
        return;
      }
      submit();
    };

    return (
      <>
        <SamButton type="primary" onClick={() => onSubmit(filterData)}>
          筛选
        </SamButton>
        <span className="filter__actions__reset" onClick={reset}>
          重置筛选条件
        </span>
      </>
    );
  };

  return (
    <div className="schedule-list-grid">
      <VisList>
        <VisFilter
          defaultValue={defaultScheduleOptions}
          options={scheduleOptions}
          bottomActions={renderBottomAction}
        />
        <VisGrid
          columns={scheduleColumns()}
          fetchData={fetchData}
          rowKey='createdAt'
          scroll={{ x: 1200 }}
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

export default ScheduleList;
