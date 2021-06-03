import React, { FC, useCallback, useState } from 'react';
import { Button, Notify } from 'zent';
import { IBlockBaseProps } from '../../types';
import { IListProps } from '@youzan/ebiz-components/es/types/easy-list';
import { EasyList } from '@youzan/ebiz-components';
import { getExportRecordUrl, EXPORT_RECORD_TYPES } from '@ability-center/ump/export-record';

import { getStatsStudentsList, exportStastStudentInfo } from '../../../../api';

import { filterConfig, columnsConfig } from './config';
const { List, Filter, EasyGrid } = EasyList;

const exportListLink = getExportRecordUrl({ type: EXPORT_RECORD_TYPES.EXAM_STUDENT });

const Index: FC<IBlockBaseProps> = ({ examTemplateId }) => {
  const [loading, setIsLoading] = useState<boolean>(false);

  const fetchList: IListProps['onSubmit'] = useCallback(filter => {
    const [
      examUserQuery,
      pageRequest
    ] = formatFilter(filter, examTemplateId);

    return getStatsStudentsList({ examUserQuery, pageRequest })
      .then((res) => {
      // @ts-ignore
        const { content, total } = res;
        return {
          dataset: content,
          pageInfo: {
            total,
            page: pageRequest.pageNumber,
          },
        };
      });
  }, [examTemplateId]);

  const exportStudentsInfo = useCallback(filter => {
    setIsLoading(true);
    const [ examUserQuery ] = formatFilter(filter, examTemplateId);
    Notify.success('正在申请导出...');
    return exportStastStudentInfo(examUserQuery)
      .then((res) => {
        if (res) {
          Notify.success('导出成功');
          window.open(exportListLink, '_blank');
        } else {
          Notify.error('导出失败');
        }
      }).catch((msg) => {
        Notify.error(msg || '导出失败');
      }).finally(
        () => {
          setIsLoading(false);
        }
      );
  }, [examTemplateId]);

  return (
    <section className="statspage__students">
      <List mode="none" onSubmit={fetchList} defaultFilter={{ pageSize: 10 }}>
        <Filter
          config={filterConfig}
          actionsOption={{
            beforeReset(filter) {
              return [
                <Button
                  key="button"
                  loading={loading}
                  onClick={() => exportStudentsInfo(filter.getCurrentValues())}
                >
                导出
                </Button>,
                <Button
                  key="link"
                  bordered={false}
                  outline
                  type="primary"
                  className="statspage__students-export-list-link"
                  href={exportListLink}
                  target="_blank">
                  查看已导出列表
                </Button>
              ];
            }
          }}
        />
        <EasyGrid
          rowKey="answerPaperId"
          columns={columnsConfig}
          scroll={{ x: 1000 }}
        />
      </List>
    </section>
  );
};

export default Index;

function formatFilter(filter: Record<string, any>, examTemplateId:number): Record<string, any>[] {
  const { page,
    pageSize,
    sortBy: orderBy = '1',
    sortType: order = 'DESC',
    userName,
    submittedStatus = '-1',
    timeType = '1',
    dateRange = []
  } = filter;
  // console.log(submitDateRange, reviewerId, examUserName, submitDateRange, 'status', status);
  const examUserQuery: Record<string, any> = {
    examTemplateId,
    submittedStatus,
  };

  if (order && orderBy) {
    examUserQuery.orderBy = orderBy;
    examUserQuery.order = order.toUpperCase();
  }

  if (userName) {
    examUserQuery.userName = userName;
  }

  if (Array.isArray(dateRange) && dateRange.length > 0) {
    examUserQuery.timeType = timeType;
    const [startTime, endTime] = dateRange[0];
    if (startTime) {
      examUserQuery.startTime = startTime;
    }
    if (endTime) {
      examUserQuery.endTime = endTime;
    }
  }

  const pageRequest = {
    pageNumber: page,
    pageSize
  };

  return [
    examUserQuery,
    pageRequest
  ];
}
