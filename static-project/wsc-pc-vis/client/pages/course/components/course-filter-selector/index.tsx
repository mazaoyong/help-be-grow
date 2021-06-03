import React from 'react';
import { Select } from '@youzan/ebiz-components';

import { getCourseList } from '../../api/educourse';

import type { IEbizSelectAsyncProps } from '@youzan/ebiz-components/es/types/select';

export const ALL_OPTION = { text: '全部', value: 'all' };
interface ICourseSelectorProps extends Record<string, any> {
  targetKdtId?: number;
}
export const CourseFilterSelector: React.FC<ICourseSelectorProps> = (props) => {
  const { targetKdtId = _global.kdtId, ...restProps } = props;
  const fetchStudentList = React.useCallback<IEbizSelectAsyncProps['fetchOptions']>(
    (query, pageRequest) => {
      return getCourseList({
        name: query,
        kdtId: targetKdtId,
        pageNumber: pageRequest.current,
        pageSize: 30,
      }).then(({ content, total, pageable }) => {
        const prefixOpt = pageRequest.current === 1 ? [ALL_OPTION] : [];
        return {
          options: prefixOpt.concat(
            (content as any[]).map((item = {}) => ({
              text: item.name,
              value: item.id || 0,
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
      <Select {...restProps} filter mode="async" fetchOnOpened fetchOptions={fetchStudentList} />
    </div>
  );
};
