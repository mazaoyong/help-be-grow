import React from 'react';
import { Select } from '@youzan/ebiz-components';

import { findPage as getEduTeacherListAPI } from '../../schedule/api';

import type { IEbizSelectAsyncProps } from '@youzan/ebiz-components/es/types/select';

const STATIC_SORT = {
  orders: [{ direction: 'DESC', property: 'created_at' }],
};
export const ALL_OPTION = { text: '全部', value: 'all' };
interface ITeacherFilterSelectorProps extends Record<string, any> {
  targetKdtId?: number;
}
export const TeacherFilterSelector: React.FC<ITeacherFilterSelectorProps> = (props) => {
  const { targetKdtId = _global.kdtId, ...restProps } = props;
  const fetchStudentList = React.useCallback<IEbizSelectAsyncProps['fetchOptions']>(
    (query, pageRequest) => {
      const { current, pageSize = 30 } = pageRequest;
      return getEduTeacherListAPI({
        query: {
          keyword: query,
          kdtId: targetKdtId,
        },
        pageRequest: {
          pageNumber: current,
          pageSize,
          sort: STATIC_SORT,
        },
      }).then(({ content, total, pageable }) => {
        const prefixOpt = current === 1 ? [ALL_OPTION] : [];
        return {
          options: prefixOpt.concat(
            (content as any[]).map((item = {}, index) => ({
              text: item.teacherName ? `${item.staffName}(${item.teacherName})` : item.staffName,
              value: item.id || current * pageSize + index,
            })),
          ),
          pageInfo: {
            total: total + 1,
            current: pageable.pageNumber,
          },
        };
      });
    },
    [targetKdtId],
  );
  return (
    <div className="student-selector">
      <Select {...restProps} mode="async" filter fetchOnOpened fetchOptions={fetchStudentList} />
    </div>
  );
};
